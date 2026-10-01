import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';

const AdminDashboardOverview: React.FC<{ session: Session }> = ({ session }) => {
    const [stats, setStats] = useState({
        users: 0,
        services: 0,
        bookings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch Total Users (all profiles)
                const { count: userCount, error: userError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // Fetch Active Services
                const { count: serviceCount, error: serviceError } = await supabase
                    .from('services')
                    .select('*', { count: 'exact', head: true });

                // Fetch Total Bookings
                const { count: bookingCount, error: bookingError } = await supabase
                    .from('bookings')
                    .select('*', { count: 'exact', head: true });
                
                if (userError) console.error("Error fetching users:", userError);
                if (serviceError) console.error("Error fetching services:", serviceError);
                if (bookingError) console.error("Error fetching bookings:", bookingError);

                setStats({
                    users: userCount || 0,
                    services: serviceCount || 0,
                    bookings: bookingCount || 0
                });
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);
    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Platform Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Users</h3>
                        <div className="flex items-center">
                            {loading ? (
                                <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
                            ) : (
                                <p className="text-4xl font-black text-rose-500">{stats.users}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Active Services</h3>
                        <div className="flex items-center">
                            {loading ? (
                                <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
                            ) : (
                                <p className="text-4xl font-black text-indigo-500">{stats.services}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Bookings</h3>
                        <div className="flex items-center">
                            {loading ? (
                                <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
                            ) : (
                                <p className="text-4xl font-black text-emerald-500">{stats.bookings}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;
