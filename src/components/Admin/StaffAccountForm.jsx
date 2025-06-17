import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

// Define roles available for new staff accounts
const ROLES = ['admin', 'receptionist', 'doctor', 'nurse', 'other'];
const SALT_ROUNDS = 10; // How many rounds to hash the password - higher is more secure, slower

export default function StaffAccountForm() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // This will be hashed before saving
  const [role, setRole] = useState(ROLES[0]); // Default to the first role
  const [departmentId, setDepartmentId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [departments, setDepartments] = useState([]); // To populate department dropdown
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // --- Fetch Departments on Load ---
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .eq('is_active', true) // Only show active departments
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching departments:', error.message);
        setErrorMessage('Failed to load departments for selection.');
      } else {
        setDepartments(data);
        if (data.length > 0) {
          setDepartmentId(data[0].id); // Pre-select the first department
        }
      }
    };
    fetchDepartments();
  }, []);

  // --- Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    // --- Basic Client-Side Validation ---
    if (!name.trim() || !username.trim() || !password.trim() || !role.trim() || !departmentId) {
      setErrorMessage('Please fill in all required fields.');
      setSubmissionStatus('error');
      setLoading(false);
      return;
    }
    if (password.length < 6) { // Minimum password length
      setErrorMessage('Password must be at least 6 characters long.');
      setSubmissionStatus('error');
      setLoading(false);
      return;
    }

    try {
      // --- IMPORTANT: Hash the password before sending to Supabase ---
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      console.log('Hashed Password:', hashedPassword); // For debugging, remove in production

      // --- Insert new staff account into the 'staff' table ---
      const { data, error } = await supabase
        .from('staff')
        .insert({
          name: name.trim(),
          username: username.trim(),
          password_hash: hashedPassword, // Store the hash, NOT the plaintext password
          role: role,
          department_id: departmentId,
          is_active: isActive,
        })
        .select(); // Select the inserted data back

      if (error) {
        throw error;
      }

      setSubmissionStatus('success');
      console.log('New staff account added:', data);
      // Clear form fields after successful submission
      setName('');
      setUsername('');
      setPassword(''); // Clear sensitive password field
      setRole(ROLES[0]);
      // departmentId and isActive can stay if adding multiple accounts for same dept/status
      // setDepartmentId(departments.length > 0 ? departments[0].id : '');
      // setIsActive(true);

    } catch (error) {
      console.error('Error adding staff account:', error);
      // Check for specific error like duplicate username
      if (error.code === '23505' && error.details.includes('username')) {
        setErrorMessage('Username already exists. Please choose a different one.');
      } else {
        setErrorMessage(`Failed to add staff account: ${error.message || 'Unknown error'}.`);
      }
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg my-8">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Add New Staff / Admin Account</h1>
      <p className="text-sm text-center text-red-500 mb-4 font-semibold">
        WARNING: This form hashes passwords client-side. For production, consider using a Supabase Edge Function or Database Function (RPC) for server-side hashing to enhance security.
      </p>

      {/* Submission Status Alerts */}
      {submissionStatus === 'success' && (
        <div role="alert" className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Staff account added successfully!</span>
        </div>
      )}
      {submissionStatus === 'error' && (
        <div role="alert" className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Full Name *</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Jane Doe"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Username */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username *</span>
            <span className="label-text-alt text-gray-500">Unique identifier for login</span>
          </label>
          <input
            type="text"
            placeholder="e.g., janedoe_admin"
            className="input input-bordered w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password *</span>
            <span className="label-text-alt text-gray-500">Min 6 characters</span>
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Role Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Role *</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={loading}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)} {/* Capitalize first letter */}
              </option>
            ))}
          </select>
        </div>

        {/* Department Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Department (Optional)</span>
            <span className="label-text-alt text-gray-500">For doctors/nurses/receptionists</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            disabled={loading || departments.length === 0}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Is Active Checkbox */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={loading}
            />
            <span className="label-text">Account is Active</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full mt-6"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Adding Account...
            </>
          ) : (
            'Add Staff Account'
          )}
        </button>
      </form>
    </div>
  );
}