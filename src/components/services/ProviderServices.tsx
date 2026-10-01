import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    LayoutDashboard, Briefcase, CalendarCheck, Wallet, Star, UserCircle,
    PlusCircle, CheckCircle2, Clock, MapPin, IndianRupee, Trash2, Edit,
    TrendingUp, Search, Filter, MoreVertical, PlayCircle, PauseCircle,
    CopyPlus, Eye, Bell, ChevronDown
} from 'lucide-react';
import { Session } from '@supabase/supabase-js';

interface ProviderServicesProps {
    onNavigate: (view: 'list' | 'add' | 'profile' | 'bookings') => void;
    session: Session;
}

const ProviderServices: React.FC<ProviderServicesProps> = ({ onNavigate, session }) => {
    const [services, setServices] = useState<any[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const providerId = session.user.id;

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch Services
            const { data: servicesData, error: servicesError } = await supabase
                .from('services')
                .select('*')
                .eq('provider_id', providerId)
                .order('created_at', { ascending: false });

            if (servicesError) throw servicesError;

            const enrichedServices = (servicesData || []).map(service => ({
                ...service,
                mockRating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
                mockReviews: Math.floor(Math.random() * 150) + 5
            }));

            setServices(enrichedServices);

            // Fetch Recent Bookings
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select('*')
                .eq('provider_id', providerId)
                .order('created_at', { ascending: false })
                .limit(4);

            if (bookingsError) throw bookingsError;

            if (bookingsData && bookingsData.length > 0) {
                // Fetch profiles for bookings
                const customerIds = [...new Set(bookingsData.map(b => b.customer_id))];
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url')
                    .in('id', customerIds);

                const profilesMap = (profilesData || []).reduce((acc: any, profile: any) => {
                    acc[profile.id] = profile; return acc;
                }, {});

                // Fetch service details for bookings
                const serviceIds = [...new Set(bookingsData.map(b => b.service_id))];
                const { data: relatedServicesData } = await supabase
                    .from('services')
                    .select('id, service_name')
                    .in('id', serviceIds);

                const relatedServicesMap = (relatedServicesData || []).reduce((acc: any, service: any) => {
                    acc[service.id] = service; return acc;
                }, {});

                const enrichedBookings = bookingsData.map(b => ({
                    ...b,
                    profiles: profilesMap[b.customer_id] || null,
                    services: relatedServicesMap[b.service_id] || null
                }));

                setRecentBookings(enrichedBookings);
            }

        } catch (err: any) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
            setDetailsLoading(false);
        }
    };

    const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('services')
                .update({ is_available: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update
            setServices(services.map(s => s.id === id ? { ...s, is_available: !currentStatus } : s));
        } catch (err) {
            console.error('Failed to toggle status:', err);
            alert('Failed to update service status.');
        }
    };

    const deleteService = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setServices(services.filter(s => s.id !== id));
        } catch (err) {
            console.error('Failed to delete service:', err);
            alert('Failed to delete service.');
        }
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = service.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' ? true :
            statusFilter === 'active' ? service.is_available : !service.is_available;
        return matchesSearch && matchesStatus;
    });

    // Computed Analytics
    const totalEarnings = 12500; // Mock calculation
    const activeBookingsCount = recentBookings.filter(b => b.status === 'accepted' || b.status === 'pending').length;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">Pending</span>;
            case 'accepted': return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Accepted</span>;
            case 'rejected': case 'cancelled': return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 border border-red-200">{status}</span>;
            case 'completed': return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800 border border-green-200">Completed</span>;
            default: return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
        }
    };

    return (
        <>
            <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full bg-gray-50 dark:bg-gray-900">

                {/* Top Header Row for mobile/global context */}
                <header className="h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Provider Dashboard</h1>
                        <p className="text-sm text-gray-500 font-medium">Welcome back, {session.user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <button
                            onClick={() => onNavigate('add')}
                            className="hidden sm:flex items-center px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            New Service
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Analytics Summary */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full transition-transform group-hover:scale-150 duration-500"></div>
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white relative z-10">{services.length}</h3>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 relative z-10 mt-1">Total Services Offered</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full transition-transform group-hover:scale-150 duration-500"></div>
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                                        <CalendarCheck className="w-6 h-6" />
                                    </div>
                                    <span className="inline-flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg"><TrendingUp className="w-3 h-3 mr-1" />+2 this week</span>
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white relative z-10">{activeBookingsCount}</h3>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 relative z-10 mt-1">Active Bookings</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full transition-transform group-hover:scale-150 duration-500"></div>
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                                        <Wallet className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="flex items-center text-3xl font-black text-gray-900 dark:text-white relative z-10">
                                    <IndianRupee className="w-6 h-6 mr-1" strokeWidth={3} />
                                    {totalEarnings.toLocaleString()}
                                </div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 relative z-10 mt-1">Total Earnings (This Month)</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-full transition-transform group-hover:scale-150 duration-500"></div>
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center">
                                        <Star className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">Lifetime</span>
                                </div>
                                <div className="flex items-baseline gap-2 relative z-10">
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">4.8</h3>
                                    <span className="text-sm font-bold text-yellow-500 flex items-center">
                                        <Star className="w-4 h-4 fill-current" />
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 relative z-10 mt-1">Average Customer Rating</p>
                            </div>
                        </section>

                        {/* Split Layout: Services (Left/Main) + Recent Bookings (Right/Sidebar) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Main Services Column */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Services</h2>

                                    {/* Search & Filter */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search services..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-48 shadow-sm transition-all text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium cursor-pointer"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="active">Active Only</option>
                                            <option value="inactive">Paused</option>
                                        </select>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : filteredServices.length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
                                        <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Services Found</h3>
                                        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                                            You haven't added any services yet, or none match your search criteria.
                                        </p>
                                        <button onClick={() => onNavigate('add')} className="inline-flex items-center px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                                            <PlusCircle className="w-5 h-5 mr-2" /> Create Service
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {filteredServices.map(service => (
                                            <div key={service.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">

                                                {/* Header / Thumbnail Area */}
                                                <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative p-5 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 backdrop-blur-sm shadow-sm border border-black/5">
                                                            {service.service_name}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold shadow-sm ${service.is_available ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                                            {service.is_available ? 'Active' : 'Paused'}
                                                        </span>
                                                    </div>

                                                    {/* Mock Rating Overlay */}
                                                    <div className="absolute bottom-3 left-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center shadow-sm border border-black/5">
                                                        <Star className="w-3.5 h-3.5 text-yellow-500 mr-1 fill-yellow-500" />
                                                        {service.mockRating} <span className="text-gray-400 font-medium ml-1">({service.mockReviews})</span>
                                                    </div>
                                                </div>

                                                {/* Body */}
                                                <div className="p-5 flex-1 flex flex-col bg-white dark:bg-gray-800 relative">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                        {service.service_name}
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                                        {service.description}
                                                    </p>

                                                    <div className="grid grid-cols-2 gap-3 mb-5 mt-auto text-sm text-gray-600 dark:text-gray-300">
                                                        <div className="flex items-center bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                                                            <IndianRupee className="w-4 h-4 mr-2 text-blue-500" />
                                                            <span className="font-bold text-gray-900 dark:text-white">{service.price}</span>
                                                        </div>
                                                        <div className="flex items-center bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                                                            <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                                                            <span className="font-semibold">{service.duration}</span>
                                                        </div>
                                                    </div>

                                                    {/* Actions Row */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                        <button
                                                            onClick={() => toggleServiceStatus(service.id, service.is_available)}
                                                            className={`flex items-center text-xs font-bold transition-colors ${service.is_available ? 'text-gray-500 hover:text-orange-500' : 'text-blue-600 hover:text-blue-700'}`}
                                                        >
                                                            {service.is_available ? (
                                                                <><PauseCircle className="w-4 h-4 mr-1.5" /> Pause</>
                                                            ) : (
                                                                <><PlayCircle className="w-4 h-4 mr-1.5" /> Activate</>
                                                            )}
                                                        </button>

                                                        <div className="flex items-center gap-1">
                                                            <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-lg transition-all" title="View Bookings">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all" title="Edit service">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => deleteService(service.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all" title="Delete service">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Recent Bookings Sidebar Widget */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-8 flex flex-col max-h-[calc(100vh-8rem)]">
                                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-t-2xl">
                                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                                            <CalendarCheck className="w-5 h-5 mr-2 text-blue-600" />
                                            Recent Bookings
                                        </h3>
                                        <button onClick={() => onNavigate('bookings')} className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-md">View All</button>
                                    </div>

                                    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
                                        {detailsLoading ? (
                                            <div className="flex justify-center py-10">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                                            </div>
                                        ) : recentBookings.length === 0 ? (
                                            <div className="text-center py-12">
                                                <CalendarCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                                <p className="text-sm font-medium text-gray-400">No recent bookings to show.</p>
                                            </div>
                                        ) : (
                                            recentBookings.map(booking => (
                                                <div key={booking.id} className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-200 transition-colors shadow-sm">
                                                    <div className="flex justify-between items-start mb-2.5">
                                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                                                            {booking.services?.service_name || 'Service'}
                                                        </h4>
                                                        {getStatusBadge(booking.status)}
                                                    </div>

                                                    <div className="flex items-center text-xs text-gray-500 mb-3 bg-gray-50 rounded-md p-1.5 border border-gray-100">
                                                        <UserCircle className="w-3.5 h-3.5 mr-1.5" />
                                                        <span className="font-medium text-gray-700">{booking.profiles?.full_name || 'Customer'}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center text-xs text-gray-500 mb-4 px-1">
                                                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{booking.booking_date}</span>
                                                        <span className="font-semibold text-gray-700">{booking.booking_time}</span>
                                                    </div>

                                                    {booking.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => onNavigate('bookings')} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2 rounded-lg transition-colors border border-gray-900">Manage</button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProviderServices;
