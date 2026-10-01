import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    LayoutDashboard,
    Briefcase,
    CalendarCheck,
    Wallet,
    Star,
    UserCircle,
    PlusCircle,
    CheckCircle2,
    Clock,
    MapPin,
    IndianRupee,
    AlignLeft,
    Image as ImageIcon,
    UploadCloud,
    ArrowLeft,
    Zap,
    AlertCircle
} from 'lucide-react';

import { Session } from '@supabase/supabase-js';

interface AddServiceProps {
    onNavigate: (view: 'list' | 'add' | 'profile' | 'bookings') => void;
    session: Session;
}

const AddService: React.FC<AddServiceProps> = ({ onNavigate, session }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        service_name: '',
        description: '',
        price: '',
        available_date: '',
        available_time: '',
        duration: '',
        location: '',
        is_available: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Using actual provider ID from the authenticated session
            const providerId = session.user.id;

            const serviceData = {
                ...formData,
                price: parseFloat(formData.price),
                provider_id: providerId
            };

            const { data, error: submitError } = await supabase
                .from('services')
                .insert([serviceData])
                .select();

            if (submitError) throw submitError;

            setSuccess(true);
            // Reset form
            setFormData({
                service_name: '',
                description: '',
                price: '',
                available_date: '',
                available_time: '',
                duration: '',
                location: '',
                is_available: true,
            });

            // Hide success message after 2 seconds and navigate back
            setTimeout(() => {
                setSuccess(false);
                onNavigate('list');
            }, 2000);

        } catch (err: any) {
            console.error('Error adding service:', err);
            setError(err.message || 'Failed to add service. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Category Options with Icons
    const CATEGORIES = [
        "Plumbing", "Cleaning", "Washing", "Electrical", "Painting", "Appliance Repair", "Moving", "Other"
    ];

    return (
        <div className="flex-1 overflow-y-auto w-full h-full bg-gray-50 dark:bg-gray-900 relative">
            {/* Header Context */}
            <header className="h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center px-8 sticky top-0 z-10 w-full shadow-sm">
                <button
                    onClick={() => onNavigate('list')}
                    className="p-2 mr-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex items-center"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Add New Service
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">Creation Mode</span>
                    </h1>
                </div>
            </header>

            <div className="p-8 max-w-5xl mx-auto pb-24">

                {/* Alerts Area */}
                <div className="space-y-4 mb-8">
                    {success && (
                        <div className="p-4 bg-green-50 border border-green-200 shadow-sm rounded-xl flex items-center text-green-700 animate-in fade-in slide-in-from-top-4">
                            <CheckCircle2 className="w-6 h-6 mr-3 text-green-500" />
                            <div>
                                <h4 className="font-bold">Service Published!</h4>
                                <p className="text-sm font-medium mt-0.5 text-green-600">Your service is now live and bookable by customers.</p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 shadow-sm rounded-xl flex items-start text-red-700">
                            <AlertCircle className="w-6 h-6 mr-3 text-red-500 mt-0.5" />
                            <div>
                                <h4 className="font-bold">Hold on, there was an issue</h4>
                                <p className="text-sm font-medium mt-0.5 text-red-600">{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Interactive Layout for Form */}
                    <div className="max-w-4xl mx-auto">

                        {/* Main Input Column */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                            <div className="p-8 space-y-8">

                                {/* Core Details Section */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 pb-3 flex items-center justify-between">
                                        1. Core Details
                                        <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Required</span>
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mt-1">Service Category <span className="text-red-500">*</span></label>
                                            <div className="relative group">
                                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                                                <select
                                                    name="service_name"
                                                    value={formData.service_name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all dark:text-white appearance-none font-medium text-gray-900 shadow-sm shadow-black/5"
                                                >
                                                    <option value="" disabled>Select a category</option>
                                                    {CATEGORIES.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mt-1">Price (₹) <span className="text-red-500">*</span></label>
                                            <div className="relative group">
                                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    placeholder="e.g. 1500"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white outline-none transition-all dark:text-white font-medium text-gray-900 shadow-sm shadow-black/5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mt-1">Detailed Description <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <AlignLeft className="absolute left-4 top-4 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                                rows={4}
                                                placeholder="Describe the entire service package, materials used, guarantees, etc..."
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none dark:text-white font-medium text-gray-900 shadow-sm shadow-black/5 leading-relaxed"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Logistics Section */}
                                <div className="space-y-6 pt-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 pb-3">2. Logistics & Timing</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mt-1">Location <span className="text-red-500">*</span></label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g. Downtown"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all dark:text-white font-medium text-gray-900 shadow-sm shadow-black/5"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mt-1">Duration <span className="text-red-500">*</span></label>
                                            <div className="relative group">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                                                <select
                                                    name="duration"
                                                    value={formData.duration}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all dark:text-white appearance-none font-medium text-gray-900 shadow-sm shadow-black/5"
                                                >
                                                    <option value="" disabled>Estimated time</option>
                                                    <option value="30 mins">30 mins</option>
                                                    <option value="1 hour">1 hour</option>
                                                    <option value="2 hours">2 hours</option>
                                                    <option value="Half Day">Half Day</option>
                                                    <option value="Full Day">Full Day</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mt-1">Starting Date <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                name="available_date"
                                                value={formData.available_date}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all dark:text-white font-medium text-gray-900 shadow-sm shadow-black/5"
                                            />
                                        </div>

                                        <div className="sm:col-span-1">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mt-1">Starting Time <span className="text-red-500">*</span></label>
                                            <input
                                                type="time"
                                                name="available_time"
                                                value={formData.available_time}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all dark:text-white font-medium text-gray-900 shadow-sm shadow-black/5"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Availability / Visibility */}
                                <div className="pt-6 pb-2">
                                    <div className="flex items-center justify-between p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">Active Status</h4>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                                                Turn on to publish this service immediately to the customer marketplace.
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer scale-110 ml-4">
                                            <input
                                                type="checkbox"
                                                name="is_available"
                                                checked={formData.is_available}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>

                            </div>

                            {/* Form Footer Sticky Actions */}
                            <div className="bg-gray-50 dark:bg-gray-800/80 backdrop-blur border-t border-gray-100 dark:border-gray-700 p-6 flex items-center justify-end gap-4 sticky bottom-0 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                <button
                                    type="button"
                                    onClick={() => onNavigate('list')}
                                    className="px-6 py-3 font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm focus:ring-2 focus:ring-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center px-8 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Publishing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <PlusCircle className="w-5 h-5" />
                                            Publish Service
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddService;
