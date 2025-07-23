import { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Guest/logo.png'; // Pastikan path logo ini benar

export default function Guest() {
  const { user, userProfile, loading: authLoading } = useAuth();

  // Patient-related states
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [medicalRecordNumber, setMedicalRecordNumber] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [reasonForVisit, setReasonForVisit] = useState('');

  const [isProfileFieldsDisabled, setIsProfileFieldsDisabled] = useState(false);

  // Ticket-related states
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [assignedDate, setAssignedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [priority, setPriority] = useState('normal');

  // >>> STATE BARU UNTUK WAKTU ALOKASI OTOMATIS <<<
  const [calculatedAssignedTime, setCalculatedAssignedTime] = useState(null);
  const [calculatingTime, setCalculatingTime] = useState(false); // Untuk status loading perhitungan waktu
  // >>> AKHIR STATE BARU <<<

  // UI states
  const [ticketNumber, setTicketNumber] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state untuk pengiriman form
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
      setFullName(userProfile.full_name || '');
      setDateOfBirth(userProfile.date_of_birth || '');
      setGender(userProfile.gender || '');
      setPhone(userProfile.phone || '');
      setEmail(userProfile.email || user.email || '');
      setNationalIdNumber(userProfile.national_id_number || '');
      setMedicalRecordNumber(userProfile.medical_record_number || '');
      setSpecialNeeds(userProfile.special_needs || false);
      setIsProfileFieldsDisabled(true);
    } else if (!authLoading && user && !userProfile) {
      setEmail(user.email || '');
      setIsProfileFieldsDisabled(false);
    } else if (!authLoading && !user) {
      setIsProfileFieldsDisabled(false);
    }
  }, [authLoading, user, userProfile]);

  // >>> EFFECT BARU: Menghitung waktu alokasi saat departemen atau tanggal berubah <<<
  useEffect(() => {
    const calculateTimeSlot = async () => {
      if (!selectedDeptId || !assignedDate) {
        setCalculatedAssignedTime(null);
        return;
      }
      setCalculatingTime(true);
      setSubmissionError(null);
      try {
        const { data, error } = await supabase.rpc('get_next_available_slot', {
          p_department_id: selectedDeptId,
          p_assigned_date: assignedDate
        });

        if (error) {
          console.error("Error calculating next slot:", error.message);
          setSubmissionError(`Gagal menghitung slot waktu: ${error.message}`);
          setCalculatedAssignedTime(null);
        } else {
          setCalculatedAssignedTime(data); // Data adalah waktu (misal: "08:00:00")
        }
      } catch (err) {
        console.error("Kesalahan tak terduga saat menghitung slot waktu:", err.message);
        setSubmissionError(`Terjadi kesalahan tak terduga saat menghitung slot waktu: ${err.message}`);
        setCalculatedAssignedTime(null);
      } finally {
        setCalculatingTime(false);
      }
    };

    calculateTimeSlot();
  }, [selectedDeptId, assignedDate]); // Dipicu saat departemen atau tanggal berubah
  // >>> AKHIR EFFECT BARU <<<

  // --- Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionError(null);
    setShowSuccess(false);

    // >>> Pastikan waktu alokasi sudah dihitung dan valid sebelum submit <<<
    if (!calculatedAssignedTime || calculatingTime) {
        setSubmissionError("Slot waktu belum dihitung atau sedang dalam proses. Harap tunggu.");
        setLoading(false);
        return;
    }

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
      if (user && user.id) {
        if (userProfile) {
          patientId = userProfile.id;
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
          console.log("Pengguna terautentikasi tanpa profil pasien. Membuat profil baru.");
          const { data: newPatientData, error: patientInsertError } = await supabase
            .from('patients')
            .insert({
              auth_id: user.id,
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
        throw new Error("Anda harus login untuk membuat tiket.");
      }

      // --- LOGIKA PEMBUATAN TIKET: Sekarang menggunakan assigned_time dari RPC ---
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
          assigned_time: calculatedAssignedTime, // <<< KIRIM WAKTU ALOKASI DARI STATE BARU
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
    setCalculatedAssignedTime(null); // Reset waktu alokasi
  };

  if (authLoading) {
      return (
          <div className="p-6 text-center text-gray-600">
              <span className="loading loading-spinner loading-lg"></span>
              <p>Memuat profil pengguna...</p>
          </div>
      );
  }

  if (!user) {
      return (
          <div className="p-6 text-center text-red-600">
              Anda harus login untuk mengakses halaman ini.
          </div>
      );
  }


  return (
    <div className="flex justify-center px-4">
      {/* Container Form */}
      <div className="relative p-10 pt-20 max-w-5xl w-full bg-white rounded-2xl shadow-2xl my-10 border border-gray-200">
        
        <img src={logo} alt="Logo" className="h-20 w-auto" />

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-teal-600 mb-4">Ambil Tiket Rumah Sakit Anda</h1>
        <p className="text-center text-gray-500 mb-10">
          Harap isi detail Anda untuk mendapatkan nomor antrean kunjungan Anda.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama dan Tanggal Lahir */}
          <div className="form-control">
            <label className="label"><span className="label-text">Nama Lengkap *</span></label>
            <input type="text" className="input input-bordered" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={loading || isProfileFieldsDisabled} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Tanggal Lahir *</span></label>
            <input type="date" className="input input-bordered" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required disabled={loading || isProfileFieldsDisabled} />
          </div>

          {/* Jenis Kelamin dan Nomor Telepon */}
          <div className="form-control">
            <label className="label"><span className="label-text">Jenis Kelamin *</span></label>
            <select className="select select-bordered" value={gender} onChange={(e) => setGender(e.target.value)} required disabled={loading || isProfileFieldsDisabled}>
              <option value="">Pilih Jenis Kelamin</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
              <option value="other">Lainnya</option>
              <option value="prefer_not_say">Tidak Ingin Menyebutkan</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Nomor Telepon *</span></label>
            <input type="tel" className="input input-bordered" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={loading || isProfileFieldsDisabled} />
          </div>

          {/* Email dan NIK */}
          <div className="form-control">
            <label className="label"><span className="label-text">Email (Opsional)</span></label>
            <input type="email" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading || isProfileFieldsDisabled} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Nomor ID Nasional (KTP/NIK) *</span></label>
            <input type="text" className="input input-bordered" value={nationalIdNumber} onChange={(e) => setNationalIdNumber(e.target.value)} required disabled={loading || isProfileFieldsDisabled} />
          </div>

          {/* MRN dan checkbox kebutuhan khusus */}
          <div className="form-control">
            <label className="label"><span className="label-text">Nomor Rekam Medis (MRN) (Opsional)</span></label>
            <input type="text" className="input input-bordered" value={medicalRecordNumber} onChange={(e) => setMedicalRecordNumber(e.target.value)} disabled={loading || isProfileFieldsDisabled} />
          </div>
          <div className="form-control flex items-center gap-2 pt-8">
            <input type="checkbox" className="checkbox checkbox-primary" checked={specialNeeds} onChange={(e) => setSpecialNeeds(e.target.checked)} disabled={loading} />
            <label className="label"><span className="label-text">Saya memiliki kebutuhan khusus</span></label>
          </div>

          {/* Alasan kunjungan (full width) */}
          <div className="col-span-1 md:col-span-2 form-control">
            <label className="label"><span className="label-text">Alasan Kunjungan *</span></label>
            <textarea className="textarea textarea-bordered h-24" value={reasonForVisit} onChange={(e) => setReasonForVisit(e.target.value)} required disabled={loading}></textarea>
          </div>

          {/* Departemen dan tanggal */}
          <div className="form-control">
            <label className="label"><span className="label-text">Pilih Departemen *</span></label>
            <select className="select select-bordered" value={selectedDeptId} onChange={(e) => setSelectedDeptId(e.target.value)} required disabled={loading || departments.length === 0}>
              <option value="">Pilih Departemen</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} {dept.description ? `(${dept.description})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Tanggal Kunjungan Pilihan *</span></label>
            <input type="date" className="input input-bordered" value={assignedDate} min={format(new Date(), 'yyyy-MM-dd')} onChange={(e) => setAssignedDate(e.target.value)} required disabled={loading} />
          </div>

          {/* >>> TAMPILAN WAKTU ALOKASI OTOMATIS <<< */}
          <div className="form-control">
              <label className="label">
                  <span className="label-text">Waktu Kunjungan yang Dialokasikan:</span>
              </label>
              <div className="input input-bordered w-full flex items-center bg-gray-50">
                  {calculatingTime ? (
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                  ) : calculatedAssignedTime ? (
                      <span className="font-semibold text-blue-700 text-lg">{calculatedAssignedTime.substring(0,5)}</span>
                  ) : (
                      <span className="text-gray-500">Pilih departemen & tanggal untuk estimasi waktu</span>
                  )}
              </div>
          </div>
          {/* <<< AKHIR TAMPILAN WAKTU ALOKASI OTOMATIS >>> */}

          {/* Prioritas */}
          <div className="form-control">
            <label className="label"><span className="label-text">Tingkat Prioritas *</span></label>
            <select className="select select-bordered" value={priority} onChange={(e) => setPriority(e.target.value)} required disabled={loading}>
              <option value="normal">Normal</option>
              <option value="high">Tinggi</option>
              <option value="emergency">Darurat (Kasus Mendesak)</option>
            </select>
          </div>

          {/* Tombol submit (full width) */}
          <div className="col-span-1 md:col-span-2">
            <button type="submit" className="btn btn-accent w-full mt-4 text-white text-lg tracking-wide" disabled={loading || calculatingTime || !calculatedAssignedTime}>
              {loading ? 'Membuat Tiket...' : 'Ambil Tiket Saya'}
            </button>
          </div>
        </form>

        {/* Tampilan Tiket */}
        {ticketNumber && showSuccess && (
          <div className="mt-10 p-6 bg-green-50 border border-green-200 rounded-lg shadow text-center">
            <p className="text-xl font-semibold text-green-800 mb-2">Terima kasih! Nomor Tiket Anda adalah:</p>
            <p className="text-5xl font-extrabold text-blue-700">{ticketNumber}</p>
            <p className="mt-4 text-gray-600">Harap tunggu nomor Anda dipanggil oleh staf.</p>
          </div>
        )}
      </div>
    </div>
  );
}