export interface QRCodeData {
    appointmentId: string
    patientName: string
    doctorId: string
    appointmentDate: string
    appointmentTime: string
    verificationCode: string
    createdAt: string
}

export interface QRVerificationRequest {
    qrData: string
    doctorId: string
}

export interface QRVerificationResponse {
    isValid: boolean
    appointment?: {
        id: string
        patientName: string
        appointmentDate: string
        appointmentTime: string
        reason: string
        status: string
    }
    message: string
}

export interface ScannedQRData {
    appointmentId: string
    patientName: string
    appointmentDate: string
    appointmentTime: string
}

export interface AppointmentQRData {
    appointmentId: string
    patientName: string
    appointmentDate: string
    appointmentTime: string
    verificationCode: string
    timestamp: number
}