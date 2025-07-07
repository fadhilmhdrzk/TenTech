import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { format, parseISO } from "date-fns";
import NowServingDisplay from "../../components/NowServingDisplay"; // Sesuaikan path jika perlu
import MultiDepartmentQueueBoard from "../../components/MultiDepartmentQueueBoard"; // <<< IMPORT BARU

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("tickets")
        .select(
          `
          id,
          queue_number,
          reason_for_visit,
          assigned_date,
          assigned_time,
          status,
          priority,
          notes_from_admin,
          created_at,
          confirmed_at,
          called_at,
          checked_in_at,
          completed_at,
          cancelled_at,
          cancellation_reason,
          patient:patient_id ( full_name, phone, email, medical_record_number, national_id_number ),
          department:department_id ( name, description )
          `
        );

      if (filterDate) {
        query = query.eq('assigned_date', filterDate);
      }

      if (searchTerm) {
        query = query.or(`patient.full_name.ilike.%${searchTerm}%,department.name.ilike.%${searchTerm}%`);
      }

      query = query.order("assigned_time", { ascending: true })
        .order("created_at", { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching tickets:", error.message);
        setError("Gagal memuat tiket: " + error.message); // <<< DIUBAH
      } else {
        setTickets(data);
      }
    } catch (err) {
      console.error("Unexpected error fetching tickets:", err.message);
      setError("Terjadi kesalahan tak terduga saat memuat tiket."); // <<< DIUBAH
    } finally {
      setLoading(false);
    }
  }, [filterDate, searchTerm]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateTicketStatus = async (ticketId, newStatus) => {
    setLoading(true);
    setError(null);

    try {
      let updatePayload = { status: newStatus };

      const now = new Date().toISOString();
      if (newStatus === 'confirmed') {
        updatePayload.confirmed_at = now;
      } else if (newStatus === 'checked_in') {
        updatePayload.checked_in_at = now;
      } else if (newStatus === 'called') {
        // updatePayload.called_at = now; // Dikendalikan oleh database trigger
      } else if (newStatus === 'completed') {
        updatePayload.completed_at = now;
      } else if (newStatus === 'cancelled' || newStatus === 'no_show') {
        updatePayload.cancelled_at = now;
      }

      const { error } = await supabase
        .from('tickets')
        .update(updatePayload)
        .eq('id', ticketId);

      if (error) {
        console.error("Error updating ticket status:", error.message);
        setError("Gagal memperbarui status tiket: " + error.message); // <<< DIUBAH
      } else {
        fetchTickets();
      }
    } catch (err) {
      console.error("Unexpected error updating ticket status:", err.message);
      setError("Terjadi kesalahan tak terduga saat memperbarui status tiket."); // <<< DIUBAH
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date/time for display
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "-";
    // Menggunakan toLocaleString untuk format tanggal dan waktu yang sesuai dengan lokal
    return new Date(timestamp).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    const [hours, minutes] = timeString.split(':');
    // Menggunakan toLocaleTimeString jika hanya waktu
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Manajemen Antrean Tiket</h1>

      {/* Ganti Now Serving Display lama dengan MultiDepartmentQueueBoard */}
      <div className="mb-8">
        <MultiDepartmentQueueBoard /> {/* <<< PENGGUNAAN BARU */}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700 mb-1">Filter berdasarkan Tanggal:</label> {/* <<< DIUBAH */}
          <input
            type="date"
            id="filterDate"
            className="input input-bordered w-full"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">Cari Pasien/Departemen:</label> {/* <<< DIUBAH */}
          <input
            type="text"
            id="searchTerm"
            placeholder="Cari berdasarkan nama pasien atau departemen..." // <<< DIUBAH
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => fetchTickets()}
            className="btn btn-primary w-full md:w-auto"
            disabled={loading}
          >
            {loading ? "Memuat Ulang..." : "Muat Ulang Tiket"} {/* <<< DIUBAH */}
          </button>
        </div>
      </div>


      {loading ? (
        <div className="text-center text-gray-500 text-lg py-10">Memuat tiket...</div> // <<< DIUBAH
      ) : error ? (
        <div className="text-center text-red-500 text-lg py-10">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
          <table className="table w-full">
            <thead className="bg-blue-600 text-white sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left">Antrean #</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Nama Pasien</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Departemen</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Alasan</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Waktu Dijadwalkan</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Status</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Prioritas</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Dibuat Pada</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Dikonfirmasi Pada</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Check-in Pada</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Dipanggil Pada</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Selesai Pada</th> {/* <<< DIUBAH */}
                <th className="py-3 px-4 text-left">Aksi</th> {/* <<< DIUBAH */}
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center py-8 text-gray-600">
                    Tidak ada tiket ditemukan untuk {filterDate}. {/* <<< DIUBAH */}
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="py-3 px-4 font-semibold text-lg">{ticket.queue_number}</td>
                    <td className="py-3 px-4">
                      {ticket.patient?.full_name || "N/A"}
                      <div className="text-sm text-gray-500">
                        {ticket.patient?.phone} | MRN: {ticket.patient?.medical_record_number}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {ticket.department?.name || "N/A"}
                      <div className="text-sm text-gray-500">{ticket.department?.description}</div>
                    </td>
                    <td className="py-3 px-4 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{ticket.reason_for_visit || "-"}</td>
                    <td className="py-3 px-4 font-medium">
                      {ticket.assigned_date ? new Date(ticket.assigned_date).toLocaleDateString('id-ID') : '-'} {/* Format tanggal ID */}
                      {ticket.assigned_time ? ` pada ${formatTime(ticket.assigned_time)}` : ''} {/* <<< DIUBAH */}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${ticket.status === "waiting" ? "badge-warning" :
                            ticket.status === "confirmed" ? "badge-info" :
                              ticket.status === "checked_in" ? "badge-primary" :
                                ticket.status === "called" ? "badge-success" :
                                  ticket.status === "completed" ? "badge-accent" :
                                    ticket.status === "cancelled" || ticket.status === "no_show" ? "badge-error" :
                                      "badge-ghost"
                          } text-sm font-semibold`}
                      >
                        {/* Terjemahkan status */}
                        {ticket.status === 'waiting' ? 'Menunggu' :
                          ticket.status === 'confirmed' ? 'Dikonfirmasi' :
                            ticket.status === 'checked_in' ? 'Check-in' :
                              ticket.status === 'called' ? 'Dipanggil' :
                                ticket.status === 'completed' ? 'Selesai' :
                                  ticket.status === 'cancelled' ? 'Dibatalkan' :
                                    ticket.status === 'no_show' ? 'Tidak Hadir' :
                                      ticket.status} {/* <<< DIUBAH */}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${ticket.priority === "high" ? "badge-error" :
                            ticket.priority === "emergency" ? "badge-danger animate-pulse" :
                              "badge-ghost"
                          } text-sm font-semibold`}
                      >
                        {/* Terjemahkan prioritas */}
                        {ticket.priority === 'normal' ? 'Normal' :
                          ticket.priority === 'high' ? 'Tinggi' :
                            ticket.priority === 'emergency' ? 'Darurat' :
                              ticket.priority} {/* <<< DIUBAH */}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDateTime(ticket.created_at)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDateTime(ticket.confirmed_at)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDateTime(ticket.checked_in_at)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDateTime(ticket.called_at)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDateTime(ticket.completed_at)}</td>
                    <td className="py-3 px-4">
                      <select
                        className="select select-bordered select-sm w-full max-w-xs"
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                        disabled={loading || ticket.status === 'completed' || ticket.status === 'cancelled' || ticket.status === 'no_show'}
                      >
                        {ticket.status === 'pending' && (
                          <>
                            <option value="pending">Menunggu</option> {/* <<< DIUBAH */}
                            <option value="confirmed">Konfirmasi</option> {/* <<< DIUBAH */}
                            <option value="cancelled">Batalkan</option> {/* <<< DIUBAH */}
                          </>
                        )}
                        {ticket.status === 'confirmed' && (
                          <>
                            <option value="confirmed">Dikonfirmasi</option> {/* <<< DIUBAH */}
                            <option value="checked_in">Check-in</option> {/* <<< DIUBAH */}
                            <option value="called">Panggil Pasien</option> {/* <<< DIUBAH */}
                            <option value="cancelled">Batalkan</option> {/* <<< DIUBAH */}
                            <option value="no_show">Tidak Hadir</option> {/* <<< DIUBAH */}
                          </>
                        )}
                        {ticket.status === 'checked_in' && (
                          <>
                            <option value="checked_in">Check-in</option> {/* <<< DIUBAH */}
                            <option value="called">Panggil Pasien</option> {/* <<< DIUBAH */}
                            <option value="completed">Selesaikan Kunjungan</option> {/* <<< DIUBAH */}
                            <option value="cancelled">Batalkan</option> {/* <<< DIUBAH */}
                          </>
                        )}
                        {ticket.status === 'called' && (
                          <>
                            <option value="called">Dipanggil</option> {/* <<< DIUBAH */}
                            <option value="completed">Selesaikan Kunjungan</option> {/* <<< DIUBAH */}
                            <option value="cancelled">Batalkan</option> {/* <<< DIUBAH */}
                          </>
                        )}
                        {ticket.status === 'completed' && <option value="completed">Selesai</option>} {/* <<< DIUBAH */}
                        {ticket.status === 'cancelled' && <option value="cancelled">Dibatalkan</option>} {/* <<< DIUBAH */}
                        {ticket.status === 'no_show' && <option value="no_show">Tidak Hadir</option>} {/* <<< DIUBAH */}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}