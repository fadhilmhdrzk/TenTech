import React, { useState, useEffect } from "react";
import { supabase } from '../../supabaseClient'; // Adjust path if needed
import { format, parseISO, differenceInMinutes, startOfDay } from 'date-fns'; // For date handling

const AdminDashboard = () => {
  // State for fetched data
  const [stats, setStats] = useState([]);
  const [recentPatientActivity, setRecentPatientActivity] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [departmentCapacities, setDepartmentCapacities] = useState([]);

  // Loading and Error states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingCapacities, setLoadingCapacities] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Dashboard Stats ---
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        // Total Patients
        const { count: totalPatients } = await supabase
          .from('patients')
          .select('id', { count: 'exact', head: true });

        // Today's Check-ins (could be 'checked_in' status today)
        const today = format(new Date(), 'yyyy-MM-dd');
        const { count: checkedInToday } = await supabase
          .from('tickets')
          .select('id', { count: 'exact', head: true })
          .eq('assigned_date', today)
          .in('status', ['checked_in', 'called', 'completed']); // Patients who have arrived or finished today

        // Critical Patients (using 'emergency' priority in tickets)
        const { count: criticalPatients } = await supabase
          .from('tickets')
          .select('id', { count: 'exact', head: true })
          .eq('priority', 'emergency')
          .not('status', 'in', '("completed", "cancelled", "no_show")'); // Only active emergency cases

        // Completed Visits Today
        const { count: completedToday } = await supabase
          .from('tickets')
          .select('id', { count: 'exact', head: true })
          .eq('completed_at', today); // Assuming completed_at stores just date or can be filtered by date

        // NOTE: The 'change' percentages (e.g., +12% from last week) require historical data.
        // This is more complex and would need queries for past periods.
        // For now, these will be static or removed, or you can calculate based on simple daily change.

        setStats([
          { title: "Total Registered Patients", value: totalPatients ? totalPatients.toLocaleString() : '0', icon: "👥", color: "bg-blue-500" },
          { title: "Checked-in Today", value: checkedInToday ? checkedInToday.toLocaleString() : '0', icon: "🚶", color: "bg-green-500" },
          { title: "Active Emergency Tickets", value: criticalPatients ? criticalPatients.toLocaleString() : '0', icon: "🚨", color: "bg-red-500" },
          { title: "Visits Completed Today", value: completedToday ? completedToday.toLocaleString() : '0', icon: "✅", color: "bg-purple-500" },
        ]);

      } catch (err) {
        console.error("Error fetching stats:", err.message);
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []); // Run once on mount

  // --- Fetch Recent Patient Activity (last 10 completed/cancelled/no_show tickets) ---
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
          .in('status', ['completed', 'cancelled', 'no_show']) // Look at recently finalized tickets
          .order('created_at', { ascending: false }) // Most recent first
          .limit(5); // Show top 5 recent activities

        if (error) {
          console.error("Error fetching recent activity:", error.message);
        } else {
          setRecentPatientActivity(data.map(ticket => ({
            id: ticket.id,
            name: ticket.patient?.full_name || 'N/A',
            department: ticket.department?.name || 'N/A',
            status: ticket.status,
            time: format(parseISO(ticket.created_at), 'p'), // Just the time, e.g., 9:30 AM
            // If you want "X hours ago", you'd calculate differenceInMinutes / 60
            // from new Date() to parseISO(ticket.created_at)
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

  // --- Fetch Today's Appointments (Confirmed tickets for today) ---
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
          .eq('status', 'confirmed') // Only confirmed appointments
          .order('assigned_time', { ascending: true }) // Order by time
          .limit(5); // Limit to show a few upcoming

        if (error) {
          console.error("Error fetching appointments:", error.message);
        } else {
          setTodaysAppointments(data.map(ticket => ({
            time: ticket.assigned_time ? format(new Date(`2000-01-01T${ticket.assigned_time}`), 'hh:mm a') : 'N/A',
            patient: ticket.patient?.full_name || 'N/A',
            // Doctor is not directly in tickets, this would require staff assignments
            doctor: 'TBD', // Placeholder, needs actual doctor assignment
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

  // --- Fetch Department Capacity (Active tickets vs. max_capacity) ---
  useEffect(() => {
    const fetchDepartmentCapacities = async () => {
      setLoadingCapacities(true);
      try {
        // Fetch all active departments
        const { data: departmentsData, error: deptError } = await supabase
          .from('departments')
          .select('id, name, max_capacity');

        if (deptError) throw deptError;

        // Fetch counts of currently active tickets for each department
        // Active means not completed, cancelled, or no_show
        const { data: activeTicketsData, error: ticketsError } = await supabase
          .from('tickets')
          .select('department_id', { count: 'exact' })
          .not('status', 'in', '("completed", "cancelled", "no_show")');

        if (ticketsError) throw ticketsError;

        // Group active tickets by department_id
        const activeTicketsByDept = activeTicketsData.reduce((acc, ticket) => {
          acc[ticket.department_id] = (acc[ticket.department_id] || 0) + 1;
          return acc;
        }, {});

        const capacities = departmentsData.map(dept => {
          const patientsInQueue = activeTicketsByDept[dept.id] || 0;
          const capacity = dept.max_capacity || 1; // Prevent division by zero
          const percentage = capacity > 0 ? Math.round((patientsInQueue / capacity) * 100) : 0;
          return {
            name: dept.name,
            patients: patientsInQueue,
            capacity: dept.max_capacity,
            percentage: percentage,
          };
        }).sort((a, b) => b.percentage - a.percentage); // Show most utilized first

        setDepartmentCapacities(capacities);

      } catch (err) {
        console.error("Error fetching department capacities:", err.message);
      } finally {
        setLoadingCapacities(false);
      }
    };
    fetchDepartmentCapacities();
  }, []);

  // Consolidate loading states for overall dashboard loading
  const overallLoading = loadingStats || loadingRecent || loadingAppointments || loadingCapacities;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hospital Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your hospital today. (As of {format(new Date(), 'MMM dd, yyyy HH:mm')})</p>
      </div>

      {overallLoading && (
        <div className="text-center py-10">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
          <p className="mt-2 text-lg text-gray-700">Loading dashboard data...</p>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    {/* Change is static here as it requires historical data */}
                    {/* <p className={`text-sm ${stat.change && stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change || 'N/A'} from last week
                    </p> */}
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Patients */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Recent Patient Activity</h2>
              </div>
              <div className="p-6">
                {recentPatientActivity.length === 0 ? (
                  <p className="text-gray-500 text-center">No recent patient activity.</p>
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
                            {activity.status}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Today's Confirmed Appointments</h2>
              </div>
              <div className="p-6">
                {todaysAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center">No confirmed appointments for today.</p>
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

          {/* Department Capacity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Department Capacity & Load</h2>
            </div>
            <div className="p-6">
              {departmentCapacities.length === 0 ? (
                <p className="text-gray-500 text-center">No departments or capacity data found.</p>
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
                        {dept.patients} {dept.capacity ? `/ ${dept.capacity} capacity` : 'active'}
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