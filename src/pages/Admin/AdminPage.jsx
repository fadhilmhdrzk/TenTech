import React, { useState } from "react";

const AdminPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Sample hospital data
  const patients = [
    {
      id: "000555300",
      name: "Mr. Charles Paul",
      branchId: "ICIC0000007",
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
      name: "Mr. Mithun Kumar",
      branchId: "ICIC0000008",
      gender: "Male",
      age: 35,
      role: "Co Patient",
      type: "Individual", 
      residentStatus: "Non Resident",
      profile: "SE",
      financialApp: "Yes",
      assessment: "BT+Top Up",
      status: "Yet to start",
    },
    {
      id: "000555302",
      name: "Ms. Sasha Maya", 
      branchId: "ICIC0000009",
      gender: "Female",
      age: 28,
      role: "Guardian",
      type: "Individual",
      residentStatus: "Non Resident", 
      profile: "SE",
      financialApp: "Yes",
      assessment: "Income Plus",
      status: "Yet to start",
    },
    {
      id: "000555303",
      name: "Ms. Natasha",
      branchId: "ICIC0000010", 
      gender: "Female",
      age: 31,
      role: "Co Patient",
      type: "Non Individual",
      residentStatus: "Non Resident",
      profile: "SAL", 
      financialApp: "Yes",
      assessment: "Gross Salary",
      status: "Yet to start",
    },
  ];

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const currentPatient = selectedPatient || patients[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">

      {/* Main Content */}
      <div className="ml-20 min-h-screen">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <h1 className="text-xl font-semibold text-gray-700">Patient Data Entry</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="input input-bordered w-64 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <select className="select select-bordered">
              <option>Assigned to</option>
            </select>
            
            <select className="select select-bordered">
              <option>Location</option>
            </select>
            
            <select className="select select-bordered">
              <option>By Date</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="font-medium">Manpreet Singh</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Header with Application ID */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold">Application ID : {currentPatient.id}</h2>
            <button className="btn btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30">
              ← Back
            </button>
          </div>

          {/* Patient Info Section */}
          <div className="bg-white p-6 shadow-sm">
            <div className="flex items-start space-x-8">
              {/* Profile Picture and Name */}
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-800">{currentPatient.name}</h3>
                <p className="text-sm text-gray-600">Branch ID: {currentPatient.branchId}</p>
              </div>

              {/* Details Grid */}
              <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <span className="font-semibold text-gray-700">Treatment Type:</span>
                  <span className="ml-2 text-gray-600">Emergency Care</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Doctor Assigned:</span>
                  <span className="ml-2 text-gray-600">Dr. Rajesh Chawla, MD</span>
                </div>
                
                <div>
                  <span className="font-semibold text-gray-700">Department:</span>
                  <span className="ml-2 text-gray-600">Emergency Medicine</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Treatment Plan:</span>
                  <span className="ml-2 text-gray-600">Comprehensive Care</span>
                </div>
                
                <div>
                  <span className="font-semibold text-gray-700">Admission Date:</span>
                  <span className="ml-2 text-gray-600">02/05/2019</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Estimated Cost:</span>
                  <span className="ml-2 text-gray-600">₹200,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white shadow-sm rounded-b-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="text-left font-semibold">Name</th>
                    <th className="text-left font-semibold">Gender</th>
                    <th className="text-left font-semibold">Age</th>
                    <th className="text-left font-semibold">Application Owner</th>
                    <th className="text-left font-semibold">Application Type</th>
                    <th className="text-left font-semibold">Residential Status</th>
                    <th className="text-left font-semibold">Profile</th>
                    <th className="text-left font-semibold">Financial Application</th>
                    <th className="text-left font-semibold">Assessment Methodology</th>
                    <th className="text-left font-semibold">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr 
                      key={patient.id} 
                      className={`hover:bg-blue-50 cursor-pointer transition-colors ${
                        currentPatient.id === patient.id ? 'bg-blue-50' : index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <td className="font-medium text-gray-800">{patient.name}</td>
                      <td className="text-gray-600">{patient.gender}</td>
                      <td className="text-gray-600">{patient.age}</td>
                      <td className="text-gray-600">{patient.role}</td>
                      <td className="text-gray-600">{patient.type}</td>
                      <td className="text-gray-600">{patient.residentStatus}</td>
                      <td>
                        <span className="badge badge-outline badge-primary">
                          {patient.profile}
                        </span>
                      </td>
                      <td className="text-gray-600">{patient.financialApp}</td>
                      <td className="text-gray-600">{patient.assessment}</td>
                      <td>
                        <span className="badge badge-warning">
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button className="btn btn-primary btn-wide">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;