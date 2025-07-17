export interface TimeSlot {
    id: string;
    time: string;
    isBooked: boolean;
}

export interface GetTimeSlotsParams {
    doctorId: string
    date: string // Format: YYYY-MM-DD
}

export interface Slot {
    id?: string;
    day: string;
    startTime: string;
    endTime: string;
}