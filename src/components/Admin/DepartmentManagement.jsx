import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";

const AddDepartmentForm = ({ onSuccess, onCancel, currentDepartment = null, isLoading, setIsEditing }) => {
  // Tambahkan state untuk form edit (jika ingin fitur edit penuh diaktifkan)
  const [name, setName] = useState(currentDepartment ? currentDepartment.name : '');
  const [description, setDescription] = useState(currentDepartment ? currentDepartment.description : '');
  const [maxCapacity, setMaxCapacity] = useState(currentDepartment ? currentDepartment.max_capacity : '');
  const [isActive, setIsActive] = useState(currentDepartment ? currentDepartment.is_active : true);
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
      let data, error;
      if (currentDepartment) { // Jika sedang mengedit
        ({ data, error } = await supabase
          .from('departments')
          .update({
            name: name.trim(),
            description: description.trim() || null,
            max_capacity: parseInt(maxCapacity),
            is_active: isActive,
            updated_at: new Date().toISOString() // Perbarui timestamp
          })
          .eq('id', currentDepartment.id)
          .select());
      } else { // Jika sedang menambah
        ({ data, error } = await supabase
          .from('departments')
          .insert({
            name: name.trim(),
            description: description.trim() || null,
            max_capacity: parseInt(maxCapacity),
            is_active: isActive,
          })
          .select());
      }

      if (error) {
        throw error;
      }

      setSubmissionStatus('success');
      console.log('Departemen berhasil disimpan:', data);
      onSuccess(); // Panggil callback sukses dari komponen induk

    } catch (error) {
      console.error('Error saving department:', error);
      setErrorMessage(`Gagal menyimpan departemen: ${error.message || 'Terjadi kesalahan tidak dikenal'}.`);
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
      <h2 className="text-2xl font-bold text-[#00afc5] mb-4">
        {currentDepartment ? 'Edit Departemen' : 'Formulir Tambah Departemen Baru'}
      </h2>
      
      {submissionStatus === 'success' && (
        <div role="alert" className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Departemen berhasil disimpan!</span>
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
          <label className="label">
            <span className="label-text">Nama Departemen *</span>
          </label>
          <input
            type="text"
            placeholder="misal: Kedokteran Umum"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Deskripsi (Opsional)</span>
          </label>
          <textarea
            placeholder="misal: Mengelola berbagai kondisi medis umum."
            className="textarea textarea-bordered h-24 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Kapasitas Maksimal (misal: Tempat Tidur / Pasien Bersamaan) *
            </span>
          </label>
          <input
            type="number"
            placeholder="misal: 30"
            className="input input-bordered w-full"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(e.target.value)}
            min="0"
            required
            disabled={loading}
          />
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox accent-[#00afc5] focus:ring-2 focus:ring-[#00afc5]"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={loading}
            />
            <span className="label-text">Aktif?</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md font-semibold border border-[#00afc5] text-[#00afc5] hover:bg-[#e0fafd] transition disabled:opacity-50"
            disabled={loading}
          >
            Batal
          </button>
          <button
          type="submit"
          className="px-4 py-2 rounded-md text-white font-semibold shadow transition bg-[#00afc5] hover:bg-[#009bb0] disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Menyimpan...
            </>
          ) : currentDepartment ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Departemen"
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null); // State untuk departemen yang sedang diedit

  const fetchDepartments = async () => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true });

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

  // --- Fungsi untuk memeriksa tiket belum selesai ---
  const checkUnresolvedTicketsForDepartment = async (departmentId) => {
    const { count, error } = await supabase
      .from('tickets')
      .select('id', { count: 'exact', head: true })
      .eq('department_id', departmentId)
      .not('status', 'in', '("completed", "cancelled", "no_show")');

    if (error) {
      console.error("Error checking unresolved tickets:", error.message);
      throw new Error("Gagal memeriksa tiket belum selesai.");
    }
    return count > 0;
  };

  // --- Fungsi untuk menghapus departemen ---
  const handleDeleteDepartment = async (deptId, deptName) => {
    try {
      const hasUnresolvedTickets = await checkUnresolvedTicketsForDepartment(deptId);
      
      if (hasUnresolvedTickets) {
        alert(`Departemen "${deptName}" tidak dapat dihapus karena masih memiliki tiket yang belum selesai.`);
        return;
      }

      if (!window.confirm(`Apakah Anda yakin ingin menghapus departemen "${deptName}"?
      Catatan: Tiket dan staf yang terkait akan kehilangan tautan departemennya (menjadi NULL).`)) {
        return;
      }

      setLoadingList(true);
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', deptId);

      if (error) {
        throw error;
      }

      console.log(`Departemen "${deptName}" berhasil dihapus.`);
      fetchDepartments();

    } catch (error) {
      console.error("Error deleting department:", error.message);
      alert(`Gagal menghapus departemen "${deptName}": ${error.message}`); // Tampilkan alert juga
      setErrorList(`Gagal menghapus departemen "${deptName}": ${error.message}`);
    } finally {
      setLoadingList(false);
    }
  };

  // --- Fungsi untuk memulai edit departemen ---
  const handleEditDepartment = async (department) => {
    try {
      const hasUnresolvedTickets = await checkUnresolvedTicketsForDepartment(department.id);
      
      if (hasUnresolvedTickets) {
        alert(`Departemen "${department.name}" tidak dapat diedit karena masih memiliki tiket yang belum selesai.`);
        return;
      }
      setEditingDepartment(department); // Set departemen yang akan diedit
      setShowAddForm(true); // Tampilkan formulir
    } catch (error) {
      console.error("Error preparing to edit department:", error.message);
      alert(`Gagal menyiapkan edit departemen "${department.name}": ${error.message}`);
    }
  };


  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddSuccess = () => {
    setShowAddForm(false);
    setEditingDepartment(null); // Clear editing state
    fetchDepartments();
  };

  // Handler untuk pembatalan form (baik tambah maupun edit)
  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingDepartment(null); // Penting: reset editing state saat dibatalkan
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
      <h1 className="text-3xl font-extrabold text-[#00afc5] mb-6">Manajemen Departemen</h1>

      <div className="flex justify-end mb-4">
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingDepartment(null);
          }}
          className="px-4 py-2 rounded-md text-white font-semibold shadow transition bg-[#00afc5] hover:bg-[#009bb0]">
          {showAddForm ? 'Sembunyikan Formulir' : 'Tambah Departemen Baru'}
        </button>
    </div>


      {showAddForm && (
        <AddDepartmentForm 
          onSuccess={handleAddSuccess} 
          onCancel={handleFormCancel}
          currentDepartment={editingDepartment} // Pass department data for editing
          setIsEditing={setEditingDepartment} // Pass setter for explicit control
        />
      )}

      <div className="bg-white rounded-xl shadow-xl overflow-hidden mt-6">
        <table className="table w-full">
          <thead className="bg-[#00afc5] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nama Departemen</th>
              <th className="py-3 px-4 text-left">Deskripsi</th>
              <th className="py-3 px-4 text-left">Kapasitas Maksimal</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Dibuat Pada</th>
              <th className="py-3 px-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">Belum ada departemen yang terdaftar.</td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id} className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="py-3 px-4 font-medium">{dept.name}</td>
                  <td className="py-3 px-4 text-gray-600">{dept.description || '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{dept.max_capacity}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${dept.is_active ? 'badge-success' : 'badge-error'}`}>
                      {dept.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {dept.created_at ? new Date(dept.created_at).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="py-3 px-4">
                    {/* Tombol Edit - Sekarang memanggil handleEditDepartment */}
                    <button 
                      onClick={() => handleEditDepartment(dept)} 
                      className="btn btn-sm btn-outline mr-2"
                      disabled={loadingList} // Nonaktifkan saat daftar sedang loading
                    >
                      Edit
                    </button> 
                    {/* Tombol Hapus - Memanggil handleDeleteDepartment */}
                    <button 
                      onClick={() => handleDeleteDepartment(dept.id, dept.name)} 
                      className="btn btn-sm btn-error btn-outline"
                      disabled={loadingList}
                    >
                      Hapus
                    </button>
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