import { format, addMinutes, parseISO, isAfter, startOfDay, addWeeks, eachDayOfInterval } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { SETTINGS } from '../config/availabilityConfig';

const TIMEZONE = SETTINGS.timezone;

/**
 * Converte uma string de tempo "HH:mm" para Date na timezone configurada
 */
export function timeStringToZonedDate(dateISO: string, timeString: string): Date {
    const dateTimeString = `${dateISO}T${timeString}:00`;
    const localDate = parseISO(dateTimeString);
    return fromZonedTime(localDate, TIMEZONE);
}

/**
 * Converte Date para string de tempo "HH:mm" na timezone configurada
 */
export function dateToTimeString(date: Date): string {
    const zonedDate = toZonedTime(date, TIMEZONE);
    return format(zonedDate, 'HH:mm');
}

/**
 * Converte Date para string de data "yyyy-MM-dd" na timezone configurada
 */
export function dateToDateISO(date: Date): string {
    const zonedDate = toZonedTime(date, TIMEZONE);
    return format(zonedDate, 'yyyy-MM-dd');
}

/**
 * Obtém a data/hora atual na timezone configurada
 */
export function getCurrentZonedTime(): Date {
    return toZonedTime(new Date(), TIMEZONE);
}

/**
 * Verifica se um horário já passou (considerando timezone)
 */
export function isTimeSlotInPast(dateISO: string, timeString: string): boolean {
    const slotDate = timeStringToZonedDate(dateISO, timeString);
    const now = getCurrentZonedTime();
    return isAfter(now, slotDate);
}

/**
 * Calcula o horário de fim baseado no início + sessão + buffer
 */
export function calculateEndTime(startTime: string): string {
    const totalMinutes = SETTINGS.sessionMinutes + SETTINGS.bufferMinutes;

    // Parse do horário de início
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date(2000, 0, 1, hours, minutes);

    // Adiciona os minutos totais
    const endDate = addMinutes(startDate, totalMinutes);

    return format(endDate, 'HH:mm');
}

/**
 * Gera lista de datas para as próximas semanas
 */
export function generateDateRange(): string[] {
    const today = startOfDay(getCurrentZonedTime());
    const endDate = addWeeks(today, SETTINGS.weeksForward);

    const days = eachDayOfInterval({ start: today, end: endDate });
    return days.map((day: Date) => dateToDateISO(day));
}

/**
 * Formata data para exibição amigável
 */
export function formatDateForDisplay(dateISO: string): string {
    const date = parseISO(dateISO);
    const zonedDate = toZonedTime(date, TIMEZONE);
    // TODO: Adicionar locale pt-BR quando disponível
    return format(zonedDate, "dd 'de' MMMM");
}

/**
 * Formata data e hora para exibição amigável
 */
export function formatDateTimeForDisplay(dateISO: string, timeString: string): string {
    const date = parseISO(dateISO);
    const zonedDate = toZonedTime(date, TIMEZONE);
    // TODO: Adicionar locale pt-BR quando disponível
    return format(zonedDate, "dd 'de' MMMM") + " às " + timeString;
}

/**
 * Obtém o nome do dia da semana
 */
export function getDayName(dateISO: string): string {
    const date = parseISO(dateISO);
    const zonedDate = toZonedTime(date, TIMEZONE);
    // TODO: Adicionar locale pt-BR quando disponível
    return format(zonedDate, 'EEEE');
}

/**
 * Verifica se uma data é hoje
 */
export function isToday(dateISO: string): boolean {
    const today = dateToDateISO(getCurrentZonedTime());
    return dateISO === today;
}
