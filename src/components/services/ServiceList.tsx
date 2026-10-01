import React, { useEffect, useState } from 'react';
import { serviceApi } from '../../api/serviceApi';
import { ServiceDto } from '../../types/service';

interface ServiceListProps {
    onServiceSelect?: (serviceId: number) => void;
    providerId?: number; // Optional filter
}

const ServiceList: React.FC<ServiceListProps> = ({ onServiceSelect, providerId }) => {
    const [services, setServices] = useState<ServiceDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                let data: ServiceDto[];
                if (providerId) {
                    data = await serviceApi.getServicesByProviderId(providerId);
                } else {
                    data = await serviceApi.getAllServices();
                }
                setServices(data);
                setError(null);
            } catch (err) {
                setError('Failed to load services. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [providerId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-center">
                {error}
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No services available at the moment.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
                <div
                    key={service.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col"
                >
                    {service.imageUrl && (
                        <div className="h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                            <img
                                src={service.imageUrl}
                                alt={service.serviceName}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Service';
                                }}
                            />
                        </div>
                    )}
                    {!service.imageUrl && (
                        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold opacity-50">
                                {service.serviceName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.serviceName}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                            {service.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    ${service.price.toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {service.durationMinutes} minutes
                                </span>
                            </div>
                            <button
                                onClick={() => service.id && onServiceSelect && onServiceSelect(service.id)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                disabled={!onServiceSelect}
                            >
                                {onServiceSelect ? 'View Details' : 'Book Now'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceList;
