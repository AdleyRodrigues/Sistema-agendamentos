import type { WeekdayRule } from '../features/booking/types';

export const SETTINGS = {
    timezone: "America/Fortaleza",
    sessionMinutes: 50,
    bufferMinutes: 10,
    weeksForward: 4
};

export const WEEKDAY_RULES: WeekdayRule[] = [
    { weekday: 1, start: "09:00", end: "18:00" }, // Mon
    { weekday: 2, start: "09:00", end: "18:00" }, // Tue
    { weekday: 3, start: "09:00", end: "18:00" }, // Wed
    { weekday: 4, start: "09:00", end: "18:00" }, // Thu
    { weekday: 5, start: "09:00", end: "18:00" }  // Fri
];

export const PROFESSIONAL_INFO = {
    name: "Dr. José Hugo",
    title: "Psicólogo Clínico",
    subtitle: "Agende sua consulta",
    modality: "online" // Para esta versão, apenas online
};
