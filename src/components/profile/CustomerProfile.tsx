import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import {
    UserCircle,
    Save,
    CheckCircle2,
    Image as ImageIcon,
    Phone,
    User
} from 'lucide-react';

interface CustomerProfileProps {
    session: Session;
    onUpdateComplete?: () => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ session, onUpdateComplete }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [profile, setProfile] = useState({
        full_name: '',
        phone_number: '',
        avatar_url: ''
    });

    useEffect(() => {
        getProfile();
    }, [session]);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { user } = session;

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, phone_number, avatar_url`)
                .eq('id', user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    phone_number: data.phone_number || '',
                    avatar_url: data.avatar_url || ''
                });
            }
        } catch (error: any) {
            console.error('Error loading user data!', error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            const { user } = session;

            const updates = {
                id: user.id,
                full_name: profile.full_name,
                phone_number: profile.phone_number,
                avatar_url: profile.avatar_url,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                throw error;
            }
            setSuccess(true);
            
            if (onUpdateComplete) {
                setTimeout(onUpdateComplete, 1500);
            } else {
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error: any) {
            setError(error.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto w-full h-full animate-in fade-in duration-500">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Customer Profile</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Update your personal details so service providers can reach you.</p>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center text-green-700 shadow-sm animate-in fade-in slide-in-from-top-4">
                        <CheckCircle2 className="w-5 h-5 mr-3 text-green-500 shrink-0" />
                        <p className="font-bold">Profile updated successfully!</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center text-red-700 shadow-sm">
                        <p className="font-bold">{error}</p>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                    <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-6 relative z-10">
                        <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-lg shrink-0 group">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                    <User className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{profile.full_name || 'Your Name'}</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium inline-flex items-center justify-center md:justify-start">
                                {session.user.email}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={updateProfile} className="p-8 space-y-8 relative z-10">
                        
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="full_name"
                                        required
                                        value={profile.full_name}
                                        onChange={handleChange}
                                        placeholder="e.g. John Doe"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-indigo-500 transition-colors" />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    required
                                    value={profile.phone_number}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Profile Photo URL</label>
                            <div className="relative group">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-indigo-500 transition-colors" />
                                <input
                                    type="url"
                                    name="avatar_url"
                                    value={profile.avatar_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/your-photo.jpg"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white font-medium"
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium ml-2">Paste a direct link to a hosted image for your avatar.</p>
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center px-10 py-4 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-md hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving Profile...
                                    </span>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Save Profile Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
