import React, { useState, useEffect } from "react";
import { supabase } from '../../supabaseClient';
import { format, parseISO, differenceInMinutes, startOfDay, addDays } from 'date-fns'; // <<< TAMBAHKAN startOfDay, addDays

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentPatientActivity, setRecentPatientActivity] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [departmentCapacities, setDepartmentCapacities] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingCapacities, setLoadingCapacities] = useState(true);
  const [error, setError] = useState(null);

  // --- Ambil Statistik Dasbor ---
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const { count: totalPatients } = await supabase
          .from('patients')
          .select('id', { count: 'exact', head: true });

        const today = format(new Date(), 'yyyy-MM-dd');

        const { count: checkedInToday } = await supabase
          .from('tickets')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_date', today)
          .in('status', ['checked_in', 'called', 'completed']);

        const { count: criticalPatients } = await supabase
          .from('tickets')
          .select('id', { count: 'exact', head: true })
          .eq('priority', 'emergency')
          .not('status', 'in', '("completed", "cancelled", "no_show")');

        // --- PERBAIKAN KUERI UNTUK "Kunjungan Selesai Hari Ini" ---
        // Hitung tiket yang 'completed_at' berada di antara awal hari ini dan awal hari besok
        const startOfToday = format(startOfDay(new Date()), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"); // Format ISO dengan Z atau offset
        const startOfTomorrow = format(addDays(startOfDay(new Date()), 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"); // Format ISO dengan Z atau offset

        const { count: completedToday, error: completedError } = await supabase
          .from('tickets')
          .select('id', { count: 'exact', head: true })
          .gte('completed_at', startOfToday) // Greater than or equal to start of today
          .lt('completed_at', startOfTomorrow); // Less than start of tomorrow

        if (completedError) throw completedError; // Tangani error jika ada

        setStats([
          { title: "Total Pasien Terdaftar", value: totalPatients ? totalPatients.toLocaleString() : '0', icon: "👥", color: "bg-blue-500" },
          { title: "Check-in Hari Ini", value: checkedInToday ? checkedInToday.toLocaleString() : '0', icon: "🚶", color: "bg-green-500" },
          { title: "Tiket Darurat Aktif", value: criticalPatients ? criticalPatients.toLocaleString() : '0', icon: "🚨", color: "bg-red-500" },
          { title: "Kunjungan Selesai Hari Ini", value: completedToday ? completedToday.toLocaleString() : '0', icon: "✅", color: "bg-purple-500" },
        ]);

      } catch (err) {
        console.error("Error fetching stats:", err.message);
        setError("Gagal memuat statistik dasbor.");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // --- Ambil Aktivitas Pasien Terbaru ---
  useEffect(() => {
    const fetchRecentActivity = async () => {
      setLoadingRecent(true);
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            id,
            queue_number,
            status,
            created_at,
            patient:patient_id ( full_name ),
            department:department_id ( name )
          `)
          .in('status', ['completed', 'cancelled', 'no_show'])
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error("Error fetching recent activity:", error.message);
        } else {
          setRecentPatientActivity(data.map(ticket => ({
            id: ticket.id,
            name: ticket.patient?.full_name || 'N/A',
            department: ticket.department?.name || 'N/A',
            status: ticket.status,
            time: format(parseISO(ticket.created_at), 'HH:mm'), // Menggunakan HH:mm untuk WIB
          })));
        }
      } catch (err) {
        console.error("Unexpected error fetching recent activity:", err.message);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecentActivity();
  }, []);

  // --- Ambil Janji Temu Hari Ini ---
  useEffect(() => {
    const fetchTodaysAppointments = async () => {
      setLoadingAppointments(true);
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            id,
            assigned_time,
            patient:patient_id ( full_name ),
            department:department_id ( name )
          `)
          .eq('assigned_date', today)
          .eq('status', 'confirmed')
          .order('assigned_time', { ascending: true })
          .limit(5);

        if (error) {
          console.error("Error fetching appointments:", error.message);
        } else {
          setTodaysAppointments(data.map(ticket => ({
            time: ticket.assigned_time ? format(new Date(`2000-01-01T${ticket.assigned_time}`), 'HH:mm') : 'N/A',
            patient: ticket.patient?.full_name || 'N/A',
            doctor: 'TBD',
            department: ticket.department?.name || 'N/A',
          })));
        }
      } catch (err) {
        console.error("Unexpected error fetching appointments:", err.message);
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchTodaysAppointments();
  }, []);

  // --- Ambil Kapasitas Departemen ---
  useEffect(() => {
    const fetchDepartmentCapacities = async () => {
      setLoadingCapacities(true);
      try {
        const { data: departmentsData, error: deptError } = await supabase
          .from('departments')
          .select('id, name, max_capacity');

        if (deptError) throw deptError;

        const { data: activeTicketsData, error: ticketsError } = await supabase
          .from('tickets')
          .select('department_id', { count: 'exact' })
          .not('status', 'in', '("completed", "cancelled", "no_show")');

        if (ticketsError) throw ticketsError;

        const activeTicketsByDept = activeTicketsData.reduce((acc, ticket) => {
          acc[ticket.department_id] = (acc[ticket.department_id] || 0) + 1;
          return acc;
        }, {});

        const capacities = departmentsData.map(dept => {
          const patientsInQueue = activeTicketsByDept[dept.id] || 0;
          const capacity = dept.max_capacity || 1;
          const percentage = capacity > 0 ? Math.round((patientsInQueue / capacity) * 100) : 0;
          return {
            name: dept.name,
            patients: patientsInQueue,
            capacity: dept.max_capacity,
            percentage: percentage,
          };
        }).sort((a, b) => b.percentage - a.percentage);

        setDepartmentCapacities(capacities);

      } catch (err) {
        console.error("Error fetching department capacities:", err.message);
      } finally {
        setLoadingCapacities(false);
      }
    };
    fetchDepartmentCapacities();
  }, []);

  const overallLoading = loadingStats || loadingRecent || loadingAppointments || loadingCapacities;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Dasbor Rumah Sakit</h1>
        <p className="text-gray-600">Selamat datang kembali! Ini adalah yang terjadi di rumah sakit Anda hari ini. (Per {format(new Date(), 'MMM dd,PPPP HH:mm')})</p>
      </div>

      {overallLoading && (
        <div className="text-center py-10">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
          <p className="mt-2 text-lg text-gray-700">Memuat data dasbor...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {!overallLoading && (
        <>
          {/* Kartu Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Pasien Terbaru */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Aktivitas Pasien Terbaru</h2>
              </div>
              <div className="p-6">
                {recentPatientActivity.length === 0 ? (
                  <p className="text-gray-500 text-center">Tidak ada aktivitas pasien terbaru.</p>
                ) : (
                  <div className="space-y-4">
                    {recentPatientActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {activity.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{activity.name}</p>
                            <p className="text-sm text-gray-600">{activity.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            activity.status === 'no_show' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status === 'completed' ? 'Selesai' :
                             activity.status === 'cancelled' ? 'Dibatalkan' :
                             activity.status === 'no_show' ? 'Tidak Hadir' :
                             activity.status}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Janji Temu Mendatang */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Janji Temu Terkonfirmasi Hari Ini</h2>
              </div>
              <div className="p-6">
                {todaysAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center">Tidak ada janji temu terkonfirmasi untuk hari ini.</p>
                ) : (
                  <div className="space-y-4">
                    {todaysAppointments.map((appointment, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-16 text-sm text-blue-600 font-medium">{appointment.time}</div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{appointment.patient}</p>
                          <p className="text-xs text-gray-600">{appointment.doctor}</p>
                          <p className="text-xs text-gray-500">{appointment.department}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kapasitas Departemen */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Kapasitas & Beban Departemen</h2>
            </div>
            <div className="p-6">
              {departmentCapacities.length === 0 ? (
                <p className="text-gray-500 text-center">Tidak ada departemen atau data kapasitas ditemukan.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {departmentCapacities.map((dept, index) => (
                    <div key={index} className="text-center">
                      <h3 className="font-medium text-gray-800 mb-2">{dept.name}</h3>
                      <div className="relative w-20 h-20 mx-auto mb-2">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="2"
                            strokeDasharray={`${dept.percentage}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-800">{dept.percentage}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {dept.patients} {dept.capacity ? `/ ${dept.capacity} kapasitas` : 'aktif'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;