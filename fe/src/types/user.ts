import {Slot} from "@/types/slot";

export interface DoctorDto {
    id: string;
    name: string;
}

export interface Doctor {
    id: string;
    name: string;
    fullName: string;
    username: string;
    email: string;
    specialtyId: string;
    licenseNumber: string;
    biography: string;
    image: string;
    levelEducation: string;
    specialty: string;
    hospital: string;
    experience: string;
    rating: number;
    reviews: number;
    avatar: string;
    available: boolean;
    slots: Slot[];
}




