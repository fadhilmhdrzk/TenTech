import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import bcrypt from 'bcryptjs'; // Tetap butuh bcryptjs untuk hashing kata sandi

// --- Konfigurasi Peran Staf ---
const ROLES = ['admin', 'receptionist', 'doctor', 'nurse', 'other'];
const ROLE_TRANSLATIONS = {
  'admin': 'Admin',
  'receptionist': 'Resepsionis',
  'doctor': 'Dokter',
  'nurse': 'Perawat',
  'other': 'Lainnya',
};
const SALT_ROUNDS = 10;

// --- Komponen Formulir Tambah Akun Staf (dipisah atau inline) ---
const AddStaffAccountForm = ({ onSuccess, onCancel, isLoading }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [departmentId, setDepartmentId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [departments, setDepartments] = useState([]); // Untuk mengisi dropdown departemen
  const [loading, setLoading] = useState(false); // Loading state untuk form
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Ambil daftar departemen saat formulir dimuat
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .eq('is_active', true) // Hanya tampilkan departemen aktif
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching departments:', error.message);
        setErrorMessage('Gagal memuat departemen untuk pilihan.');
      } else {
        setDepartments(data);
        if (data.length > 0) {
          setDepartmentId(data[0].id); // Pilih departemen pertama secara default
        }
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    // --- Validasi Sisi Klien Dasar ---
    if (!name.trim() || !username.trim() || !password.trim() || !role.trim() || !departmentId) {
      setErrorMessage('Harap isi semua kolom yang wajib diisi.');
      setSubmissionStatus('error');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Kata sandi harus minimal 6 karakter.');
      setSubmissionStatus('error');
      setLoading(false);
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const { data, error } = await supabase
        .from('staff')
        .insert({
          name: name.trim(),
          username: username.trim(),
          password_hash: hashedPassword,
          role: role,
          department_id: departmentId,
          is_active: isActive,
        })
        .select();

      if (error) {
        throw error;
      }

      setSubmissionStatus('success');
      console.log('Akun staf baru ditambahkan:', data);
      onSuccess(); // Panggil callback sukses dari komponen induk

      // Reset form fields
      setName('');
      setUsername('');
      setPassword('');
      setRole(ROLES[0]);
      // departmentId dan isActive bisa tetap jika menambahkan beberapa akun untuk departemen/status yang sama

    } catch (error) {
      console.error('Error adding staff account:', error);
      if (error.code === '23505' && error.details.includes('username')) {
        setErrorMessage('Nama pengguna sudah ada. Harap pilih yang lain.');
      } else {
        setErrorMessage(`Gagal menambahkan akun staf: ${error.message || 'Terjadi kesalahan tidak dikenal'}.`);
      }
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Formulir Tambah Akun Staf Baru</h2>
      <p className="text-sm text-red-500 mb-4 font-semibold">
        PERINGATAN: Formulir ini melakukan hash kata sandi di sisi klien. Untuk produksi, pertimbangkan menggunakan Supabase Edge Function atau Fungsi Database (RPC) untuk hashing di sisi server demi meningkatkan keamanan.
      </p>

      {submissionStatus === 'success' && (
        <div role="alert" className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Akun staf berhasil ditambahkan!</span>
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
          <label className="label"><span className="label-text">Nama Lengkap *</span></label>
          <input type="text" placeholder="misal: Jane Doe" className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Nama Pengguna *</span><span className="label-text-alt text-gray-500">Identifikasi unik untuk login</span></label>
          <input type="text" placeholder="misal: janedoe_admin" className="input input-bordered w-full" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Kata Sandi *</span><span className="label-text-alt text-gray-500">Minimal 6 karakter</span></label>
          <input type="password" placeholder="Masukkan kata sandi" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Peran *</span></label>
          <select className="select select-bordered w-full" value={role} onChange={(e) => setRole(e.target.value)} required disabled={loading}>
            {ROLES.map((r) => (<option key={r} value={r}>{ROLE_TRANSLATIONS[r]}</option>))}
          </select>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text">Departemen (Opsional)</span><span className="label-text-alt text-gray-500">Untuk dokter/perawat/resepsionis</span></label>
          <select className="select select-bordered w-full" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} disabled={loading || departments.length === 0}>
            <option value="">Pilih Departemen</option>
            {departments.map((dept) => (<option key={dept.id} value={dept.id}>{dept.name}</option>))}
          </select>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input type="checkbox" className="checkbox checkbox-primary" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={loading} />
            <span className="label-text">Akun Aktif</span>
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
                Menambahkan Akun...
              </>
            ) : (
              'Tambah Akun Staf'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


// --- Komponen Utama Manajemen Staf ---
export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // State untuk toggle form

  // Fungsi untuk mengambil daftar staf
  const fetchStaff = async () => {
    setLoadingList(true);
    setErrorList(null);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          id,
          name,
          username,
          role,
          is_active,
          created_at,
          department:department_id ( name ) // Join untuk nama departemen
        `)
        .order('name', { ascending: true }); // Urutkan berdasarkan nama

      if (error) {
        throw error;
      }
      setStaffList(data);
    } catch (err) {
      console.error("Error fetching staff list:", err.message);
      setErrorList("Gagal memuat daftar staf.");
    } finally {
      setLoadingList(false);
    }
  };

  // Ambil daftar staf saat komponen dimuat
  useEffect(() => {
    fetchStaff();
  }, []);

  // Callback setelah formulir penambahan sukses
  const handleAddSuccess = () => {
    setShowAddForm(false); // Sembunyikan formulir
    fetchStaff(); // Perbarui daftar staf
  };

  if (loadingList) {
    return (
      <div className="p-6 text-center text-gray-600">
        <span className="loading loading-spinner loading-lg"></span>
        <p>Memuat daftar staf...</p>
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
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Manajemen Staf</h1>

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
          {showAddForm ? 'Sembunyikan Formulir' : 'Tambah Akun Staf Baru'}
        </button>
      </div>

      {/* Render formulir secara kondisional */}
      {showAddForm && (
        <AddStaffAccountForm 
          onSuccess={handleAddSuccess} 
          onCancel={() => setShowAddForm(false)}
          isLoading={loadingList}
        />
      )}

      <div className="bg-white rounded-xl shadow-xl overflow-hidden mt-6">
        <table className="table w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nama Lengkap</th>
              <th className="py-3 px-4 text-left">Nama Pengguna</th>
              <th className="py-3 px-4 text-left">Peran</th>
              <th className="py-3 px-4 text-left">Departemen</th>
              <th className="py-3 px-4 text-left">Status Akun</th>
              <th className="py-3 px-4 text-left">Dibuat Pada</th>
              <th className="py-3 px-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">Belum ada akun staf yang terdaftar.</td>
              </tr>
            ) : (
              staffList.map((staff) => (
                <tr key={staff.id} className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="py-3 px-4 font-medium">{staff.name}</td>
                  <td className="py-3 px-4 text-gray-600">{staff.username}</td>
                  <td className="py-3 px-4 text-gray-600">{ROLE_TRANSLATIONS[staff.role] || staff.role}</td>
                  <td className="py-3 px-4 text-gray-600">{staff.department?.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${staff.is_active ? 'badge-success' : 'badge-error'}`}>
                      {staff.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {staff.created_at ? new Date(staff.created_at).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="py-3 px-4">
                    {/* Tombol Edit/Hapus bisa ditambahkan di sini */}
                    <button className="btn btn-sm btn-outline mr-2">Edit</button>
                    <button className="btn btn-sm btn-error btn-outline">Hapus</button>
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