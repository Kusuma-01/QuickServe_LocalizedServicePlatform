import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    LayoutDashboard, Briefcase, CalendarCheck, Wallet, Star, UserCircle
} from 'lucide-react';
import { Session } from '@supabase/supabase-js';

interface ProviderLayoutProps {
    children: React.ReactNode;
    onNavigate: (view: 'list' | 'add' | 'profile' | 'bookings' | 'earnings' | 'reviews') => void;
    currentView: 'list' | 'add' | 'profile' | 'bookings' | 'earnings' | 'reviews';
    session: Session;
}

const ProviderLayout: React.FC<ProviderLayoutProps> = ({ children, onNavigate, currentView, session }) => {
    const [activeBookingsCount, setActiveBookingsCount] = useState(0);

    useEffect(() => {
        fetchActiveBookingsCount();
    }, [session.user.id]);

    const fetchActiveBookingsCount = async () => {
        try {
            const { count, error } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('provider_id', session.user.id)
                .in('status', ['pending', 'accepted']);

            if (!error && count !== null) {
                setActiveBookingsCount(count);
            }
        } catch (err) {
            console.error('Error fetching active bookings count:', err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col h-full z-20 shadow-sm relative">
                <div className="p-6 h-20 flex items-center border-b border-gray-100 dark:border-gray-700 shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">Q</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">QuickServe</h2>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Provider Portal</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                    {/* Dashboard Tab */}
                    <button
                        onClick={() => onNavigate('list')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${currentView === 'list' ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-bold border border-blue-100 dark:border-blue-800/50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium border border-transparent'}`}
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </button>

                    <button
                        onClick={() => onNavigate('add')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${currentView === 'add' ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-bold border border-blue-100 dark:border-blue-800/50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium border border-transparent'}`}
                    >
                        <Briefcase className="w-5 h-5 mr-3" />
                        Manage Services
                    </button>

                    <button
                        onClick={() => onNavigate('bookings')}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${currentView === 'bookings' ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-bold border border-blue-100 dark:border-blue-800/50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium border border-transparent'}`}
                    >
                        <CalendarCheck className="w-5 h-5 mr-3" />
                        Bookings
                        {activeBookingsCount > 0 && (
                            <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{activeBookingsCount}</span>
                        )}
                    </button>

                    <button 
                        onClick={() => onNavigate('earnings')}
                        className={`w-full justify-start flex items-center px-4 py-3 rounded-xl transition-colors border ${currentView === 'earnings' ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-bold border-blue-100 dark:border-blue-800/50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium border-transparent'}`}
                    >
                        <Wallet className="w-5 h-5 mr-3" />
                        Earnings
                    </button>

                    <button 
                        onClick={() => onNavigate('reviews')}
                        className={`w-full justify-start flex items-center px-4 py-3 rounded-xl transition-colors border ${currentView === 'reviews' ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-bold border-blue-100 dark:border-blue-800/50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium border-transparent'}`}
                    >
                        <Star className="w-5 h-5 mr-3" />
                        Reviews
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
                    <button
                        onClick={() => onNavigate('profile')}
                        className={`w-full flex items-center px-4 py-3 mb-2 rounded-xl transition-all ${currentView === 'profile' ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-bold border border-blue-100 dark:border-blue-800/50' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium border border-transparent'}`}
                    >
                        <UserCircle className={`w-5 h-5 mr-3 ${currentView === 'profile' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                        Profile Settings
                    </button>
                    <button
                        onClick={async () => await supabase.auth.signOut()}
                        className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-xl transition-colors border border-transparent"
                    >
                        <UserCircle className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 h-full overflow-hidden flex flex-col relative z-10 w-full">
                {children}
            </div>
        </div>
    );
};

export default ProviderLayout;
