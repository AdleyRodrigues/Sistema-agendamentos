import type { Booking } from '../features/booking/types';
import { timeStringToZonedDate } from './time';
import { PROFESSIONAL_INFO, SETTINGS } from '../config/availabilityConfig';

/**
 * Gera arquivo ICS (iCalendar) para adicionar ao calendário
 */
export function generateICSFile(booking: Booking): string {
    const startDate = timeStringToZonedDate(booking.dateISO, booking.startTime);
    const endDate = timeStringToZonedDate(booking.dateISO, booking.endTime);

    // Formata datas no formato ICS (YYYYMMDDTHHMMSSZ)
    const formatICSDate = (date: Date): string => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Sistema de Agendamentos//PT',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:booking-${booking.id}@sistema-agendamentos.com`,
        `DTSTART:${formatICSDate(startDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `SUMMARY:Consulta com ${PROFESSIONAL_INFO.name}`,
        `DESCRIPTION:Consulta ${PROFESSIONAL_INFO.modality}\\nPaciente: ${booking.patientName}${booking.notes ? `\\nObservações: ${booking.notes}` : ''}`,
        `LOCATION:${PROFESSIONAL_INFO.modality === 'online' ? 'Online' : 'Consultório'}`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        'DESCRIPTION:Lembrete: Consulta em 15 minutos',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
}

/**
 * Faz download do arquivo ICS
 */
export function downloadICSFile(booking: Booking): void {
    const icsContent = generateICSFile(booking);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `consulta-${booking.dateISO}-${booking.startTime.replace(':', '')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Limpa o URL do blob
    URL.revokeObjectURL(url);
}

/**
 * Gera URL para adicionar ao Google Calendar
 */
export function generateGoogleCalendarURL(booking: Booking): string {
    const startDate = timeStringToZonedDate(booking.dateISO, booking.startTime);
    const endDate = timeStringToZonedDate(booking.dateISO, booking.endTime);

    const formatGoogleDate = (date: Date): string => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `Consulta com ${PROFESSIONAL_INFO.name}`,
        dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
        details: `Consulta ${PROFESSIONAL_INFO.modality}\nPaciente: ${booking.patientName}${booking.notes ? `\nObservações: ${booking.notes}` : ''}`,
        location: PROFESSIONAL_INFO.modality === 'online' ? 'Online' : 'Consultório',
        ctz: SETTINGS.timezone
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
