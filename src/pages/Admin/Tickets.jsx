import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { format } from "date-fns"; // For better date formatting

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd')); // State for date filter, defaults to today
    const [searchTerm, setSearchTerm] = useState(''); // State for patient/department search

    // Function to fetch tickets - wrapped in useCallback for efficiency and dependency array
    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            let query = supabase
                .from("tickets")
                .select(`
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
        `);

            // Apply date filter
            if (filterDate) {
                query = query.eq('assigned_date', filterDate);
            }

            // Apply search term (basic example, can be expanded)
            if (searchTerm) {
                // This performs a case-insensitive search on patient full_name or department name
                query = query.or(`patient.full_name.ilike.%${searchTerm}%,department.name.ilike.%${searchTerm}%`);
            }

            query = query.order("assigned_time", { ascending: true }) // Order by assigned time for the day
                .order("created_at", { ascending: true }); // Secondary order for tickets without specific times

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching tickets:", error.message);
                setError("Failed to load tickets: " + error.message);
            } else {
                setTickets(data);
            }
        } catch (err) {
            console.error("Unexpected error fetching tickets:", err.message);
            setError("An unexpected error occurred while fetching tickets.");
        } finally {
            setLoading(false);
        }
    }, [filterDate, searchTerm]); // Re-run fetchTickets when filterDate or searchTerm changes

    useEffect(() => {
        fetchTickets();

        // Optional: Realtime subscriptions for live updates (more advanced)
        // const channel = supabase
        //   .channel('public:tickets')
        //   .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, payload => {
        //     console.log('Change received!', payload);
        //     // You would update the tickets state here based on the payload
        //     // For simplicity, we'll just refetch all tickets for now on any change.
        //     fetchTickets();
        //   })
        //   .subscribe();

        // return () => {
        //   supabase.removeChannel(channel);
        // };
    }, [fetchTickets]); // Dependency array includes fetchTickets to avoid stale closures

    // Function to update ticket status
    const updateTicketStatus = async (ticketId, newStatus) => {
        setLoading(true);
        setError(null);
        try {
            let updatePayload = { status: newStatus };
            if (newStatus === 'confirmed') {
                updatePayload.confirmed_at = new Date().toISOString(); // Current time in ISO format
            } else if (newStatus === 'checked_in') {
                updatePayload.checked_in_at = new Date().toISOString();
            } else if (newStatus === 'called') {
                updatePayload.called_at = new Date().toISOString();
            } else if (newStatus === 'completed') {
                updatePayload.completed_at = new Date().toISOString();
            } else if (newStatus === 'cancelled' || newStatus === 'no_show') {
                updatePayload.cancelled_at = new Date().toISOString();
                // You might need a modal here to ask for cancellation_reason
            }

            const { error } = await supabase
                .from('tickets')
                .update(updatePayload) // Use the dynamic payload
                .eq('id', ticketId);

            if (error) { /* ... */ } else { fetchTickets(); }
        } catch (err) { /* ... */ } finally { setLoading(false); }
    };

    // Helper function to format date/time
    const formatDateTime = (timestamp) => {
        if (!timestamp) return "-";
        return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
    };

    const formatTime = (timeString) => {
        if (!timeString) return "-";
        // Assuming timeString is in 'HH:MM:SS' format from DB
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    }




    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Ticket Queue Management</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700 mb-1">Filter by Date:</label>
                    <input
                        type="date"
                        id="filterDate"
                        className="input input-bordered w-full"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">Search Patient/Department:</label>
                    <input
                        type="text"
                        id="searchTerm"
                        placeholder="Search by patient name or department..."
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
                        {loading ? "Refreshing..." : "Refresh Tickets"}
                    </button>
                </div>
            </div>


            {loading ? (
                <div className="text-center text-gray-500 text-lg py-10">Loading tickets...</div>
            ) : error ? (
                <div className="text-center text-red-500 text-lg py-10">{error}</div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                    <table className="table w-full">
                        <thead className="bg-blue-600 text-white sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-4 text-left">Queue #</th>
                                <th className="py-3 px-4 text-left">Patient Name</th>
                                <th className="py-3 px-4 text-left">Department</th>
                                <th className="py-3 px-4 text-left">Reason</th>
                                <th className="py-3 px-4 text-left">Assigned Time</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Priority</th>
                                <th className="py-3 px-4 text-left">Created At</th>
                                <th className="py-3 px-4 text-left">Confirmed At</th>
                                <th className="py-3 px-4 text-left">Checked-in At</th>
                                <th className="py-3 px-4 text-left">Called At</th>
                                <th className="py-3 px-4 text-left">Completed At</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="13" className="text-center py-8 text-gray-600">
                                        No tickets found for {filterDate}.
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
                                            {ticket.assigned_date ? format(new Date(ticket.assigned_date), 'MMM dd, yyyy') : '-'}
                                            {ticket.assigned_time ? ` at ${formatTime(ticket.assigned_time)}` : ''}
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
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`badge ${ticket.priority === "high" ? "badge-error" :
                                                        ticket.priority === "emergency" ? "badge-danger animate-pulse" : // Added danger for emergency
                                                            "badge-ghost"
                                                    } text-sm font-semibold`}
                                            >
                                                {ticket.priority}
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
                                                {/* Only allow relevant status changes */}
                                                {ticket.status === 'pending' && (
                                                    <>
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirm</option>
                                                        <option value="cancelled">Cancel</option>
                                                    </>
                                                )}
                                                {ticket.status === 'confirmed' && (
                                                    <>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="checked_in">Check-in</option>
                                                        <option value="cancelled">Cancel</option>
                                                        <option value="no_show">No-Show</option>
                                                    </>
                                                )}
                                                {ticket.status === 'checked_in' && (
                                                    <>
                                                        <option value="checked_in">Checked-in</option>
                                                        <option value="called">Call Patient</option>
                                                        <option value="cancelled">Cancel</option>
                                                    </>
                                                )}
                                                {ticket.status === 'called' && (
                                                    <>
                                                        <option value="called">Called</option>
                                                        <option value="completed">Complete Visit</option>
                                                        <option value="cancelled">Cancel</option>
                                                    </>
                                                )}
                                                {ticket.status === 'completed' && <option value="completed">Completed</option>}
                                                {ticket.status === 'cancelled' && <option value="cancelled">Cancelled</option>}
                                                {ticket.status === 'no_show' && <option value="no_show">No-Show</option>}

                                                {/* Add more conditions for other status transitions as needed */}
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