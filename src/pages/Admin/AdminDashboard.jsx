import React from "react";

const AdminDashboard = () => {
  // Sample dashboard data
  const stats = [
    { title: "Total Patients", value: "1,247", change: "+12%", icon: "👥", color: "bg-blue-500" },
    { title: "Active Cases", value: "89", change: "+5%", icon: "🏥", color: "bg-green-500" },
    { title: "Critical Patients", value: "12", change: "-2%", icon: "🚨", color: "bg-red-500" },
    { title: "Discharged Today", value: "23", change: "+8%", icon: "✅", color: "bg-purple-500" },
  ];

  const recentPatients = [
    { id: "P001", name: "John Doe", department: "Cardiology", status: "Critical", time: "2 hours ago" },
    { id: "P002", name: "Jane Smith", department: "Emergency", status: "Stable", time: "4 hours ago" },
    { id: "P003", name: "Mike Johnson", department: "Surgery", status: "Recovery", time: "6 hours ago" },
    { id: "P004", name: "Sarah Wilson", department: "Pediatrics", status: "Discharged", time: "8 hours ago" },
  ];

  const upcomingAppointments = [
    { time: "09:00 AM", patient: "Robert Brown", doctor: "Dr. Smith", department: "Cardiology" },
    { time: "10:30 AM", patient: "Lisa Davis", doctor: "Dr. Johnson", department: "Neurology" },
    { time: "02:00 PM", patient: "David Wilson", doctor: "Dr. Williams", department: "Orthopedics" },
    { time: "03:30 PM", patient: "Emma Garcia", doctor: "Dr. Brown", department: "Dermatology" },
  ];

  const departmentStats = [
    { name: "Emergency", patients: 45, capacity: 60, percentage: 75 },
    { name: "ICU", patients: 12, capacity: 20, percentage: 60 },
    { name: "Surgery", patients: 8, capacity: 12, percentage: 67 },
    { name: "Pediatrics", patients: 25, capacity: 30, percentage: 83 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hospital Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your hospital today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last week
                </p>
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
            <div className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'Critical' ? 'bg-red-100 text-red-800' :
                      patient.status === 'Stable' ? 'bg-green-100 text-green-800' :
                      patient.status === 'Recovery' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{patient.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Today's Appointments</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
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
          </div>
        </div>
      </div>

      {/* Department Capacity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Department Capacity</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departmentStats.map((dept, index) => (
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
                <p className="text-sm text-gray-600">{dept.patients}/{dept.capacity} beds</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;