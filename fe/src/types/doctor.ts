export interface DashboardStats {
    totalAppointmentsToday: number
    appointmentsDelta: number
    totalPendingPatients: number
    completedAppointmentsToday: number
    completedDelta: number
    averageRating: number
}

export interface PrescriptionMedication {
    medicineId: string
    medicineName: string
    dosage: string
    quantity: number
    unit: string
    instructions: string
    itemNotes: string
}
