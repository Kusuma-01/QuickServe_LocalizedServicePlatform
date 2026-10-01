import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { CalendarCheck, Search, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Booking {
    id: string;
    service_id: string;
    customer_id: string;
    provider_id: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    booking_date: string;
    booking_time: string;
    notes: string;
    created_at: string;
    services?: {
        service_name: string;
        price: number;
    };
    customer?: {
        full_name: string;
        phone_number: string;
    };
    provider?: {
        full_name: string;
        phone_number: string;
    };
}

const AdminBookings: React.FC<{ session: Session }> = ({ session }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (bookingsError) throw bookingsError;

            if (bookingsData && bookingsData.length > 0) {
                // Fetch related services
                const serviceIds = [...new Set(bookingsData.map(b => b.service_id))];
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('id, service_name, price')
                    .in('id', serviceIds);
                
                const servicesMap = (servicesData || []).reduce((acc: any, service: any) => {
                    acc[service.id] = service;
                    return acc;
                }, {});

                // Fetch profiles (both customers and providers)
                const profileIds = [...new Set([
                    ...bookingsData.map(b => b.customer_id),
                    ...bookingsData.map(b => b.provider_id)
                ])];
                
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, phone_number')
                    .in('id', profileIds);

                const profilesMap = (profilesData || []).reduce((acc: any, profile: any) => {
                    acc[profile.id] = profile;
                    return acc;
                }, {});

                const enrichedBookings = bookingsData.map(booking => ({
                    ...booking,
                    services: servicesMap[booking.service_id] || null,
                    customer: profilesMap[booking.customer_id] || null,
                    provider: profilesMap[booking.provider_id] || null
                }));

                setBookings(enrichedBookings);
            } else {
                setBookings([]);
            }

        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: Booking['status']) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: Booking['status']) => {
        switch (status) {
            case 'pending': return <Clock className="w-3.5 h-3.5 mr-1.5" />;
            case 'confirmed': return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
            case 'completed': return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
            case 'cancelled': return <XCircle className="w-3.5 h-3.5 mr-1.5" />;
            default: return null;
        }
    };

    const filteredBookings = bookings.filter(booking => 
        (booking.services?.service_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.provider?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="animate-in fade-in duration-500 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Platform Bookings</h1>
                
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by service, user, or status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                                        No bookings found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 shrink-0">
                                                    <CalendarCheck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white">{booking.services?.service_name || 'Unknown Service'}</div>
                                                    <div className="text-xs text-slate-500 truncate w-32" title={booking.id}>{booking.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {booking.customer?.full_name || 'Unknown'}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {booking.customer?.phone_number || '-'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {booking.provider?.full_name || 'Unknown'}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {booking.provider?.phone_number || '-'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {new Date(booking.booking_date).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {booking.booking_time}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
