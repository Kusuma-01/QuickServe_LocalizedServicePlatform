import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import {
    Search, MapPin, IndianRupee, Clock, Star, UserCircle,
    CheckCircle2, XCircle, Clock4, Filter, Calendar, Bell,
    ShieldCheck, ChevronDown, SlidersHorizontal, Sparkles,
    Zap, Wrench, Droplets, Paintbrush, Snowflake, Truck, Heart, User
} from 'lucide-react';
import BookingModal from './BookingModal';
import CustomerProfile from '../profile/CustomerProfile';
import CustomerReviewModal from './CustomerReviewModal';

interface CustomerDashboardProps {
    session: Session;
}

const CATEGORIES = [
    { name: 'Cleaning', icon: Droplets },
    { name: 'Plumbing', icon: Wrench },
    { name: 'Electrician', icon: Zap },
    { name: 'Painting', icon: Paintbrush },
    { name: 'AC Repair', icon: Snowflake },
    { name: 'Moving', icon: Truck },
];

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ session }) => {
    const [view, setView] = useState<'services' | 'bookings' | 'profile'>('services');
    const [services, setServices] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Filtering and Sorting
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'topRated' | 'lowestPrice' | 'nearest'>('topRated');

    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [reviewModalBooking, setReviewModalBooking] = useState<any | null>(null);

    useEffect(() => {
        checkProfileCompletion();
        if (view === 'services') {
            fetchServices();
        } else if (view === 'bookings') {
            fetchBookings();
        }
    }, [view]);

    const checkProfileCompletion = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', session.user.id)
                .single();
            
            // If full_name is null or empty upon first load, redirect to profile
            if (!error && data && !data.full_name && view === 'services') {
                setView('profile');
            }
        } catch (err) {
            console.error('Error checking profile:', err);
        }
    };

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data: servicesData, error: servicesError } = await supabase
                .from('services')
                .select('*')
                .eq('is_available', true)
                .order('created_at', { ascending: false });

            if (servicesError) throw servicesError;

            let mergedServices = servicesData || [];

            if (mergedServices.length > 0) {
                const providerIds = [...new Set(mergedServices.map(s => s.provider_id))];
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url')
                    .in('id', providerIds);

                const profilesMap = (profilesData || []).reduce((acc: any, profile: any) => {
                    acc[profile.id] = profile;
                    return acc;
                }, {});

                // Mock ratings and reviews for aesthetic purposes
                mergedServices = mergedServices.map(service => ({
                    ...service,
                    profiles: profilesMap[service.provider_id] || null,
                    mockRating: (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1),
                    mockReviews: Math.floor(Math.random() * 300) + 15,
                    isVerified: Math.random() > 0.2 // 80% chance to be verified
                }));
            }

            setServices(mergedServices);
        } catch (err: any) {
            console.error('Error fetching services:', err);
            setError('Failed to load services.');
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data: bookingsData, error: fetchError } = await supabase
                .from('bookings')
                .select('*')
                .eq('customer_id', session.user.id)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            let mergedBookings = bookingsData || [];

            if (mergedBookings.length > 0) {
                const serviceIds = [...new Set(mergedBookings.map(b => b.service_id))];
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('id, service_name, price')
                    .in('id', serviceIds);

                const servicesMap = (servicesData || []).reduce((acc: any, service: any) => {
                    acc[service.id] = service;
                    return acc;
                }, {});

                const providerIds = [...new Set(mergedBookings.map(b => b.provider_id))];
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', providerIds);

                const profilesMap = (profilesData || []).reduce((acc: any, profile: any) => {
                    acc[profile.id] = profile;
                    return acc;
                }, {});

                // Fetch existing reviews to know what hasn't been reviewed
                const { data: reviewsData } = await supabase
                    .from('reviews')
                    .select('booking_id')
                    .eq('customer_id', session.user.id);

                const reviewedBookingIds = new Set((reviewsData || []).map(r => r.booking_id));

                mergedBookings = mergedBookings.map(booking => ({
                    ...booking,
                    services: servicesMap[booking.service_id] || null,
                    profiles: profilesMap[booking.provider_id] || null,
                    hasReview: reviewedBookingIds.has(booking.id)
                }));

                const hasUpdates = mergedBookings.some((b: any) => ['accepted', 'rejected', 'completed'].includes(b.status));
                setHasUnreadNotification(hasUpdates);
            }

            setBookings(mergedBookings);
        } catch (err: any) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load your bookings.');
        } finally {
            setLoading(false);
        }
    };

    const markBookingCompleted = async (bookingId: number) => {
        try {
            const { error: updateError } = await supabase
                .from('bookings')
                .update({ status: 'completed' })
                .eq('id', bookingId);

            if (updateError) throw updateError;

            // Optimistically update
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'completed' } : b));
        } catch (err) {
            console.error('Failed to mark as completed:', err);
            alert('Failed to confirm completion. Please try again.');
        }
    };

    let filteredServices = services.filter(service => {
        const matchesSearch = service.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = activeCategory ? service.service_name.toLowerCase().includes(activeCategory.toLowerCase()) : true;

        return matchesSearch && matchesCategory;
    });

    // Apply Sorting
    filteredServices = [...filteredServices].sort((a, b) => {
        if (sortBy === 'lowestPrice') return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === 'topRated') return parseFloat(b.mockRating) - parseFloat(a.mockRating);
        return 0; // nearest mock
    });

    const popularServices = filteredServices.slice(0, 4);
    const recommendedServices = filteredServices.slice(4, 8);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock4 className="w-3 h-3 mr-1" /> Pending</span>;
            case 'accepted': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Accepted</span>;
            case 'rejected': case 'cancelled': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> {status}</span>;
            case 'completed': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</span>;
            default: return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const renderServiceCard = (service: any) => (
        <div key={service.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group transform hover:-translate-y-2 relative">
            <div className="absolute top-4 right-4 z-10">
                <button className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                    <Heart className="w-5 h-5" />
                </button>
            </div>
            <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 relative flex items-center justify-center p-6 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay group-hover:bg-blue-600/10 transition-colors"></div>
                <div className="text-center z-10 transform group-hover:scale-110 transition-transform duration-500">
                    <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-3xl shadow-md mx-auto flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 rotate-3 group-hover:rotate-6 transition-transform">
                        <Sparkles className="w-10 h-10" />
                    </div>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col relative">
                {/* Profile Badge Overlapping */}
                <div className="absolute -top-8 left-6 flex items-end">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-1 border border-gray-100 dark:border-gray-700">
                        <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl relative">
                            {service.profiles?.full_name?.charAt(0) || 'P'}
                            {service.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-0.5">
                                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">{service.service_name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{service.profiles?.full_name || 'Provider'}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                            <span className="font-bold text-gray-900 dark:text-white">{service.mockRating}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">({service.mockReviews} reviews)</p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-800/50">
                        Available Today
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <MapPin className="w-3 h-3 mr-1" /> {service.location}
                    </span>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Starting at</p>
                        <div className="flex items-center font-bold text-2xl text-gray-900 dark:text-white">
                            <IndianRupee className="w-5 h-5" />{service.price}
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedService(service)}
                        className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-md flex items-center"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 font-sans flex flex-col">
            {/* Top Navigation */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform rotate-3">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                                Quick<span className="text-indigo-600">Serve</span>
                            </h1>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => setView('services')}
                                className={`text-sm font-bold transition-all ${view === 'services' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                            >
                                Explore Services
                            </button>
                            <button
                                onClick={() => setView('bookings')}
                                className={`text-sm font-bold transition-all flex items-center ${view === 'bookings' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                            >
                                My Bookings
                                {bookings.length > 0 && <span className="ml-2 bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs">{bookings.length}</span>}
                            </button>
                            <button
                                onClick={() => setView('profile')}
                                className={`text-sm font-bold transition-all flex items-center ${view === 'profile' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                            >
                                <User className="w-4 h-4 mr-1.5" />
                                My Profile
                            </button>
                        </nav>
                        <div className="flex items-center gap-4 relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                <Bell className="w-6 h-6" />
                                {hasUnreadNotification && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute top-full right-16 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
                                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                                        <button
                                            onClick={() => setHasUnreadNotification(false)}
                                            className="text-xs text-indigo-600 font-semibold hover:underline"
                                        >
                                            Mark all as read
                                        </button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {bookings.filter(b => ['accepted', 'rejected', 'completed'].includes(b.status)).length === 0 ? (
                                            <div className="p-6 text-center text-gray-500 text-sm">
                                                No recent notifications.
                                            </div>
                                        ) : (
                                            bookings.filter(b => ['accepted', 'rejected', 'completed'].includes(b.status)).map(booking => (
                                                <div
                                                    key={`notif-${booking.id}`}
                                                    className={`p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${booking.status === 'accepted' ? 'border-l-4 border-l-green-500' : booking.status === 'completed' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-red-500'}`}
                                                    onClick={() => {
                                                        setView('bookings');
                                                        setShowNotifications(false);
                                                    }}
                                                >
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                        Booking Update
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                        {booking.status === 'completed'
                                                            ? <>Your booking for <span className="font-bold text-gray-700 dark:text-gray-300">{booking.services?.service_name}</span> was marked as <span className="font-bold text-blue-600">completed</span> by the provider. Please verify the work.</>
                                                            : <>Your booking for <span className="font-bold text-gray-700 dark:text-gray-300">{booking.services?.service_name || 'Service'}</span> with <span className="font-semibold">{booking.profiles?.full_name || 'Provider'}</span> was <span className={`font-bold ${booking.status === 'accepted' ? 'text-green-600' : 'text-red-500'}`}>{booking.status}</span>.</>}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                            <button
                                onClick={async () => await supabase.auth.signOut()}
                                className="flex items-center gap-2 pl-2"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm">
                                    <UserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {view === 'services' && (
                    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Hero Section */}
                        <div className="relative bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="absolute inset-0">
                                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop" alt="Home Services" className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                            </div>

                            <div className="relative z-10 p-10 md:p-16 text-center max-w-4xl mx-auto">
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 text-sm font-semibold mb-6">
                                    <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                                    Premium Home Services
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                                    Book trusted experts <br /> for your home.
                                </h2>

                                <div className="relative max-w-2xl mx-auto mt-10">
                                    <div className="flex items-center bg-white p-2 rounded-2xl shadow-xl">
                                        <div className="flex-1 flex items-center pl-4 border-r border-gray-100">
                                            <Search className="w-6 h-6 text-indigo-500" />
                                            <input
                                                type="text"
                                                placeholder="Search for cleaning, plumbing, etc."
                                                className="w-full px-4 py-3 text-lg text-gray-900 focus:outline-none bg-transparent placeholder-gray-400 font-medium"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onFocus={() => setShowSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            />
                                        </div>
                                        <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-indigo-600 transition-colors hidden sm:block ml-2">
                                            Search
                                        </button>
                                    </div>

                                    {showSuggestions && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 text-left">
                                            <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Popular Searches</div>
                                            {['Deep Cleaning', 'AC Service', 'Plumbing Repair', 'Sofa Cleaning'].map((suggestion, i) => (
                                                <button key={i} className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl flex items-center gap-3 text-gray-700 font-medium transition-colors" onClick={() => setSearchQuery(suggestion)}>
                                                    <Search className="w-4 h-4 text-gray-400" />
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Categories */}
                        <div className="pt-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h3>
                            </div>
                            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-4">
                                {CATEGORIES.map((cat, i) => {
                                    const Icon = cat.icon;
                                    const isActive = activeCategory === cat.name;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setActiveCategory(isActive ? null : cat.name)}
                                            className={`flex-shrink-0 flex flex-col items-center justify-center p-4 w-32 rounded-3xl transition-all duration-300 border-2 ${isActive ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-700 shadow-md transform -translate-y-1' : 'bg-white border-transparent hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <span className={`text-sm font-semibold text-center ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>{cat.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 z-30">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filter
                                </button>
                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                                <span className="text-sm text-gray-500 font-medium">{filteredServices.length} services found</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">Sort by:</span>
                                <select
                                    className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium cursor-pointer"
                                    value={sortBy}
                                    onChange={(e: any) => setSortBy(e.target.value)}
                                >
                                    <option value="topRated">Top Rated</option>
                                    <option value="lowestPrice">Lowest Price</option>
                                    <option value="nearest">Nearest to You</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : filteredServices.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No services found</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Try adjusting your search or category filters.</p>
                                <button onClick={() => { setSearchQuery(''); setActiveCategory(null); }} className="mt-6 text-indigo-600 font-bold hover:underline">Clear all filters</button>
                            </div>
                        ) : (
                            <>
                                {/* Popular Services */}
                                {popularServices.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                Popular Near You
                                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Hot</span>
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                            {popularServices.map(renderServiceCard)}
                                        </div>
                                    </div>
                                )}

                                {/* Recommended Services */}
                                {recommendedServices.length > 0 && (
                                    <div className="pt-8 border-t border-gray-200 dark:border-gray-800 mt-12">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                Recommended For You
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                            {recommendedServices.map(renderServiceCard)}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {view === 'bookings' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">My Bookings</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Manage your upcoming and past service requests.</p>
                            </div>
                            <div className="hidden md:block w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center transform rotate-12 relative z-10">
                                <Calendar className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-16 text-center shadow-sm">
                                <div className="w-32 h-32 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No bookings yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                                    You haven't booked any services yet. Explore our marketplace to find trusted experts for your needs.
                                </p>
                                <button
                                    onClick={() => setView('services')}
                                    className="px-8 py-4 font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-1"
                                >
                                    Explore Services
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-lg group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        {booking.services?.service_name || 'Service Unavailable'}
                                                    </h3>
                                                    {getStatusBadge(booking.status)}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mr-3">
                                                            <UserCircle className="w-5 h-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-medium mb-0.5">Provider</p>
                                                            <p className="font-bold">{booking.profiles?.full_name || 'Unknown'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3">
                                                            <Calendar className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-medium mb-0.5">Date & Time</p>
                                                            <p className="font-bold">{booking.booking_date} at {booking.booking_time}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mr-3">
                                                            <IndianRupee className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 font-medium mb-0.5">Price</p>
                                                            <p className="font-bold">{booking.services?.price}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {booking.notes && (
                                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-3">
                                                        <div className="mt-0.5 w-2 h-2 rounded-full bg-gray-300"></div>
                                                        <p className="text-gray-600 dark:text-gray-400 italic text-sm leading-relaxed">"{booking.notes}"</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="md:w-48 flex flex-col justify-center">
                                                {booking.status === 'accepted' && (
                                                    <button
                                                        onClick={() => markBookingCompleted(booking.id)}
                                                        className="w-full py-3 mb-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center transform hover:-translate-y-0.5"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5 mr-1.5" /> Confirm Done
                                                    </button>
                                                )}
                                                <button className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold rounded-xl transition-colors">
                                                    View Details
                                                </button>
                                                {booking.status === 'completed' && !booking.hasReview && (
                                                    <button 
                                                        onClick={() => setReviewModalBooking(booking)}
                                                        className="w-full justify-center items-center flex py-3 mt-3 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-900/20 font-bold rounded-xl transition-colors"
                                                    >
                                                        <Star className="w-5 h-5 mr-1.5 fill-yellow-600" />
                                                        Leave Review
                                                    </button>
                                                )}
                                                {booking.status === 'completed' && booking.hasReview && (
                                                    <button className="w-full py-3 mt-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold rounded-xl transition-colors">
                                                        Rebook
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {view === 'profile' && (
                    <CustomerProfile 
                        session={session} 
                        onUpdateComplete={() => setView('services')}
                    />
                )}
            </main>

            {/* Booking Modal */}
            {selectedService && (
                <BookingModal
                    service={selectedService}
                    session={session}
                    onClose={() => setSelectedService(null)}
                />
            )}

            {/* Review Modal */}
            {reviewModalBooking && (
                <CustomerReviewModal 
                    booking={reviewModalBooking}
                    session={session}
                    onClose={() => setReviewModalBooking(null)}
                    onReviewSubmitted={(review) => {
                        setBookings(bookings.map(b => b.id === review.booking_id ? { ...b, hasReview: true } : b));
                        setReviewModalBooking(null);
                    }}
                />
            )}
        </div>
    );
};

export default CustomerDashboard;
