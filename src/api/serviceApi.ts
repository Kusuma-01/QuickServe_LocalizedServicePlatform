import { ServiceDto } from '../types/service';

const API_BASE_URL = 'http://localhost:8080/api/services';

export const serviceApi = {
    createService: async (service: ServiceDto): Promise<ServiceDto> => {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service),
        });
        if (!response.ok) throw new Error('Failed to create service');
        return response.json();
    },

    getAllServices: async (): Promise<ServiceDto[]> => {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch services');
        return response.json();
    },

    getServiceById: async (id: number): Promise<ServiceDto> => {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch service');
        return response.json();
    },

    getServicesByProviderId: async (providerId: number): Promise<ServiceDto[]> => {
        const response = await fetch(`${API_BASE_URL}/provider/${providerId}`);
        if (!response.ok) throw new Error('Failed to fetch services for provider');
        return response.json();
    },

    updateService: async (id: number, service: ServiceDto): Promise<ServiceDto> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service),
        });
        if (!response.ok) throw new Error('Failed to update service');
        return response.json();
    },

    deleteService: async (id: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete service');
    },
};
