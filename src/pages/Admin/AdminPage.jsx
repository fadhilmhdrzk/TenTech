import React, { useState, useEffect } from "react";
import { supabase } from '/src/supabaseClient'; // Adjust path if necessary
import { format, differenceInYears, parseISO } from 'date-fns'; // For date formatting and age calculation

const AdminPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- THIS IS THE MISSING/INCORRECTLY PLACED FUNCTION ---
  // You must define handlePatientSelect inside the component
  const handlePatientSelect = (patient) => {
    console.log("Patient clicked:", patient); // Keep this for debugging
    setSelectedPatient(patient);
  };
  // -----------------------------------------------------

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('patients')
          .select(`
            id,
            full_name,
            date_of_birth,
            gender,
            phone,
            email,
            medical_record_number,
            national_id_number,
            special_needs,
            created_at
          `)
          .order('full_name', { ascending: true }); // Order by name for easier Browse

        if (error) {
          console.error("Error fetching patients:", error.message);
          setError("Failed to load patients: " + error.message);
        } else {
          setPatients(data);
          // Set the first patient as selected by default if data exists
          if (data.length > 0) {
            setSelectedPatient(data[0]);
          }
        }
      } catch (err) {
        console.error("Unexpected error fetching patients:", err.message);
        setError("An unexpected error occurred while fetching patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []); // Empty dependency array means this runs once on mount

  // Helper function to calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    try {
      return differenceInYears(new Date(), parseISO(dob));
    } catch (e) {
      console.error("Error calculating age:", e);
      return 'N/A';
    }
  };

  // Helper function to format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(parseISO(dateString), 'MMM dd,PPPP'); // Changed to PPPP for full date format
  };


  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
        <p className="ml-2 text-lg text-gray-700">Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="alert alert-error text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-700">No patients found in the database. Please add some via the Guest page!</p>
      </div>
    );
  }

  // Ensure currentPatient is always set after loading and if patients exist
  const displayPatient = selectedPatient || patients[0];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Patient ID */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-lg font-semibold">Patient ID : {displayPatient.id}</h2>
        {/* The "Back" button functionality is not implemented here as it depends on navigation */}
        <button className="btn btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30">
          ← Back
        </button>
      </div>

      {/* Patient Info Section */}
      <div className="bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8">
          {/* Profile Picture and Name */}
          <div className="text-center w-full md:w-auto">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            <h3 className="font-bold text-xl text-gray-800">{displayPatient.full_name}</h3>
            <p className="text-sm text-gray-600">MRN: {displayPatient.medical_record_number || 'N/A'}</p>
          </div>

          {/* Details Grid (using your actual patient data) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 w-full">
            <div>
              <span className="font-semibold text-gray-700">Gender:</span>
              <span className="ml-2 text-gray-600 capitalize">{displayPatient.gender || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Age:</span>
              <span className="ml-2 text-gray-600">{calculateAge(displayPatient.date_of_birth)} years</span>
            </div>
            
            <div>
              <span className="font-semibold text-gray-700">Phone:</span>
              <span className="ml-2 text-gray-600">{displayPatient.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Email:</span>
              <span className="ml-2 text-gray-600">{displayPatient.email || 'N/A'}</span>
            </div>
            
            <div>
              <span className="font-semibold text-gray-700">National ID:</span>
              <span className="ml-2 text-gray-600">{displayPatient.national_id_number || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Special Needs:</span>
              <span className="ml-2 text-gray-600">
                {displayPatient.special_needs ? (
                  <span className="badge badge-warning">Yes</span>
                ) : (
                  <span className="badge badge-info badge-outline">No</span>
                )}
              </span>
            </div>
            {/* Added for clarity */}
            <div>
              <span className="font-semibold text-gray-700">Registered On:</span>
              <span className="ml-2 text-gray-600">{formatDisplayDate(displayPatient.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="divider text-gray-500 text-lg my-6">All Registered Patients</div>

      {/* Data Table */}
      <div className="bg-white shadow-sm rounded-b-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="text-left font-semibold py-3 px-4">Name</th>
                <th className="text-left font-semibold py-3 px-4">Gender</th>
                <th className="text-left font-semibold py-3 px-4">Age</th>
                <th className="text-left font-semibold py-3 px-4">Phone</th>
                <th className="text-left font-semibold py-3 px-4">Email</th>
                <th className="text-left font-semibold py-3 px-4">National ID</th>
                <th className="text-left font-semibold py-3 px-4">MRN</th>
                <th className="text-left font-semibold py-3 px-4">Special Needs</th>
                <th className="text-left font-semibold py-3 px-4">Registered On</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className={`hover:bg-blue-50 cursor-pointer transition-colors ${
                    selectedPatient && selectedPatient.id === patient.id ? 'bg-blue-100' : '' // Highlight selected row
                  }`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <td className="font-medium text-gray-800 py-2 px-4">{patient.full_name}</td>
                  <td className="text-gray-600 py-2 px-4 capitalize">{patient.gender || 'N/A'}</td>
                  <td className="text-gray-600 py-2 px-4">{calculateAge(patient.date_of_birth)}</td>
                  <td className="text-gray-600 py-2 px-4">{patient.phone || 'N/A'}</td>
                  <td className="text-gray-600 py-2 px-4">{patient.email || 'N/A'}</td>
                  <td className="text-gray-600 py-2 px-4">{patient.national_id_number || 'N/A'}</td>
                  <td className="text-gray-600 py-2 px-4">{patient.medical_record_number || 'N/A'}</td>
                  <td className="py-2 px-4">
                    {patient.special_needs ? (
                      <span className="badge badge-warning">Yes</span>
                    ) : (
                      <span className="badge badge-info badge-outline">No</span>
                    )}
                  </td>
                  <td className="text-gray-600 py-2 px-4">{formatDisplayDate(patient.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* The "Submit" button here doesn't have a clear purpose in this context,
          as this page is for viewing/selecting patients. If it's for something
          like assigning a patient to a doctor or starting a process, that logic
          would need to be added. For now, it's just a placeholder. */}
      <div className="flex justify-end mt-6">
        <button className="btn btn-primary btn-wide">
          Submit (Action needed)
        </button>
      </div>
    </div>
  );
};

export default AdminPage;