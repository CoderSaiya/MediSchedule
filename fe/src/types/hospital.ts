export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Hospital {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    coordinates: Coordinates;
    specialties: string[];
    image: string;
    createdAt: string;
    updatedAt: string;
}
