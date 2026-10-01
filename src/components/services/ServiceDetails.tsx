import React, { useEffect, useState } from 'react';
import { serviceApi } from '../../api/serviceApi';
import { ServiceDto } from '../../types/service';

interface ServiceDetailsProps {
    serviceId: number;
    onBack?: () => void;
    onBook?: (serviceId: number) => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ serviceId, onBack, onBook }) => {
    const [service, setService] = useState<ServiceDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                setLoading(true);
                const data = await serviceApi.getServiceById(serviceId);
                setService(data);
                setError(null);
            } catch (err) {
                setError('Failed to load service details. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetails();
    }, [serviceId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-xl text-center shadow-sm">
                <p className="mb-4">{error || 'Service not found.'}</p>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                        Go Back
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-200 dark:bg-gray-700">
                {service.imageUrl ? (
                    <img
                        src={service.imageUrl}
                        alt={service.serviceName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x800?text=Service';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-800 flex items-center justify-center">
                        <span className="text-white text-6xl font-extrabold opacity-40">
                            {service.serviceName}
                        </span>
                    </div>
                )}

                {/* Back Button Overlay */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="absolute top-4 left-4 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition text-gray-800 dark:text-white"
                        aria-label="Go back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                            {service.serviceName}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            Provider ID: {service.providerId}
                        </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 min-w-[160px]">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                            Price
                        </span>
                        <span className="text-4xl font-black text-gray-900 dark:text-white">
                            ${service.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {service.durationMinutes} mins
                        </span>
                    </div>
                </div>

                <div className="prose prose-blue dark:prose-invert max-w-none mb-10">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">About this service</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                        {service.description}
                    </p>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={() => onBook && onBook(service.id!)}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transform transition hover:-translate-y-1 focus:ring-4 focus:ring-blue-600/50 w-full md:w-auto text-lg"
                    >
                        Book This Service
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetails;
