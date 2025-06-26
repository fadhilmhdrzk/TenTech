import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";

const AddDepartmentForm = ({ onSuccess, onCancel, existingDepartmentsCount, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Nama Departemen tidak boleh kosong.');
      setSubmissionStatus('error');
      setLoading(false);
      return;
    }
    if (maxCapacity === '' || isNaN(parseInt(maxCapacity))) {
      setErrorMessage('Kapasitas Maksimal harus berupa angka yang valid.');
      setSubmissionStatus('error');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          max_capacity: parseInt(maxCapacity),
          is_active: isActive,
        })
        .select();

      if (error) {
        throw error;
      }

      setSubmissionStatus('success');
      console.log('Departemen baru ditambahkan:', data);
      // Panggil callback sukses dari komponen induk
      onSuccess();

    } catch (error) {
      console.error('Error adding department:', error);
      setErrorMessage(`Gagal menambahkan departemen: ${error.message || 'Terjadi kesalahan tidak dikenal'}.`);
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Formulir Tambah Departemen Baru</h2>
      
      {submissionStatus === 'success' && (
        <div role="alert" className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Departemen berhasil ditambahkan!</span>
        </div>
      )}
      {submissionStatus === 'error' && (
        <div role="alert" className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label"><span className="label-text">Nama Departemen *</span></label>
          <input type="text" placeholder="misal: Kedokteran Umum" className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Deskripsi (Opsional)</span></label>
          <textarea placeholder="misal: Mengelola berbagai kondisi medis umum." className="textarea textarea-bordered h-24 w-full" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading}></textarea>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Kapasitas Maksimal (misal: Tempat Tidur / Pasien Bersamaan) *</span></label>
          <input type="number" placeholder="misal: 30" className="input input-bordered w-full" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} min="0" required disabled={loading} />
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input type="checkbox" className="checkbox checkbox-primary" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={loading} />
            <span className="label-text">Aktif?</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onCancel} className="btn btn-outline" disabled={loading}>
            Batal
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Menambahkan...
              </>
            ) : (
              'Tambah Departemen'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


// --- Komponen Utama Manajemen Departemen ---
export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // State untuk toggle form

  // Fungsi untuk mengambil daftar departemen
  const fetchDepartments = async () => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true }); // Urutkan berdasarkan nama

      if (error) {
        throw error;
      }
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments list:", err.message);
      setErrorList("Gagal memuat daftar departemen.");
    } finally {
      setLoadingList(false);
    }
  };

  // Ambil daftar departemen saat komponen dimuat
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Callback setelah formulir penambahan sukses
  const handleAddSuccess = () => {
    setShowAddForm(false); // Sembunyikan formulir
    fetchDepartments(); // Perbarui daftar departemen
  };

  if (loadingList) {
    return (
      <div className="p-6 text-center text-gray-600">
        <span className="loading loading-spinner loading-lg"></span>
        <p>Memuat daftar departemen...</p>
      </div>
    );
  }

  if (errorList) {
    return (
      <div className="p-6 text-center alert alert-error">
        <span>{errorList}</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Manajemen Departemen</h1> {/* <<< DIUBAH */}

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
          {showAddForm ? 'Sembunyikan Formulir' : 'Tambah Departemen Baru'} {/* <<< DIUBAH */}
        </button>
      </div>

      {/* Render formulir secara kondisional */}
      {showAddForm && (
        <AddDepartmentForm 
          onSuccess={handleAddSuccess} 
          onCancel={() => setShowAddForm(false)} // Tombol Batal untuk menyembunyikan form
          isLoading={loadingList} // Pass loading state if needed for form disability
        />
      )}

      <div className="bg-white rounded-xl shadow-xl overflow-hidden mt-6">
        <table className="table w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nama Departemen</th> {/* <<< DIUBAH */}
              <th className="py-3 px-4 text-left">Deskripsi</th> {/* <<< DIUBAH */}
              <th className="py-3 px-4 text-left">Kapasitas Maksimal</th> {/* <<< DIUBAH */}
              <th className="py-3 px-4 text-left">Status</th> {/* <<< DIUBAH */}
              <th className="py-3 px-4 text-left">Dibuat Pada</th> {/* <<< DIUBAH */}
              {/* Tambah kolom untuk aksi seperti Edit/Hapus jika diperlukan */}
              <th className="py-3 px-4 text-left">Aksi</th> {/* <<< DIUBAH */}
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">Belum ada departemen yang terdaftar.</td> {/* <<< DIUBAH */}
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id} className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="py-3 px-4 font-medium">{dept.name}</td>
                  <td className="py-3 px-4 text-gray-600">{dept.description || '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{dept.max_capacity}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${dept.is_active ? 'badge-success' : 'badge-error'}`}>
                      {dept.is_active ? 'Aktif' : 'Tidak Aktif'} {/* <<< DIUBAH */}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {dept.created_at ? new Date(dept.created_at).toLocaleDateString('id-ID') : '-'} {/* Format tanggal ke ID */}
                  </td>
                  <td className="py-3 px-4">
                    {/* Tombol Edit/Hapus bisa ditambahkan di sini */}
                    <button className="btn btn-sm btn-outline mr-2">Edit</button> {/* <<< DIUBAH */}
                    <button className="btn btn-sm btn-error btn-outline">Hapus</button> {/* <<< DIUBAH */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}