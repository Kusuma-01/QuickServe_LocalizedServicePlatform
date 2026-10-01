import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';
import { Briefcase, Search, Trash2, MapPin, IndianRupee } from 'lucide-react';

interface Service {
    id: string;
    service_name: string;
    description: string;
    category: string;
    price: number;
    location: string;
    provider_id: string;
    created_at: string;
    profiles?: {
        full_name: string;
        phone_number: string;
    };
}

const AdminServices: React.FC<{ session: Session }> = ({ session }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data: servicesData, error: servicesError } = await supabase
                .from('services')
                .select('*')
                .order('created_at', { ascending: false });

            if (servicesError) throw servicesError;

            if (servicesData && servicesData.length > 0) {
                // Fetch profiles for the providers
                const providerIds = [...new Set(servicesData.map(s => s.provider_id))];
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, full_name, phone_number')
                    .in('id', providerIds);

                const profilesMap = (profilesData || []).reduce((acc: any, profile: any) => {
                    acc[profile.id] = profile;
                    return acc;
                }, {});

                const enrichedServices = servicesData.map(service => ({
                    ...service,
                    profiles: profilesMap[service.provider_id] || null
                }));

                setServices(enrichedServices);
            } else {
                setServices([]);
            }

        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteService = async (id: string, service_name: string) => {
        if (!window.confirm(`Are you sure you want to delete the service "${service_name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) throw error;
            
            setServices(services.filter(s => s.id !== id));
        } catch (error: any) {
            console.error('Error deleting service:', error);
            alert(`Could not delete service. ${error.message}`);
        }
    };

    const filteredServices = services.filter(service => 
        (service.service_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (service.category?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (service.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="animate-in fade-in duration-500 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Manage Services</h1>
                
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search services or providers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex-1 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Service Details</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing & Location</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Listed On</th>
                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                                        No services found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredServices.map((service) => (
                                    <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 shrink-0">
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white mb-0.5">{service.service_name}</div>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                        {service.category || "Service"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {service.profiles?.full_name || 'Unknown Provider'}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {service.profiles?.phone_number || 'No contact'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center font-bold text-slate-900 dark:text-white mb-1">
                                                <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                                                {service.price}
                                            </div>
                                            <div className="flex items-center text-sm text-slate-500">
                                                <MapPin className="w-3.5 h-3.5 mr-1" />
                                                {service.location}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 text-sm whitespace-nowrap">
                                            {new Date(service.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button 
                                                onClick={() => handleDeleteService(service.id, service.service_name)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Service"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminServices;
