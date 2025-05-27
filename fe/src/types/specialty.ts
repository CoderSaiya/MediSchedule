import {DoctorDto} from "@/types/user";

export interface Specialty {
    icon: string;
    title: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    doctors: number;
    avgTime: string;
    rating: number;
    price: number;
    features: string[];
    available: boolean;
    patientsSatisfied: number;
    waitTime: string;
    nextAvailable: string;
}

export interface SpecialtyWithDoctor {
    id: string;
    name: string;
    doctorNames: DoctorDto[];
    amount: number;
}