export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
    id: string;             // uuid
    patientName: string;
    email: string;
    phone?: string;
    notes?: string;
    dateISO: string;        // "YYYY-MM-DD"
    startTime: string;      // "HH:mm"
    endTime: string;        // "HH:mm"
    status: BookingStatus;  // iniciar "confirmed"
    createdAt: string;      // ISO
    updatedAt: string;      // ISO
}

export interface TimeSlot {
    startTime: string;      // "HH:mm"
    endTime: string;        // "HH:mm"
    available: boolean;
}

export interface DaySlots {
    dateISO: string;        // "YYYY-MM-DD"
    slots: TimeSlot[];
}

export interface WeekdayRule {
    weekday: number;        // 1-7 (Monday-Sunday)
    start: string;          // "HH:mm"
    end: string;            // "HH:mm"
}

export interface BookingFormData {
    patientName: string;
    email: string;
    phone?: string;
    notes?: string;
}

export interface CreateBookingPayload extends BookingFormData {
    dateISO: string;
    startTime: string;
    endTime: string;
}

export interface StorageAdapter {
    listBookingsByDate(dateISO: string): Promise<Booking[]>;
    findBookingByDateTime(dateISO: string, startTime: string): Promise<Booking | null>;
    createBooking(booking: Booking): Promise<void>;
    getBooking(id: string): Promise<Booking | null>;
}
