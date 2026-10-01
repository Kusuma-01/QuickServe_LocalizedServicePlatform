import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Settings, Save, Bell, ShieldCheck, Globe, CreditCard } from 'lucide-react';

const AdminSettings: React.FC<{ session: Session }> = ({ session }) => {
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Platform Settings</h1>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors shadow-md disabled:opacity-70"
                >
                    {saving ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">General Information</h2>
                            <p className="text-slate-500 text-sm">Update your platform's core identity.</p>
                        </div>
                    </div>
                    <div className="space-y-6 max-w-2xl">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Platform Name</label>
                            <input type="text" defaultValue="QuickServe Platform" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Support Email</label>
                            <input type="email" defaultValue="support@quickserve.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none dark:text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Fees & Commissions</h2>
                            <p className="text-slate-500 text-sm">Configure how much the platform takes per booking.</p>
                        </div>
                    </div>
                    <div className="space-y-6 max-w-2xl">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Platform Fee Percentage (%)</label>
                            <input type="number" defaultValue="10" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none dark:text-white" />
                            <p className="mt-2 text-xs text-slate-500">This percentage is deducted from the provider's earnings.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Provider Verification</h2>
                            <p className="text-slate-500 text-sm">Manage new provider onboarding rules.</p>
                        </div>
                    </div>
                    <div className="space-y-4 max-w-2xl">
                        <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500 border-slate-300" />
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white">Require Manual Approval</div>
                                <div className="text-xs text-slate-500">Admins must manually approve providers before their services are listed.</div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
