import type { DaySlots, TimeSlot, Booking } from './types';
import { WEEKDAY_RULES, SETTINGS } from '../../config/availabilityConfig';
import {
    generateDateRange,
    isTimeSlotInPast,
    calculateEndTime
} from '../../services/time';
import { parseISO, getDay } from 'date-fns';

/**
 * Gera slots de tempo para um dia específico baseado nas regras de disponibilidade
 */
function generateTimeSlotsForDay(dateISO: string): TimeSlot[] {
    const date = parseISO(dateISO);
    const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.

    // Converte para o formato usado nas regras (1 = Monday, 7 = Sunday)
    const weekday = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Encontra a regra para este dia da semana
    const rule = WEEKDAY_RULES.find(r => r.weekday === weekday);

    if (!rule) {
        return []; // Não há atendimento neste dia
    }

    const slots: TimeSlot[] = [];
    const totalSlotMinutes = SETTINGS.sessionMinutes + SETTINGS.bufferMinutes;

    // Parse dos horários de início e fim
    const [startHour, startMinute] = rule.start.split(':').map(Number);
    const [endHour, endMinute] = rule.end.split(':').map(Number);

    // Converte para minutos desde meia-noite
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Gera slots
    for (let currentMinutes = startMinutes; currentMinutes + totalSlotMinutes <= endMinutes; currentMinutes += totalSlotMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;

        const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const endTime = calculateEndTime(startTime);

        // Verifica se o horário não está no passado
        const available = !isTimeSlotInPast(dateISO, startTime);

        slots.push({
            startTime,
            endTime,
            available
        });
    }

    return slots;
}

/**
 * Gera todos os dias com slots para as próximas semanas
 */
export function generateAllDaySlots(): DaySlots[] {
    const dates = generateDateRange();

    return dates.map(dateISO => ({
        dateISO,
        slots: generateTimeSlotsForDay(dateISO)
    })).filter(day => day.slots.length > 0); // Remove dias sem atendimento
}

/**
 * Marca slots como ocupados baseado nos agendamentos existentes
 */
export function markOccupiedSlots(daySlots: DaySlots[], bookings: Booking[]): DaySlots[] {
    return daySlots.map(day => {
        const dayBookings = bookings.filter(
            booking => booking.dateISO === day.dateISO && booking.status !== 'cancelled'
        );

        const updatedSlots = day.slots.map(slot => {
            const isOccupied = dayBookings.some(
                booking => booking.startTime === slot.startTime
            );

            return {
                ...slot,
                available: slot.available && !isOccupied
            };
        });

        return {
            ...day,
            slots: updatedSlots
        };
    });
}

/**
 * Filtra slots para uma data específica
 */
export function getSlotsForDate(daySlots: DaySlots[], dateISO: string): TimeSlot[] {
    const day = daySlots.find(d => d.dateISO === dateISO);
    return day?.slots || [];
}

/**
 * Verifica se um slot específico está disponível
 */
export function isSlotAvailable(daySlots: DaySlots[], dateISO: string, startTime: string): boolean {
    const slots = getSlotsForDate(daySlots, dateISO);
    const slot = slots.find(s => s.startTime === startTime);
    return slot?.available || false;
}

/**
 * Obtém estatísticas de disponibilidade para um dia
 */
export function getDayAvailabilityStats(slots: TimeSlot[]): {
    total: number;
    available: number;
    occupied: number;
} {
    const total = slots.length;
    const available = slots.filter(s => s.available).length;
    const occupied = total - available;

    return { total, available, occupied };
}

/**
 * Agrupa days slots por semana para exibição no calendário
 */
export function groupSlotsByWeek(daySlots: DaySlots[]): DaySlots[][] {
    const weeks: DaySlots[][] = [];
    let currentWeek: DaySlots[] = [];

    daySlots.forEach((day, index) => {
        currentWeek.push(day);

        // Se chegou no domingo ou é o último dia, fecha a semana
        const dayOfWeek = parseISO(day.dateISO).getDay();
        if (dayOfWeek === 0 || index === daySlots.length - 1) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }
    });

    return weeks;
}

/**
 * Encontra o próximo slot disponível a partir de hoje
 */
export function findNextAvailableSlot(daySlots: DaySlots[]): { dateISO: string; startTime: string } | null {
    for (const day of daySlots) {
        const availableSlot = day.slots.find(slot => slot.available);
        if (availableSlot) {
            return {
                dateISO: day.dateISO,
                startTime: availableSlot.startTime
            };
        }
    }
    return null;
}
