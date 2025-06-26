import { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export default function Guest() {
  const { user, userProfile, loading: authLoading } = useAuth(); // <<< GUNAKAN useAuth

  // Patient-related states
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(''); // Keep as empty string for input field
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [medicalRecordNumber, setMedicalRecordNumber] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [reasonForVisit, setReasonForVisit] = useState('');

  // Flags untuk input yang akan dinonaktifkan (karena otomatis terisi dari profil)
  const [isProfileFieldsDisabled, setIsProfileFieldsDisabled] = useState(false);

  // Ticket-related states
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [assignedDate, setAssignedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [priority, setPriority] = useState('normal');

  // UI states
  const [ticketNumber, setTicketNumber] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [submissionError, setSubmissionError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Fetch department list on load ---
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, description')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching departments:', error.message);
        setSubmissionError('Gagal memuat daftar departemen. Harap coba lagi.');
      } else {
        setDepartments(data);
        if (data.length > 0) {
          const generalMedicine = data.find(dept => dept.name === 'General Medicine');
          setSelectedDeptId(generalMedicine ? generalMedicine.id : data[0].id);
        }
      }
    };
    fetchDepartments();
  }, []);

  // --- Effect to pre-fill form if user is logged in and has a profile ---
  useEffect(() => {
    if (!authLoading && user && userProfile) {
      // User is logged in and has a patient profile, pre-fill and disable fields
      setFullName(userProfile.full_name || '');
      setDateOfBirth(userProfile.date_of_birth || '');
      setGender(userProfile.gender || '');
      setPhone(userProfile.phone || '');
      setEmail(userProfile.email || user.email || ''); // Prefer patient email, fallback to auth email
      setNationalIdNumber(userProfile.national_id_number || '');
      setMedicalRecordNumber(userProfile.medical_record_number || '');
      setSpecialNeeds(userProfile.special_needs || false);
      setIsProfileFieldsDisabled(true); // Disable profile-related fields
    } else if (!authLoading && user && !userProfile) {
      // User is logged in but has no patient profile (e.g., new registration)
      // Allow them to fill profile data, but pre-fill email if available from auth
      setEmail(user.email || '');
      setIsProfileFieldsDisabled(false); // Keep fields enabled for initial profile creation
    } else if (!authLoading && !user) {
      // No user logged in, should ideally not happen due to RequireAuth, but for safety
      setIsProfileFieldsDisabled(false); // Fields are enabled for a guest (though route is protected now)
    }
  }, [authLoading, user, userProfile]);


  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionError(null);
    setShowSuccess(false);

    try {
      const trimmedFullName = fullName.trim();
      const trimmedPhone = phone.trim();
      const trimmedEmail = email.trim();
      const trimmedNationalIdNumber = nationalIdNumber.trim();
      const trimmedMedicalRecordNumber = medicalRecordNumber.trim();
      const trimmedReasonForVisit = reasonForVisit.trim();

      const emailToInsert = trimmedEmail === '' ? null : trimmedEmail;
      const medicalRecordNumberToInsert = trimmedMedicalRecordNumber === '' ? null : trimmedMedicalRecordNumber;
      const reasonForVisitToInsert = trimmedReasonForVisit === '' ? null : trimmedReasonForVisit;


      let patientId;
      // --- LOGIKA UTAMA UNTUK PENGGUNA YANG LOGIN ---
      if (user && user.id) { // Jika ada pengguna yang login
        if (userProfile) {
          // KASUS 1: Pengguna sudah login DAN memiliki profil pasien
          patientId = userProfile.id; // Gunakan ID pasien yang sudah ada
          console.log("Pengguna terautentikasi dengan profil pasien yang ada:", user.id, "Patient ID:", patientId);

          // Opsional: Jika ada perubahan pada field yang seharusnya bisa diupdate (meskipun disabled), lakukan update di sini
          const { error: updateError } = await supabase
              .from('patients')
              .update({
                  special_needs: specialNeeds,
                  phone: trimmedPhone,
                  email: emailToInsert,
              })
              .eq('id', patientId);
          if (updateError) console.warn("Peringatan: Gagal memperbarui profil pasien yang ada.", updateError.message);

        } else {
          // KASUS 2: Pengguna sudah login TETAPI BELUM memiliki profil pasien (e.g., pendaftaran baru)
          console.log("Pengguna terautentikasi tanpa profil pasien. Membuat profil baru.");
          const { data: newPatientData, error: patientInsertError } = await supabase
            .from('patients')
            .insert({
              auth_id: user.id, // KUNCI PENTING: Hubungkan dengan ID pengguna Supabase Auth
              full_name: trimmedFullName,
              date_of_birth: dateOfBirth,
              gender: gender,
              phone: trimmedPhone,
              email: emailToInsert,
              national_id_number: trimmedNationalIdNumber,
              medical_record_number: medicalRecordNumberToInsert,
              special_needs: specialNeeds,
            })
            .select('id')
            .single();

          if (patientInsertError) {
            console.error("Kesalahan pembuatan profil pasien baru:", patientInsertError);
            if (patientInsertError.code === '23505') {
              if (patientInsertError.message.includes('email')) {
                throw new Error('Alamat email sudah terdaftar. Harap gunakan yang lain atau biarkan kosong.');
              }
              if (patientInsertError.message.includes('national_id_number')) {
                throw new Error('Nomor ID Nasional (KTP/NIK) sudah terdaftar untuk akun lain. Harap verifikasi detail Anda.');
              }
              if (patientInsertError.message.includes('medical_record_number')) {
                throw new Error('Nomor Rekam Medis sudah terdaftar untuk akun lain. Harap verifikasi detail Anda.');
              }
              if (patientInsertError.message.includes('phone')) {
                throw new Error('Nomor telepon sudah terdaftar untuk akun lain. Harap periksa.');
              }
            }
            throw new Error(`Gagal membuat profil pasien: ${patientInsertError.message}`);
          }
          patientId = newPatientData.id;
        }
      } else {
        // KASUS 3: TIDAK ADA pengguna yang login (ini seharusnya dicegah oleh RequireAuth, tapi sebagai fallback)
        throw new Error("Anda harus login untuk membuat tiket.");
      }

      // --- Logika Pembuatan Tiket (Sama seperti sebelumnya) ---
      const { count: ticketsTodayInDept, error: countError } = await supabase
        .from('tickets')
        .select('id', { count: 'exact', head: true })
        .eq('department_id', selectedDeptId)
        .eq('assigned_date', assignedDate);

      if (countError) throw countError;

      const selectedDepartment = departments.find(d => d.id === selectedDeptId);
      const deptPrefix = selectedDepartment ? selectedDepartment.name.charAt(0).toUpperCase() : 'Z';
      const ticketNum = `${deptPrefix}${String(ticketsTodayInDept + 1).padStart(3, '0')}`;

      const { data: ticketData, error: ticketErr } = await supabase
        .from('tickets')
        .insert({
          patient_id: patientId, // Gunakan patientId yang sudah teridentifikasi/terbuat
          department_id: selectedDeptId,
          assigned_date: assignedDate,
          priority: priority,
          reason_for_visit: reasonForVisitToInsert,
          queue_number: ticketNum,
          status: 'pending'
        })
        .select('queue_number')
        .single();

      if (ticketErr) throw ticketErr;

      setTicketNumber(ticketData.queue_number);
      setShowSuccess(true);
      resetForm();

    } catch (err) {
      console.error('Error creating ticket:', err.message);
      setSubmissionError(`Gagal mengirim tiket: ${err.message}. Harap periksa input Anda.`);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mereset kolom formulir setelah pengiriman
  const resetForm = () => {
    // Reset hanya field yang tidak dinonaktifkan
    if (!isProfileFieldsDisabled) {
        setFullName('');
        setDateOfBirth('');
        setGender('');
        setPhone('');
        setEmail(user ? user.email : '');
        setNationalIdNumber('');
        setMedicalRecordNumber('');
        setSpecialNeeds(false);
    }
    setReasonForVisit('');
    setAssignedDate(format(new Date(), 'yyyy-MM-dd'));
    setPriority('normal');
  };

  if (authLoading) {
      return (
          <div className="p-6 text-center text-gray-600">
              <span className="loading loading-spinner loading-lg"></span>
              <p>Memuat profil pengguna...</p>
          </div>
      );
  }

  // Jika tidak ada user yang login, user akan diarahkan oleh RequireAuth,
  // tapi kita tambahkan pesan fallback di sini juga
  if (!user) {
      return (
          <div className="p-6 text-center text-red-600">
              Anda harus login untuk mengakses halaman ini.
          </div>
      );
  }


  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg my-8">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Ambil Tiket Rumah Sakit Anda</h1>
      <p className="text-center text-gray-600 mb-6">Harap isi detail Anda untuk mendapatkan nomor antrean kunjungan Anda.</p>

      {submissionError && (
        <div role="alert" className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{submissionError}</span>
        </div>
      )}

      {showSuccess && ticketNumber && (
        <div role="alert" className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Tiket Anda berhasil dibuat! Nomor Anda adalah: <strong>{ticketNumber}</strong></span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- Informasi Pasien --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nama Lengkap *</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="misal: John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading || isProfileFieldsDisabled}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Tanggal Lahir *</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            disabled={loading || isProfileFieldsDisabled}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Jenis Kelamin *</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            disabled={loading || isProfileFieldsDisabled}
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Nomor Telepon *</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="tel"
            placeholder="misal: +628123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={loading || isProfileFieldsDisabled}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email (Opsional)</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="email"
            placeholder="misal: email.anda@contoh.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || isProfileFieldsDisabled}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Nomor ID Nasional (KTP/NIK) *</span>
            <span className="label-text-alt text-gray-500">Untuk identifikasi</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="misal: 1234567890123456"
            value={nationalIdNumber}
            onChange={(e) => setNationalIdNumber(e.target.value)}
            required
            disabled={loading || isProfileFieldsDisabled}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Nomor Rekam Medis (MRN) (Opsional)</span>
            <span className="label-text-alt text-gray-500">Jika Anda pasien yang sudah ada</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="misal: H0012345"
            value={medicalRecordNumber}
            onChange={(e) => setMedicalRecordNumber(e.target.value)}
            disabled={loading || isProfileFieldsDisabled}
          />
        </div>

        <div className="form-control flex-row items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={specialNeeds}
            onChange={(e) => setSpecialNeeds(e.target.checked)}
            disabled={loading}
          />
          <label className="label cursor-pointer">
            <span className="label-text">Saya memiliki kebutuhan khusus (misal: kursi roda, penerjemah)</span>
          </label>
        </div>

        <div className="divider"></div>

        {/* --- Detail Kunjungan --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Alasan Kunjungan *</span>
            <span className="label-text-alt text-gray-500">Jelaskan singkat kebutuhan Anda</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full"
            placeholder="misal: Gejala flu, kontrol pasca pemeriksaan, pertanyaan administrasi"
            value={reasonForVisit}
            onChange={(e) => setReasonForVisit(e.target.value)}
            required
            disabled={loading}
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Pilih Departemen *</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            required
            disabled={loading || departments.length === 0}
          >
            <option value="">Pilih Departemen</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name} {dept.description ? `(${dept.description})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Tanggal Kunjungan Pilihan *</span>
            <span className="label-text-alt text-gray-500">Tanggal hari ini sudah terpilih secara otomatis</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="date"
            value={assignedDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setAssignedDate(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Tingkat Prioritas *</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
            disabled={loading}
          >
            <option value="normal">Normal</option>
            <option value="high">Tinggi</option>
            <option value="emergency">Darurat (Kasus Mendesak)</option>
          </select>
        </div>

        <button
          className="btn btn-primary w-full mt-6"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Membuat Tiket...' : 'Ambil Tiket Saya'}
        </button>
      </form>

      {ticketNumber && showSuccess && (
        <div className="mt-8 p-6 bg-green-50 text-green-800 rounded-lg shadow-inner text-center">
          <p className="font-bold text-2xl mb-2">Terima kasih! Nomor Tiket Anda adalah:</p>
          <p className="text-5xl font-extrabold text-blue-700">{ticketNumber}</p>
          <p className="mt-4 text-gray-700">Harap tunggu nomor Anda dipanggil oleh staf.</p>
        </div>
      )}
    </div>
  );
}