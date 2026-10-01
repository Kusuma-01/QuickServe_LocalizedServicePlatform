import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { IndianRupee, TrendingUp, Calendar as CalendarIcon, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ProviderEarningsProps {
    session: Session;
}

const ProviderEarnings: React.FC<ProviderEarningsProps> = ({ session }) => {
    const [loading, setLoading] = useState(true);
    const [earnings, setEarnings] = useState<any[]>([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);
    const [completedJobs, setCompletedJobs] = useState(0);
    
    useEffect(() => {
        fetchEarningsData();
    }, [session.user.id]);

    const fetchEarningsData = async () => {
        try {
            setLoading(true);
            
            // Fetch completed bookings for this provider
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select('*')
                .eq('provider_id', session.user.id)
                .eq('status', 'completed')
                .order('created_at', { ascending: false });

            if (bookingsError) throw bookingsError;

            if (bookingsData && bookingsData.length > 0) {
                // Fetch service details to get prices
                const serviceIds = [...new Set(bookingsData.map(b => b.service_id))];
                const { data: servicesData } = await supabase
                    .from('services')
                    .select('id, service_name, price')
                    .in('id', serviceIds);

                const servicesMap = (servicesData || []).reduce((acc: any, service: any) => {
                    acc[service.id] = service;
                    return acc;
                }, {});

                let total = 0;
                let monthly = 0;
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();

                const enrichedEarnings = bookingsData.map(booking => {
                    const svc = servicesMap[booking.service_id];
                    const price = svc ? parseFloat(svc.price) : 0;
                    
                    total += price;
                    
                    const bookingDate = new Date(booking.created_at);
                    if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
                        monthly += price;
                    }

                    return {
                        ...booking,
                        service: svc,
                        amount: price
                    };
                });

                setEarnings(enrichedEarnings);
                setTotalEarnings(total);
                setMonthlyEarnings(monthly);
                setCompletedJobs(enrichedEarnings.length);
            } else {
                setEarnings([]);
                setTotalEarnings(0);
                setMonthlyEarnings(0);
                setCompletedJobs(0);
            }
        } catch (err) {
            console.error('Error fetching earnings:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Earnings Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">Track your revenue and completed jobs.</p>
                </div>
                <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2.5 px-5 rounded-xl flex items-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    This Month
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-indigo-100 transition-colors"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            <ArrowUpRight className="w-4 h-4 mr-1" /> +12%
                        </span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Total Earnings</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white flex items-center">
                            <IndianRupee className="w-7 h-7 mr-1" />
                            {totalEarnings.toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-green-100 transition-colors"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">This Month</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white flex items-center">
                            <IndianRupee className="w-7 h-7 mr-1" />
                            {monthlyEarnings.toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-100 transition-colors"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Completed Jobs</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white flex items-center">
                            {completedJobs}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">Recent Transactions</h3>
                </div>
                
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : earnings.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <p className="text-gray-500 font-medium">No earnings recorded yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {earnings.map((item) => (
                            <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                                        <ArrowDownRight className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{item.service?.service_name || 'Service Payment'}</h4>
                                        <p className="text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-black text-lg text-gray-900 dark:text-white flex items-center justify-end">
                                        +<IndianRupee className="w-4 h-4 mx-0.5" />{item.amount.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                                        Completed
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderEarnings;
