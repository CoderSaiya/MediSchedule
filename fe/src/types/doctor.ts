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
    itemNotes: string | null
}

export interface PrescriptionMedicationDto extends PrescriptionMedication {
    medicine: MedicineDto
}

export interface MedicineDto {
    id: string
    name: string
    genericName?: string | null
    strength?: string | null
    manufacturer?: string | null
    description?: string | null
}

export interface CreatePrescriptionResponse {
    id: string
    appointmentId: string
    note?: string | null
    fileUrl: string
    item : PrescriptionMedicationDto[]
}

export interface CreatePrescriptionRequest {
    appointmentId: string
    notes?: string | null
    file: File
    items: PrescriptionMedication[];
}