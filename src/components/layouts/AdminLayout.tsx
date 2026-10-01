import React from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { 
    LayoutDashboard, 
    Users, 
    Briefcase, 
    CalendarCheck, 
    Settings,
    LogOut,
    ShieldAlert,
    Menu,
    X
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    currentView: 'dashboard' | 'users' | 'services' | 'bookings' | 'settings';
    onNavigate: (view: 'dashboard' | 'users' | 'services' | 'bookings' | 'settings') => void;
    session: Session;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentView, onNavigate, session }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const navigation = [
        { name: 'Overview', view: 'dashboard', icon: LayoutDashboard },
        { name: 'Manage Users', view: 'users', icon: Users },
        { name: 'Services', view: 'services', icon: Briefcase },
        { name: 'Bookings', view: 'bookings', icon: CalendarCheck },
        { name: 'Settings', view: 'settings', icon: Settings },
    ] as const;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 font-sans overflow-hidden">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-xl bg-slate-900 text-white shadow-lg"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-72 bg-slate-900 text-slate-300
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col border-r border-slate-800
            `}>
                <div className="p-8 flex items-center justify-center border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center transform -rotate-6 shadow-lg shadow-rose-900/50">
                            <ShieldAlert className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">
                            Admin<span className="text-rose-500">Panel</span>
                        </h1>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-slate-800/50 rounded-2xl p-4 flex items-center gap-4 mb-8 border border-slate-700/50">
                        <div className="w-12 h-12 bg-gradient-to-tr from-slate-700 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                            {session.user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-0.5">Administrator</p>
                            <p className="text-sm font-medium text-white truncate">{session.user.email}</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.view;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        onNavigate(item.view);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${
                                        isActive 
                                            ? 'bg-rose-500 text-white shadow-md shadow-rose-900/20' 
                                            : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-400'}`} />
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-xl font-medium transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Secure Sign Out
                    </button>
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500 font-medium tracking-wide border border-slate-800 rounded-full py-2 px-4 inline-block">QuickServe Platform v1.0</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900 relative">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50 dark:bg-rose-900/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                
                <div className="relative z-10 w-full h-full p-4 lg:p-8">
                    {children}
                </div>
            </main>

            {/* Mobile backdrop */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
