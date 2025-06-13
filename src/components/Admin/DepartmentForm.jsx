import React, { useState } from 'react';
import { supabase } from "../../supabaseClient";

export default function DepartmentForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(''); // Will store as number, but input is text initially
  const [isActive, setIsActive] = useState(true); // Default to active
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    // Input validation
    if (!name.trim()) {
      setErrorMessage('Department name cannot be empty.');
      setSubmissionStatus('error');
      setLoading(false);
      return;
    }
    if (maxCapacity === '' || isNaN(parseInt(maxCapacity))) {
      setErrorMessage('Max Capacity must be a valid number.');
      setSubmissionStatus('error');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          name: name.trim(),
          description: description.trim() || null, // Store empty string as NULL
          max_capacity: parseInt(maxCapacity),
          is_active: isActive,
        })
        .select(); // Select the inserted data back

      if (error) {
        throw error;
      }

      setSubmissionStatus('success');
      // Clear form fields on successful submission
      setName('');
      setDescription('');
      setMaxCapacity('');
      setIsActive(true); // Reset to default
      console.log('New department added:', data);

    } catch (error) {
      console.error('Error adding department:', error);
      setErrorMessage(`Failed to add department: ${error.message || 'Unknown error'}.`);
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg my-8">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Add New Department</h1>

      {/* Submission Status Alerts */}
      {submissionStatus === 'success' && (
        <div role="alert" className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Department added successfully!</span>
        </div>
      )}
      {submissionStatus === 'error' && (
        <div role="alert" className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Department Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Department Name *</span>
          </label>
          <input
            type="text"
            placeholder="e.g., General Medicine"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description (Optional)</span>
          </label>
          <textarea
            placeholder="e.g., Manages a wide range of common medical conditions."
            className="textarea textarea-bordered h-24 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>

        {/* Max Capacity */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Max Capacity (e.g., Beds / Concurrent Patients) *</span>
          </label>
          <input
            type="number"
            placeholder="e.g., 30"
            className="input input-bordered w-full"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(e.target.value)}
            min="0"
            required
            disabled={loading}
          />
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
            <span className="label-text">Is Active?</span>
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
              Adding Department...
            </>
          ) : (
            'Add Department'
          )}
        </button>
      </form>
    </div>
  );
}