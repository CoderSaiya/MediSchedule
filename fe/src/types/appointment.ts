export interface CreateAppointmentRequest {
    doctorId: string
    slotId: string
    patientName: string
    patientPhone: string
    patientEmail: string
    appointmentDate: string
    appointmentTime: string
    reason: string
    symptoms?: string
    orderId: string
}

export interface CreateAppointmentResponse {
    id: string;
}

export interface AppointmentData {
    appointmentId: string;
    appointmentCode: string
    doctor: string;
    slotId: string;
    doctorId: string;
    fullName: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    symptoms: string;
    specialty: string;
    specialtyPrice: number;
    serviceFee: number;
    totalAmount: number;
    orderId: string | undefined;
}

export interface BookingData {
    appointmentId: string;
    appointmentCode: string
    patientName: string | undefined
    patientPhone: string | undefined
    patientEmail: string | undefined
    doctorName: string | undefined
    specialty: string
    appointmentDate: string | undefined
    appointmentTime: string | undefined
    symptoms?: string
    amount: number
    orderId: string | undefined
    transactionId?: string
}

export interface Appointment {
    id: string
    doctorId: string
    slotId: string
    fullName: string
    phone: string
    email: string
    appointmentDate: string // ISO date string
    appointmentTime: string // (HH:mm:ss)
    fileUrl?: string
    reason: string
    status: "pending" | "confirmed" | "completed"
    doctor?: {
        id: string
        fullName: string
        specialty: string
    }
    slot?: {
        id: string
        startTime: string
        endTime: string
        isBooked: boolean
    }
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "all"