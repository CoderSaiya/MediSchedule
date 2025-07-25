import {ForwardRefExoticComponent, RefAttributes} from "react";
import {LucideProps} from "lucide-react";

export interface Response<T> {
    data: T;
    message: string;
    statusCode: number;
    isSuccess: boolean;
}

export interface StatDoctor {
    title: string
    value: string
    change: string
    trend: string
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
    color: string
    bgColor: string
}

export interface AdminStats {
    totalAppointmentsToday: number;
    appointmentsDeltaPercent: number;
    pendingToday: number;
    pendingDeltaPercent: number;
    completedToday: number;
    completedDeltaPercent: number;
    newPatientsToday: number;
    newPatientsDeltaPercent: number;
}