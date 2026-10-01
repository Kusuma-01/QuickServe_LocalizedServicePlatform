import React, { useState, useEffect } from 'react';
import AddService from './components/services/AddService';
import ProviderServices from './components/services/ProviderServices';
import UnifiedLogin from './components/auth/UnifiedLogin';
import ProviderProfile from './components/profile/ProviderProfile';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ProviderBookings from './components/services/ProviderBookings';
import ProviderEarnings from './components/services/ProviderEarnings';
import ProviderReviews from './components/services/ProviderReviews';
import ProviderLayout from './components/layouts/ProviderLayout';
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboardOverview from './components/admin/AdminDashboardOverview';
import AdminUsers from './components/admin/AdminUsers';
import AdminServices from './components/admin/AdminServices';
import AdminBookings from './components/admin/AdminBookings';
import AdminSettings from './components/admin/AdminSettings';
import LandingPage from './components/home/LandingPage';
import { supabase } from './lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

function App() {
    const [view, setView] = useState<'list' | 'add' | 'profile' | 'bookings' | 'earnings' | 'reviews' | 'dashboard' | 'users' | 'services' | 'settings'>('list');
    const [authType, setAuthType] = useState<'customer' | 'provider' | 'admin'>('customer');
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuth, setShowAuth] = useState(false);

    useEffect(() => {
        // Fetch current session right away
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for Auth changes (login, logout)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!session) {
        return showAuth ? (
            <UnifiedLogin
                initialRole={authType}
                onLoginSuccess={(role) => {
                    setAuthType(role);
                    if (role === 'admin') setView('dashboard');
                    else setView('list');
                }}
                onBack={() => setShowAuth(false)}
            />
        ) : (
            <LandingPage onGetStarted={() => setShowAuth(true)} />
        );
    }

    if (authType === 'admin') {
        return (
            <AdminLayout onNavigate={setView} currentView={view as 'dashboard' | 'users' | 'services' | 'bookings' | 'settings'} session={session}>
                {view === 'dashboard' && <AdminDashboardOverview session={session} />}
                {view === 'users' && <AdminUsers session={session} />}
                {view === 'services' && <AdminServices session={session} />}
                {view === 'bookings' && <AdminBookings session={session} />}
                {view === 'settings' && <AdminSettings session={session} />}
            </AdminLayout>
        );
    }

    if (authType === 'customer') {
        return <CustomerDashboard session={session} />;
    }

    return (
        <ProviderLayout onNavigate={setView as any} currentView={view as any} session={session}>
            {view === 'list' && <ProviderServices onNavigate={setView as any} session={session} />}
            {view === 'add' && <AddService onNavigate={setView as any} session={session} />}
            {view === 'profile' && <ProviderProfile onNavigate={setView as any} session={session} />}
            {view === 'bookings' && <ProviderBookings onNavigate={setView as any} session={session} />}
            {view === 'earnings' && <ProviderEarnings session={session} />}
            {view === 'reviews' && <ProviderReviews session={session} />}
        </ProviderLayout>
    );
}

export default App;
