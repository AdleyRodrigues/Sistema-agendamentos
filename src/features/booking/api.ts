import { v4 as uuidv4 } from 'uuid';
import type { Booking, CreateBookingPayload } from './types';
import { storage } from '../../storage';
// import { calculateEndTime } from '../../services/time'; // Não usado

/**
 * Lista agendamentos por data
 */
export async function listBookingsByDate(dateISO: string): Promise<Booking[]> {
    return await storage.listBookingsByDate(dateISO);
}

/**
 * Busca agendamento por ID
 */
export async function getBookingById(id: string): Promise<Booking | null> {
    return await storage.getBooking(id);
}

/**
 * Verifica se um horário está disponível
 */
export async function checkSlotAvailability(dateISO: string, startTime: string): Promise<boolean> {
    const existingBooking = await storage.findBookingByDateTime(dateISO, startTime);
    return !existingBooking;
}

/**
 * Cria um novo agendamento
 */
export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const now = new Date().toISOString();

    const booking: Booking = {
        id: uuidv4(),
        patientName: payload.patientName.trim(),
        email: payload.email.toLowerCase().trim(),
        phone: payload.phone?.trim(),
        notes: payload.notes?.trim(),
        dateISO: payload.dateISO,
        startTime: payload.startTime,
        endTime: payload.endTime,
        status: 'confirmed',
        createdAt: now,
        updatedAt: now
    };

    await storage.createBooking(booking);
    return booking;
}

/**
 * Lista todos os agendamentos para um período (para debug/admin)
 */
export async function listAllBookingsInPeriod(dates: string[]): Promise<Booking[]> {
    const allBookings: Booking[] = [];

    for (const date of dates) {
        const bookings = await storage.listBookingsByDate(date);
        allBookings.push(...bookings);
    }

    return allBookings;
}
