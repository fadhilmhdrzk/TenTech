import { useState, useEffect } from 'react';
import { supabase } from '/src/supabaseClient'; // Make sure this path is correct
import { format } from 'date-fns'; // For formatting the assigned date

export default function Guest() {
  // Patient-related states
  const [fullName, setFullName] = useState(''); // Changed from 'name' to 'fullName'
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationalIdNumber, setNationalIdNumber] = useState(''); // e.g., KTP/NIK
  const [medicalRecordNumber, setMedicalRecordNumber] = useState(''); // Existing MRN if applicable
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [reasonForVisit, setReasonForVisit] = useState(''); // New ticket field

  // Ticket-related states
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(''); // Changed from 'selectedDept' for clarity
  const [assignedDate, setAssignedDate] = useState(format(new Date(), 'yyyy-MM-dd')); // Defaults to today
  const [priority, setPriority] = useState('normal'); // Defaults to 'normal'

  // UI states
  const [ticketNumber, setTicketNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Fetch department list on load ---
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, description') // Also fetch description
        .eq('is_active', true) // Only fetch active departments
        .order('name', { ascending: true }); // Order departments alphabetically

      if (error) {
        console.error('Error fetching departments:', error.message);
        setSubmissionError('Failed to load departments. Please try again.');
      } else {
        setDepartments(data);
        if (data.length > 0) {
          setSelectedDeptId(data[0].id); // Pre-select the first department
        }
      }
    };
    fetchDepartments();
  }, []);

  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionError(null);
    setShowSuccess(false);

    try {
      let patientId;
      // 1. Check if patient exists by national_id_number or medical_record_number
      // (This logic can be more sophisticated, e.g., prompt user if multiple matches)
      let { data: existingPatients, error: patientSearchError } = await supabase
        .from('patients')
        .select('id')
        .or(`national_id_number.eq.${nationalIdNumber},medical_record_number.eq.${medicalRecordNumber}`);

      if (patientSearchError) throw patientSearchError;

      if (existingPatients && existingPatients.length > 0) {
        // Patient exists, use their ID
        patientId = existingPatients[0].id;
        // Optionally, update existing patient data here if allowed
        const { error: updateError } = await supabase
            .from('patients')
            .update({
                full_name: fullName,
                date_of_birth: dateOfBirth,
                gender: gender,
                phone: phone,
                email: email,
                special_needs: specialNeeds
                // national_id_number and medical_record_number should not be updated if they are used for lookup
            })
            .eq('id', patientId);

        if (updateError) {
            console.warn("Warning: Could not update existing patient data.", updateError.message);
            // Don't throw, just log a warning. The core action is creating a ticket.
        }

      } else {
        // Patient does not exist, insert new patient
        const { data: newPatientData, error: patientInsertError } = await supabase
          .from('patients')
          .insert({
            full_name: fullName,
            date_of_birth: dateOfBirth,
            gender: gender,
            phone: phone,
            email: email,
            national_id_number: nationalIdNumber,
            medical_record_number: medicalRecordNumber,
            special_needs: specialNeeds,
          })
          .select('id')
          .single();

        if (patientInsertError) throw patientInsertError;
        patientId = newPatientData.id;
      }

      // 2. Generate ticket number for the assigned date and department
      // This is a more robust way to generate a unique ticket number per day per department
      const { count: ticketsTodayInDept } = await supabase
        .from('tickets')
        .select('id', { count: 'exact', head: true })
        .eq('department_id', selectedDeptId)
        .eq('assigned_date', assignedDate);

      // Get department prefix (e.g., first letter of department name)
      const selectedDepartment = departments.find(d => d.id === selectedDeptId);
      const deptPrefix = selectedDepartment ? selectedDepartment.name.charAt(0).toUpperCase() : 'Z';
      const ticketNum = `${deptPrefix}${String(ticketsTodayInDept + 1).padStart(3, '0')}`; // e.g., A001, P005

      // 3. Insert ticket
      const { data: ticketData, error: ticketErr } = await supabase
        .from('tickets')
        .insert({
          patient_id: patientId,
          department_id: selectedDeptId,
          assigned_date: assignedDate,
          priority: priority,
          reason_for_visit: reasonForVisit,
          queue_number: ticketNum, // Use the generated ticket number
          status: 'pending' // Initial status is 'pending' for guest submissions
        })
        .select('queue_number') // Select only the queue_number for display
        .single();

      if (ticketErr) throw ticketErr;

      setTicketNumber(ticketData.queue_number);
      setShowSuccess(true); // Indicate success
      // Optionally reset form fields here
      resetForm();

    } catch (err) {
      console.error('Error creating ticket:', err.message);
      setSubmissionError(`Failed to submit ticket: ${err.message}. Please check your input.`);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset form fields after submission
  const resetForm = () => {
    setFullName('');
    setDateOfBirth('');
    setGender('');
    setPhone('');
    setEmail('');
    setNationalIdNumber('');
    setMedicalRecordNumber('');
    setSpecialNeeds(false);
    setReasonForVisit('');
    setAssignedDate(format(new Date(), 'yyyy-MM-dd')); // Reset to today
    setPriority('normal');
    // Keep selectedDeptId if it's auto-selected, or reset to ''
    // setSelectedDeptId('');
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg my-8">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Get Your Hospital Ticket</h1>
      <p className="text-center text-gray-600 mb-6">Please fill in your details to get a queue number for your visit.</p>

      {submissionError && (
        <div role="alert" className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{submissionError}</span>
        </div>
      )}

      {showSuccess && ticketNumber && (
        <div role="alert" className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Your ticket has been successfully created!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- Patient Information --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Full Name *</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="e.g., John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Date of Birth *</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Gender *</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_say">Prefer not to say</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number *</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="tel"
            placeholder="e.g., +628123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email (Optional)</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="email"
            placeholder="e.g., your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">National ID Number (KTP/NIK) *</span>
            <span className="label-text-alt text-gray-500">For identification</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="e.g., 1234567890123456"
            value={nationalIdNumber}
            onChange={(e) => setNationalIdNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Medical Record Number (MRN) (Optional)</span>
            <span className="label-text-alt text-gray-500">If you are an existing patient</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="e.g., H0012345"
            value={medicalRecordNumber}
            onChange={(e) => setMedicalRecordNumber(e.target.value)}
          />
        </div>

        <div className="form-control flex-row items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={specialNeeds}
            onChange={(e) => setSpecialNeeds(e.target.checked)}
          />
          <label className="label cursor-pointer">
            <span className="label-text">I have special needs (e.g., wheelchair, interpreter)</span>
          </label>
        </div>

        <div className="divider"></div>

        {/* --- Visit Details --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Reason for Visit *</span>
            <span className="label-text-alt text-gray-500">Briefly describe your need</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full"
            placeholder="e.g., Flu symptoms, follow-up for check-up, administrative inquiry"
            value={reasonForVisit}
            onChange={(e) => setReasonForVisit(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Department *</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name} {dept.description ? `(${dept.description})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Preferred Date for Visit *</span>
            <span className="label-text-alt text-gray-500">Today's date is pre-selected</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="date"
            value={assignedDate}
            min={format(new Date(), 'yyyy-MM-dd')} // Prevents selecting past dates
            onChange={(e) => setAssignedDate(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Priority Level *</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="emergency">Emergency (Urgent Case)</option>
          </select>
        </div>

        <button
          className="btn btn-primary w-full mt-6"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Generating Ticket...' : 'Get My Ticket'}
        </button>
      </form>

      {ticketNumber && showSuccess && (
        <div className="mt-8 p-6 bg-green-50 text-green-800 rounded-lg shadow-inner text-center">
          <p className="font-bold text-2xl mb-2">Thank you! Your Ticket Number is:</p>
          <p className="text-5xl font-extrabold text-blue-700">{ticketNumber}</p>
          <p className="mt-4 text-gray-700">Please wait for your number to be called by the staff.</p>
        </div>
      )}
    </div>
  );
}