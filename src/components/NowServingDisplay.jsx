import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { format, addMinutes, differenceInSeconds } from 'date-fns';
// No need for date-fns-tz or parseISO with this robust manual parsing approach

const TIMER_DURATION_MINUTES = 2; // The timer duration in minutes

export default function NowServingDisplay() {
  const [currentTicket, setCurrentTicket] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null); // Time in seconds
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerIntervalRef = useRef(null); // Ref to hold the interval ID

  // --- Helper function to robustly create a UTC Date object from an ISO string ---
  // This function is designed to handle common ISO timestamp formats from databases,
  // particularly those without a 'Z' or explicit timezone offset, or with more than 3 milliseconds digits.
  const createUTCDateFromISO = (isoString) => {
    if (!isoString) return null;
    try {
      // Regex to capture Year, MM, DD, HH, MM, SS, and optional fractional seconds.
      // It also handles optional 'Z' or '+/-HH:MM' at the end.
      // We are forcing the interpretation as UTC.
      const dateParts = isoString.match(
          /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(?:Z|[+-]\d{2}:\d{2})?$/
      );

      if (!dateParts) {
        console.error("Invalid ISO string format for UTC parsing (regex mismatch):", isoString);
        return null; // Return null if the string doesn't match the expected ISO format
      }

      const year = parseInt(dateParts[1], 10);
      const month = parseInt(dateParts[2], 10) - 1; // Month is 0-indexed in JavaScript Date (0-11)
      const day = parseInt(dateParts[3], 10);
      const hours = parseInt(dateParts[4], 10);
      const minutes = parseInt(dateParts[5], 10);
      const seconds = parseInt(dateParts[6], 10);
      // Milliseconds can be variable length from DB. We take the first 3 digits for standard JS Date precision.
      const millisecondsStr = dateParts[7] || '0'; // Handle case where milliseconds part is absent
      const milliseconds = parseInt(millisecondsStr.substring(0, 3), 10);

      // Date.UTC returns milliseconds since epoch for the UTC date.
      // This explicitly constructs a Date object in UTC, avoiding local timezone interpretation.
      return new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
    } catch (e) {
      console.error("Failed to manually parse UTC ISO string (exception caught):", isoString, e);
      return null;
    }
  };

  // --- Function to fetch the currently 'called' ticket ---
  // This function is responsible for querying Supabase for the active 'called' ticket.
  const fetchCurrentCalledTicket = async () => {
    setLoading(true); // Set loading state
    setError(null);    // Clear any previous errors

    try {
      // Fetch the most recently 'called' ticket that is not yet completed/cancelled/no_show.
      // Ordered by 'called_at' descending to get the latest one.
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          id,
          queue_number,
          called_at,
          status,
          patient:patient_id ( full_name ),
          department:department_id ( name )
        `)
        .eq('status', 'called')
        .order('called_at', { ascending: false })
        .limit(1);

      if (error) {
        throw error; // Lempar error jika ada dari Supabase
      }

      if (data && data.length > 0) {
        const ticket = data[0]; // Dapatkan tiket pertama (yang paling baru)
        // Check if the fetched ticket has a 'called_at' timestamp and if it's different from the current one.
        // This prevents unnecessary re-renders if the same ticket is repeatedly 'called' or status is same.
        if (ticket.called_at && (!currentTicket || currentTicket.id !== ticket.id || currentTicket.status !== ticket.status)) {
            setCurrentTicket({
                ...ticket,
                // Assign a new property that holds the robustly parsed UTC Date object for timer calculations.
                _timer_start_time_utc_obj: createUTCDateFromISO(ticket.called_at),
            });
        } else if (!ticket.called_at) {
            // Jika statusnya 'dipanggil' tetapi called_at secara tak terduga null, anggap tidak ada tiket
            setCurrentTicket(null);
        }
      } else {
        // Jika tidak ada 'called' tickets ditemukan, clear the current display
        setCurrentTicket(null);
      }
    } catch (err) {
      // Catch any errors during the fetch process and update error state
      console.error("Error fetching current called ticket:", err.message);
      setError("Gagal mengambil pasien yang sedang dilayani. Harap periksa koneksi database atau izin.");
      setCurrentTicket(null); // Kosongkan tampilan saat terjadi error
    } finally {
      setLoading(false); // Akhiri status loading
    }
  };

  // --- useEffect hook for initial data fetch and setting up Realtime subscription ---
  useEffect(() => {
    fetchCurrentCalledTicket();

    const channel = supabase
      .channel('now_serving_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tickets',
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
  }, [currentTicket]);

  // --- useEffect hook to manage the countdown timer logic ---
  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (currentTicket && currentTicket._timer_start_time_utc_obj) {
      const startTimeForTimer = currentTicket._timer_start_time_utc_obj;
      const endTime = addMinutes(startTimeForTimer, TIMER_DURATION_MINUTES);

      console.log("--- TIMER DEBUG INFO (Final, FINAL Attempt) ---");
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
  }, [currentTicket]);

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
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 md:p-6 rounded-lg shadow-xl text-center">
      <h2 className="text-xl md:text-2xl font-bold mb-2">SEKARANG DILAYANI</h2>
      {currentTicket ? (
        <>
          <p className="text-5xl md:text-7xl font-extrabold mb-4 animate-pulse">
            {currentTicket.queue_number}
          </p>
          <p className="text-lg md:text-xl font-semibold mb-1">
            {currentTicket.patient?.full_name || 'Pasien N/A'}
          </p>
          <p className="text-md md:text-lg opacity-90 mb-3">
            {currentTicket.department?.name || 'Departemen N/A'}
          </p>
          <div className="text-3xl md:text-5xl font-mono bg-white/20 rounded-lg py-2 px-4 inline-block min-w-[120px]">
            {formatTimeDisplay(remainingTime)}
          </div>
          {remainingTime <= 0 && (
            <p className="mt-2 text-yellow-200 text-sm md:text-md font-medium">Waktu habis. Silakan lanjutkan.</p>
          )}
        </>
      ) : (
        <p className="text-2xl md:text-3xl font-semibold opacity-90 py-4">
          Tidak ada pasien yang sedang dipanggil. {/* <<< DIUBAH */}
        </p>
      )}
    </div>
  );
}