import { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient"; // Sesuaikan path jika perlu
import { format } from 'date-fns'; // Untuk format tanggal

export default function Guest() {
  // State terkait Pasien
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [medicalRecordNumber, setMedicalRecordNumber] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [reasonForVisit, setReasonForVisit] = useState('');

  // State terkait Tiket
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [assignedDate, setAssignedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [priority, setPriority] = useState('normal');

  // State UI
  const [ticketNumber, setTicketNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Ambil daftar departemen saat dimuat ---
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, description')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching departments:', error.message);
        setSubmissionError('Gagal memuat daftar departemen. Harap coba lagi.'); // <<< DIUBAH
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


  // --- Tangani pengiriman formulir ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionError(null);
    setShowSuccess(false);

    try {
      // --- Siapkan data untuk dimasukkan, konversi string kosong menjadi null jika sesuai ---
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
      let existingPatients = [];
      if (trimmedNationalIdNumber) {
          const { data, error } = await supabase
              .from('patients')
              .select('id')
              .eq('national_id_number', trimmedNationalIdNumber);
          if (error) throw error;
          existingPatients = data;
      } else if (trimmedMedicalRecordNumber) {
          const { data, error } = await supabase
              .from('patients')
              .select('id')
              .eq('medical_record_number', trimmedMedicalRecordNumber);
          if (error) throw error;
          existingPatients = data;
      }

      if (existingPatients && existingPatients.length > 0) {
        patientId = existingPatients[0].id;
        const { error: updateError } = await supabase
            .from('patients')
            .update({
                full_name: trimmedFullName,
                date_of_birth: dateOfBirth,
                gender: gender,
                phone: trimmedPhone,
                email: emailToInsert,
                special_needs: specialNeeds
            })
            .eq('id', patientId);

        if (updateError) {
            console.warn("Peringatan: Tidak dapat memperbarui data pasien yang ada.", updateError.message); // <<< DIUBAH
        }

      } else {
        const { data: newPatientData, error: patientInsertError } = await supabase
          .from('patients')
          .insert({
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
            if (patientInsertError.code === '23505') {
                if (patientInsertError.message.includes('email')) {
                    throw new Error('Alamat email sudah terdaftar. Harap gunakan yang lain atau biarkan kosong.'); // <<< DIUBAH
                }
                if (patientInsertError.message.includes('national_id_number')) {
                    throw new Error('Nomor ID Nasional (KTP/NIK) sudah terdaftar. Harap verifikasi detail Anda.'); // <<< DIUBAH
                }
                if (patientInsertError.message.includes('medical_record_number')) {
                    throw new Error('Nomor Rekam Medis sudah terdaftar. Harap verifikasi detail Anda.'); // <<< DIUBAH
                }
                if (patientInsertError.message.includes('phone')) {
                    throw new Error('Nomor telepon sudah terdaftar. Harap gunakan yang lain atau masuk jika Anda memiliki akun yang sudah ada.'); // <<< DIUBAH
                }
            }
            throw patientInsertError;
        }
        patientId = newPatientData.id;
      }

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
          patient_id: patientId,
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
      setSubmissionError(`Gagal mengirim tiket: ${err.message}. Harap periksa input Anda.`); // <<< DIUBAH
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mereset kolom formulir setelah pengiriman
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
    setAssignedDate(format(new Date(), 'yyyy-MM-dd'));
    setPriority('normal');
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg my-8">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Ambil Tiket Rumah Sakit Anda</h1> {/* <<< DIUBAH */}
      <p className="text-center text-gray-600 mb-6">Harap isi detail Anda untuk mendapatkan nomor antrean kunjungan Anda.</p> {/* <<< DIUBAH */}

      {submissionError && (
        <div role="alert" className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{submissionError}</span>
        </div>
      )}

      {showSuccess && ticketNumber && (
        <div role="alert" className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Tiket Anda berhasil dibuat! Nomor Anda adalah: <strong>{ticketNumber}</strong></span> {/* <<< DIUBAH */}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- Informasi Pasien --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nama Lengkap *</span> {/* <<< DIUBAH */}
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="misal: John Doe" // <<< DIUBAH
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Tanggal Lahir *</span> {/* <<< DIUBAH */}
          </label>
          <input
            className="input input-bordered w-full"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Jenis Kelamin *</span> {/* <<< DIUBAH */}
          </label>
          <select
            className="select select-bordered w-full"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Pilih Jenis Kelamin</option> {/* <<< DIUBAH */}
            <option value="male">Laki-laki</option> {/* <<< DIUBAH */}
            <option value="female">Perempuan</option> {/* <<< DIUBAH */}
            <option value="other">Lainnya</option> {/* <<< DIUBAH */}
            <option value="prefer_not_say">Tidak Ingin Menyebutkan</option> {/* <<< DIUBAH */}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Nomor Telepon *</span> {/* <<< DIUBAH */}
          </label>
          <input
            className="input input-bordered w-full"
            type="tel"
            placeholder="misal: +628123456789" // <<< DIUBAH
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email (Opsional)</span> {/* <<< DIUBAH */}
          </label>
          <input
            className="input input-bordered w-full"
            type="email"
            placeholder="misal: email.anda@contoh.com" // <<< DIUBAH
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Nomor ID Nasional (KTP/NIK) *</span> {/* <<< DIUBAH */}
            <span className="label-text-alt text-gray-500">Untuk identifikasi</span> {/* <<< DIUBAH */}
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="misal: 1234567890123456" // <<< DIUBAH
            value={nationalIdNumber}
            onChange={(e) => setNationalIdNumber(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Nomor Rekam Medis (MRN) (Opsional)</span> {/* <<< DIUBAH */}
            <span className="label-text-alt text-gray-500">Jika Anda pasien yang sudah ada</span> {/* <<< DIUBAH */}
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="misal: H0012345" // <<< DIUBAH
            value={medicalRecordNumber}
            onChange={(e) => setMedicalRecordNumber(e.target.value)}
            disabled={loading}
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
            <span className="label-text">Saya memiliki kebutuhan khusus (misal: kursi roda, penerjemah)</span> {/* <<< DIUBAH */}
          </label>
        </div>

        <div className="divider"></div>

        {/* --- Detail Kunjungan --- */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Alasan Kunjungan *</span> {/* <<< DIUBAH */}
            <span className="label-text-alt text-gray-500">Jelaskan singkat kebutuhan Anda</span> {/* <<< DIUBAH */}
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full"
            placeholder="misal: Gejala flu, kontrol pasca pemeriksaan, pertanyaan administrasi" // <<< DIUBAH
            value={reasonForVisit}
            onChange={(e) => setReasonForVisit(e.target.value)}
            required
            disabled={loading}
          ></textarea>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Pilih Departemen *</span> {/* <<< DIUBAH */}
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            required
            disabled={loading || departments.length === 0}
          >
            <option value="">Pilih Departemen</option> {/* <<< DIUBAH */}
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name} {dept.description ? `(${dept.description})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Tanggal Kunjungan Pilihan *</span> {/* <<< DIUBAH */}
            <span className="label-text-alt text-gray-500">Tanggal hari ini sudah terpilih secara otomatis</span> {/* <<< DIUBAH */}
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
            <span className="label-text">Tingkat Prioritas *</span> {/* <<< DIUBAH */}
          </label>
          <select
            className="select select-bordered w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
            disabled={loading}
          >
            <option value="normal">Normal</option> {/* <<< DIUBAH */}
            <option value="high">Tinggi</option> {/* <<< DIUBAH */}
            <option value="emergency">Darurat (Kasus Mendesak)</option> {/* <<< DIUBAH */}
          </select>
        </div>

        <button
          className="btn btn-primary w-full mt-6"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Membuat Tiket...' : 'Ambil Tiket Saya'} {/* <<< DIUBAH */}
        </button>
      </form>

      {ticketNumber && showSuccess && (
        <div className="mt-8 p-6 bg-green-50 text-green-800 rounded-lg shadow-inner text-center">
          <p className="font-bold text-2xl mb-2">Terima kasih! Nomor Tiket Anda adalah:</p> {/* <<< DIUBAH */}
          <p className="text-5xl font-extrabold text-blue-700">{ticketNumber}</p>
          <p className="mt-4 text-gray-700">Harap tunggu nomor Anda dipanggil oleh staf.</p> {/* <<< DIUBAH */}
        </div>
      )}
    </div>
  );
}