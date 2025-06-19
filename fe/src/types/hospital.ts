export interface Hospital {
    id: string
    name: string
    address: string
    phone: string
    email: string
    description: string
    coordinates: {
        latitude: number
        longitude: number
    }
    specialties: string[]
    image: string
    createdAt: string
    updatedAt: string
}

export interface HospitalSearchFilters {
    query?: string
    specialty?: string
    location?: string
}
