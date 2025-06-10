import React from "react";

const AdminPage = () => {
  // Sample hospital data (matching your image's structure)
  const patients = [
    {
      id: "000555300",
      name: "Mr. Charles Paul",
      gender: "Male",
      age: 52,
      role: "Patient",
      type: "Individual",
      residentStatus: "Resident",
      profile: "SAL",
      financialApp: "Yes",
      assessment: "Net Salary",
      status: "Yet to start",
    },
    {
      id: "000555301",
      name: "Ms. Sasha Maya",
      gender: "Female",
      age: 28,
      role: "Emergency",
      type: "Individual",
      residentStatus: "Non-Resident",
      profile: "SE",
      financialApp: "Yes",
      assessment: "Income Plus",
      status: "Yet to start",
    },
    // Add more as needed...
  ];

  return (
    <div className="p-6 font-sans">
      {/* Header (matching your image's title style) */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Hospital Patient Management</h1>
      <div className="border-b-2 border-gray-300 mb-6"></div>

      {/* Patient Summary Section (like "Loan Product" in your image) */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-bold text-lg mb-2">Patient Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-semibold">Hospital</p>
            <p>General Hospital</p>
          </div>
          <div>
            <p className="font-semibold">Department</p>
            <p>Emergency</p>
          </div>
          <div>
            <p className="font-semibold">Entry Date</p>
            <p>02/05/2024</p>
          </div>
        </div>
      </div>

      {/* Doctor Assigned Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-bold text-lg mb-2">Doctor Assigned</h2>
        <p>Dr. Rajesh Chawla, MD</p>
      </div>

      {/* Table (identical to your image's layout) */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border text-left font-semibold">Name</th>
              <th className="py-3 px-4 border text-left font-semibold">Gender</th>
              <th className="py-3 px-4 border text-left font-semibold">Age</th>
              <th className="py-3 px-4 border text-left font-semibold">Role</th>
              <th className="py-3 px-4 border text-left font-semibold">Type</th>
              <th className="py-3 px-4 border text-left font-semibold">Resident Status</th>
              <th className="py-3 px-4 border text-left font-semibold">Profile</th>
              <th className="py-3 px-4 border text-left font-semibold">Financial App</th>
              <th className="py-3 px-4 border text-left font-semibold">Assessment</th>
              <th className="py-3 px-4 border text-left font-semibold">Progress</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr 
                key={patient.id} 
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-2 px-4 border">{patient.name}</td>
                <td className="py-2 px-4 border">{patient.gender}</td>
                <td className="py-2 px-4 border">{patient.age}</td>
                <td className="py-2 px-4 border">{patient.role}</td>
                <td className="py-2 px-4 border">{patient.type}</td>
                <td className="py-2 px-4 border">{patient.residentStatus}</td>
                <td className="py-2 px-4 border">{patient.profile}</td>
                <td className="py-2 px-4 border">{patient.financialApp}</td>
                <td className="py-2 px-4 border">{patient.assessment}</td>
                <td className="py-2 px-4 border">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;