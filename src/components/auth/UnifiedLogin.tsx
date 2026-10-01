import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { 
    Lock, 
    Mail, 
    ArrowRight, 
    CheckCircle2, 
    UserCircle, 
    User, 
    ShieldAlert, 
    Briefcase,
    Eye,
    EyeOff,
    Home
} from 'lucide-react';

type Role = 'customer' | 'provider' | 'admin';

interface UnifiedLoginProps {
    initialRole?: Role;
    onLoginSuccess: (role: Role) => void;
}

const UnifiedLogin: React.FC<UnifiedLoginProps> = ({ initialRole = 'customer', onLoginSuccess }) => {
    const [activeTab, setActiveTab] = useState<Role>(initialRole);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleTabChange = (role: Role) => {
        setActiveTab(role);
        // Reset state on tab change
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setError(null);
        setMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (activeTab === 'admin') {
                // Admin Flow (Login Only)
                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (authError) throw authError;

                if (authData.user) {
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', authData.user.id)
                        .single();

                    if (profileError) throw profileError;

                    if (profileData && profileData.role === 'admin') {
                        onLoginSuccess('admin');
                    } else {
                        await supabase.auth.signOut();
                        setError('Access Denied. You do not have administrator privileges.');
                    }
                }
            } else {
                // Customer / Provider Flow
                if (isSignUp) {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                role: activeTab 
                            }
                        }
                    });
                    if (error) throw error;
                    if (data.user && data.session) {
                        setMessage('Account created successfully! Logging you in...');
                        setTimeout(() => onLoginSuccess(activeTab), 1000);
                    } else {
                        setMessage('Please check your email to confirm your account.');
                    }
                } else {
                    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    if (authError) throw authError;
                    
                    if (authData.user) {
                        onLoginSuccess(activeTab);
                    }
                }
            }
        } catch (err: any) {
            console.error('Authentication Error:', err);
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex">
            {/* Left Side: Branding / Illustration */}
            <div className="hidden lg:flex w-1/2 bg-blue-600 dark:bg-blue-800 p-12 text-white flex-col justify-between relative overflow-hidden">
                {/* Abstract Background Decoration */}
                <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-blue-500/20 to-purple-600/20 mix-blend-overlay pointer-events-none rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                        Q
                    </div>
                    <span className="text-2xl font-black tracking-tight">QuickServe</span>
                </div>

                <div className="relative z-10 mt-auto mb-auto">
                    <h1 className="text-5xl font-black leading-tight mb-6">
                        Book trusted local<br />services instantly.
                    </h1>
                    <p className="text-blue-100 text-lg max-w-md font-medium">
                        Join thousands of users and skilled professionals connecting on our platform every day.
                    </p>
                    
                    <div className="mt-12 flex items-center gap-6 text-sm font-medium text-blue-100">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-300" /> Vetted Professionals
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-300" /> Secure Payments
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Mobile Header (Hidden on Desktop) */}
                    <div className="lg:hidden text-center mb-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-xl font-bold text-2xl mb-4">
                            Q
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">QuickServe</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Book trusted local services instantly</p>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {activeTab === 'admin' 
                                ? 'Admin Portal' 
                                : isSignUp 
                                    ? `Join as a ${activeTab === 'provider' ? 'Provider' : 'Customer'}` 
                                    : 'Welcome back'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {activeTab === 'admin' && 'Authorized personnel only.'}
                            {activeTab !== 'admin' && (isSignUp ? 'Please fill in your details to create an account.' : 'Please enter your details to sign in.')}
                        </p>
                    </div>

                    {/* Role Tabs */}
                    <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex justify-between items-center shadow-inner">
                        <button
                            onClick={() => handleTabChange('customer')}
                            className={`flex-1 flex items-center justify-center py-2.5 px-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                activeTab === 'customer' 
                                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <User className="w-4 h-4 mr-2" />
                            Customer
                        </button>
                        <button
                            onClick={() => handleTabChange('provider')}
                            className={`flex-1 flex items-center justify-center py-2.5 px-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                activeTab === 'provider' 
                                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <Briefcase className="w-4 h-4 mr-2" />
                            Provider
                        </button>
                        <button
                            onClick={() => handleTabChange('admin')}
                            className={`flex-1 flex items-center justify-center py-2.5 px-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                activeTab === 'admin' 
                                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            Admin
                        </button>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm rounded-xl font-medium animate-in slide-in-from-top-2 flex items-start">
                            <ShieldAlert className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl font-medium animate-in slide-in-from-top-2 flex items-center">
                            <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                            {message}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none peer placeholder-transparent"
                                placeholder="Email Address"
                            />
                            <label htmlFor="email" className="absolute left-12 -top-2.5 bg-white dark:bg-slate-900 px-1 text-xs font-semibold text-slate-500 dark:text-slate-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-blue-500">
                                Email Address
                            </label>
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-12 pr-12 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none peer placeholder-transparent"
                                placeholder="Password"
                                minLength={6}
                            />
                            <label htmlFor="password" className="absolute left-12 -top-2.5 bg-white dark:bg-slate-900 px-1 text-xs font-semibold text-slate-500 dark:text-slate-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-blue-500">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Extra Actions */}
                        <div className="flex items-center justify-between">
                            {activeTab !== 'admin' && (
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                                        Remember me
                                    </label>
                                </div>
                            )}

                            {!isSignUp && (
                                <div className="text-sm ml-auto">
                                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-2xl shadow-md text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5
                                ${activeTab === 'customer' 
                                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-blue-500/20' 
                                    : activeTab === 'provider'
                                        ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-emerald-500/20'
                                        : 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 shadow-rose-500/20'}
                            `}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    {isSignUp ? 'Create Account' : activeTab === 'admin' ? 'Secure Login' : 'Sign In'}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Social Auth (Placeholders) */}
                    {activeTab !== 'admin' && (
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 font-medium">Or continue with</span>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <button type="button" className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                                <button type="button" className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    OTP Login
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Toggle between Sign up and Login */}
                    {activeTab !== 'admin' && (
                        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className={`font-bold hover:underline transition-colors ${
                                    activeTab === 'provider' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                                }`}
                            >
                                {isSignUp ? 'Sign in instead' : 'Sign up now'}
                            </button>
                        </p>
                    )}

                    {/* Provider subtext overlay / explicit CTA */}
                    {activeTab === 'provider' && !isSignUp && (
                        <div className="mt-6 bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm text-center font-medium border border-emerald-100 dark:border-emerald-500/20 flex flex-col items-center">
                            <Briefcase className="w-5 h-5 mb-2 opacity-70" />
                            <span>New provider? Register your services and start earning.</span>
                            <button 
                                onClick={() => setIsSignUp(true)}
                                className="mt-2 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnifiedLogin;
