import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Calendar, Clock, MapPin, IndianRupee, CheckCircle2, XCircle, Clock4, Filter, Search, LayoutDashboard, Briefcase, CalendarCheck, Wallet, Star, UserCircle } from 'lucide-react';

interface ProviderBookingsProps {
    session: Session;
    onNavigate: (view: 'list' | 'add' | 'profile' | 'bookings') => void;
}

const ProviderBookings: React.FC<ProviderBookingsProps> = ({ session, onNavigate }) => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data: bookingsData, error: fetchError } = await supabase
                .from('bookings')
                .select('*')
                .eq('provider_id', session.user.id)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            let mergedBookings = bookingsData || [];

            if (mergedBookings.length > 0) {
                // Fetch related services
                const serviceIds = [...new Set(mergedBookings.map(b => b.service_id))];
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('id, service_name, price, duration, location')
                    .in('id', serviceIds);

                const servicesMap = (servicesData || []).reduce((acc: any, service: any) => {
                    acc[service.id] = service;
                    return acc;
                }, {});

                // Fetch related customer profiles
                const customerIds = [...new Set(mergedBookings.map(b => b.customer_id))];
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, phone_number')
                    .in('id', customerIds);

                const profilesMap = (profilesData || []).reduce((acc: any, profile: any) => {
                    acc[profile.id] = profile;
                    return acc;
                }, {});

                mergedBookings = mergedBookings.map(booking => ({
                    ...booking,
                    services: servicesMap[booking.service_id] || null,
                    profiles: profilesMap[booking.customer_id] || null
                }));
            }

            setBookings(mergedBookings);
        } catch (err: any) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId: number, status: string) => {
        try {
            const { error: updateError } = await supabase
                .from('bookings')
                .update({ status })
                .eq('id', bookingId);

            if (updateError) throw updateError;

            // Optimistically update UI
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
        } catch (err: any) {
            console.error('Error updating booking status:', err);
            alert('Failed to update booking status. Please try again.');
        }
    };

    const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock4 className="w-3 h-3 mr-1" /> Pending</span>;
            case 'accepted':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Accepted</span>;
            case 'rejected':
            case 'cancelled':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> {status.charAt(0).toUpperCase() + status.slice(1)}</span>;
            case 'completed':
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto w-full h-full bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Booking Requests</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and respond to service requests from customers.</p>
                    </div>

                    <div className="flex bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
                        {(['all', 'pending', 'accepted', 'completed'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${filter === f
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                {filteredBookings.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-16 text-center shadow-sm">
                        <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No bookings found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {filter === 'all'
                                ? "You don't have any booking requests yet. They will appear here once customers book your services."
                                : `You don't have any ${filter} bookings at the moment.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBookings.map(booking => (
                            <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md">
                                {/* Service & Customer Details */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                                                {booking.profiles?.full_name?.charAt(0) || 'C'}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {booking.profiles?.full_name || 'Anonymous Customer'}
                                                </h4>
                                                <span className="text-sm text-gray-500 block">Requested on {new Date(booking.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-700">
                                        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">{booking.services?.service_name}</h3>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400 block mb-1">Date</span>
                                                <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                                    {booking.booking_date}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400 block mb-1">Time</span>
                                                <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                                    {booking.booking_time}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400 block mb-1">Price</span>
                                                <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                                    <IndianRupee className="w-4 h-4 mr-1 text-gray-400" />
                                                    {booking.services?.price}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400 block mb-1">Location</span>
                                                <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                    <span className="truncate">{booking.services?.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.notes && (
                                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                                            <span className="font-semibold block mb-1">Customer Note:</span>
                                            "{booking.notes}"
                                        </div>
                                    )}
                                </div>

                                {/* Action Area */}
                                {booking.status === 'pending' && (
                                    <div className="border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-6 flex flex-row md:flex-col justify-center gap-3 w-full md:w-48 shrink-0">
                                        <button
                                            onClick={() => updateBookingStatus(booking.id, 'accepted')}
                                            className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center text-sm"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Accept
                                        </button>
                                        <button
                                            onClick={() => updateBookingStatus(booking.id, 'rejected')}
                                            className="flex-1 py-2.5 px-4 bg-white dark:bg-gray-800 text-red-600 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-xl transition-colors flex items-center justify-center text-sm"
                                        >
                                            <XCircle className="w-4 h-4 mr-1.5" /> Reject
                                        </button>
                                    </div>
                                )}
                                {booking.status === 'accepted' && (
                                    <div className="border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-6 flex flex-row md:flex-col justify-center gap-3 w-full md:w-48 shrink-0">
                                        <button
                                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                                            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center text-sm"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Completed
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderBookings;
