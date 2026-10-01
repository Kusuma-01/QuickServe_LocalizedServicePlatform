export interface ServiceDto {
    id?: number;
    providerId: number;
    serviceName: string;
    description: string;
    price: number;
    durationMinutes: number;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}
