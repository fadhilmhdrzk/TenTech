import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { format, addMinutes, differenceInSeconds } from 'date-fns';

const TIMER_DURATION_MINUTES = 5;

// Tambahkan prop 'departmentId' ke komponen NowServingDisplay
export default function NowServingDisplay({ departmentId, departmentName = "Departemen" }) { // Tambah departmentName juga
  const [currentTicket, setCurrentTicket] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerIntervalRef = useRef(null);

  const createUTCDateFromISO = (isoString) => {
    if (!isoString) return null;
    try {
      const dateParts = isoString.match(
          /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(?:Z|[+-]\d{2}:\d{2})?$/
      );
      if (!dateParts) {
        console.error("Invalid ISO string format for UTC parsing (regex mismatch):", isoString);
        return null;
      }
      const year = parseInt(dateParts[1], 10);
      const month = parseInt(dateParts[2], 10) - 1;
      const day = parseInt(dateParts[3], 10);
      const hours = parseInt(dateParts[4], 10);
      const minutes = parseInt(dateParts[5], 10);
      const seconds = parseInt(dateParts[6], 10);
      const millisecondsStr = dateParts[7] || '0';
      const milliseconds = parseInt(millisecondsStr.substring(0, 3), 10);
      return new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
    } catch (e) {
      console.error("Failed to manually parse UTC ISO string (exception caught):", isoString, e);
      return null;
    }
  };

  const fetchCurrentCalledTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('tickets')
        .select(`
          id,
          queue_number,
          called_at,
          status,
          patient:patient_id ( full_name ),
          department:department_id ( name )
        `);

      // <<< PENTING: FILTER BERDASARKAN departmentId JIKA DISEDIAKAN >>>
      if (departmentId) {
        query = query.eq('department_id', departmentId);
      } else {
        // Jika tidak ada departmentId, pastikan tidak ada query aneh yang muncul dari filter lain
        // Ini adalah fallback untuk mode global jika masih diperlukan
      }

      query = query.eq('status', 'called')
                   .order('called_at', { ascending: false })
                   .limit(1);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const ticket = data[0];
        if (ticket.called_at && (!currentTicket || currentTicket.id !== ticket.id || currentTicket.status !== ticket.status)) {
            setCurrentTicket({
                ...ticket,
                _timer_start_time_utc_obj: createUTCDateFromISO(ticket.called_at),
            });
        } else if (!ticket.called_at) {
            setCurrentTicket(null);
        }
      } else {
        setCurrentTicket(null);
      }
    } catch (err) {
      console.error("Error fetching current called ticket:", err.message);
      setError("Gagal mengambil pasien yang sedang dilayani. Harap periksa koneksi database atau izin.");
      setCurrentTicket(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentCalledTicket();

    const channel = supabase
      .channel(`now_serving_channel_${departmentId || 'global'}`) // Nama channel unik per departemen
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tickets',
        // Filter Realtime langsung di sini jika departmentId ada
        ...(departmentId && { filter: `department_id=eq.${departmentId}` }),
      }, payload => {
        if (payload.new.status === 'called' || (currentTicket && payload.new.id === currentTicket.id && payload.new.status !== 'called')) {
            console.log('Realtime update received:', payload);
            fetchCurrentCalledTicket();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentTicket, departmentId]); // Tambahkan departmentId ke dependency

  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (currentTicket && currentTicket._timer_start_time_utc_obj) {
      const startTimeForTimer = currentTicket._timer_start_time_utc_obj;
      const endTime = addMinutes(startTimeForTimer, TIMER_DURATION_MINUTES);

      console.log("--- TIMER DEBUG INFO ---"); // Ubah sesuai kebutuhan
      console.log("1. Raw called_at from DB:", currentTicket.called_at);
      console.log("2. Timer Start Time (Robust UTC Date obj):", startTimeForTimer);
      console.log("3. Calculated End Time:", endTime);
      console.log("4. Current Client Time (now):", new Date());

      const updateTimer = () => {
        const now = new Date();
        const secondsLeft = differenceInSeconds(endTime, now);

        console.log(`5. [${currentTicket.queue_number}] Now: ${now.toISOString()}, EndTime: ${endTime.toISOString()}, SecondsLeft: ${secondsLeft}`);

        const effectiveSecondsLeft = Math.max(0, secondsLeft);

        if (effectiveSecondsLeft <= 0) {
          setRemainingTime(0);
          clearInterval(timerIntervalRef.current);
          console.log(`6. [${currentTicket.queue_number}] Timer kedaluwarsa. Berhenti.`);
        } else {
          setRemainingTime(effectiveSecondsLeft);
        }
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);
    } else {
      setRemainingTime(null);
      console.log("No current ticket or valid start time. Timer not active.");
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        console.log("Timer cleanup: Interval cleared.");
      }
    };
  }, [currentTicket, departmentId]);

  const formatTimeDisplay = (seconds) => {
    if (seconds === null) return 'N/A';
    if (seconds <= 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4 text-blue-600">
        <span className="loading loading-spinner loading-md"></span>
        <span className="ml-2">Memuat antrean saat ini...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#00afc5] to-blue-600 text-white p-4 md:p-6 rounded-lg shadow-xl text-center">
      {/* Tampilkan nama departemen di sini */}
      <h3 className="text-lg md:text-xl font-bold mb-1">{departmentName}</h3> 
      <h2 className="text-xl md:text-2xl font-bold mb-2">SEKARANG DILAYANI</h2>
      {currentTicket ? (
        <>
          <p className="text-5xl md:text-7xl font-extrabold mb-4 animate-pulse">
            {currentTicket.queue_number}
          </p>
          <p className="text-lg md:text-xl font-semibold mb-1">
            {currentTicket.patient?.full_name || 'Pasien N/A'}
          </p>
          {/* Hapus departemen dari sini karena sudah di h3 */}
          {/* <p className="text-md md:text-lg opacity-90 mb-3">{currentTicket.department?.name || 'Departemen N/A'}</p> */}
          <div className="text-3xl md:text-5xl font-mono bg-white/20 rounded-lg py-2 px-4 inline-block min-w-[120px]">
            {formatTimeDisplay(remainingTime)}
          </div>
          {remainingTime <= 0 && (
            <p className="mt-2 text-yellow-200 text-sm md:text-md font-medium">Waktu habis. Silakan lanjutkan.</p>
          )}
        </>
      ) : (
        <p className="text-2xl md:text-3xl font-semibold opacity-90 py-4">
          Tidak ada pasien yang sedang dipanggil.
        </p>
      )}
    </div>
  );
}