import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    listBookingsByDate,
    getBookingById,
    createBooking,
    checkSlotAvailability,
    listAllBookingsInPeriod
} from './api';
import type { CreateBookingPayload, Booking, DaySlots } from './types';
import { generateAllDaySlots, markOccupiedSlots } from './slotLogic';
import { generateDateRange } from '../../services/time';

// Query Keys
const QUERY_KEYS = {
    bookings: (dateISO: string) => ['bookings', dateISO] as const,
    booking: (id: string) => ['booking', id] as const,
    daySlots: 'daySlots' as const,
    slotAvailability: (dateISO: string, startTime: string) => ['slot-availability', dateISO, startTime] as const,
} as const;

/**
 * Hook para buscar agendamentos de uma data específica
 */
export function useDayBookings(dateISO: string) {
    return useQuery({
        queryKey: QUERY_KEYS.bookings(dateISO),
        queryFn: () => listBookingsByDate(dateISO),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}

/**
 * Hook para buscar um agendamento específico por ID
 */
export function useBookingById(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.booking(id),
        queryFn: () => getBookingById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10, // 10 minutos
    });
}

/**
 * Hook para buscar todos os agendamentos (para dashboard do psicólogo)
 */
export function useAllBookings() {
    return useQuery({
        queryKey: ['bookings', 'all'],
        queryFn: async () => {
            const dates = generateDateRange();
            return await listAllBookingsInPeriod(dates);
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}

/**
 * Hook para gerar e buscar slots com disponibilidade
 */
export function useDaySlots() {
    return useQuery({
        queryKey: [QUERY_KEYS.daySlots],
        queryFn: async (): Promise<DaySlots[]> => {
            // Gera todos os slots possíveis
            const allSlots = generateAllDaySlots();

            // Busca todos os agendamentos do período
            const dates = generateDateRange();
            const allBookings = await listAllBookingsInPeriod(dates);

            // Marca slots ocupados
            return markOccupiedSlots(allSlots, allBookings);
        },
        staleTime: 1000 * 60 * 2, // 2 minutos
        refetchOnWindowFocus: true,
    });
}

/**
 * Hook para verificar disponibilidade de um slot específico
 */
export function useSlotAvailability(dateISO: string, startTime: string) {
    return useQuery({
        queryKey: QUERY_KEYS.slotAvailability(dateISO, startTime),
        queryFn: () => checkSlotAvailability(dateISO, startTime),
        enabled: !!dateISO && !!startTime,
        staleTime: 1000 * 30, // 30 segundos
    });
}

/**
 * Hook para criar um novo agendamento
 */
export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
        onSuccess: (newBooking: Booking) => {
            // Invalida queries relacionadas
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.daySlots] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings(newBooking.dateISO) });

            // Adiciona o novo booking ao cache
            queryClient.setQueryData(QUERY_KEYS.booking(newBooking.id), newBooking);
        },
        onError: (error: Error) => {
            console.error('Erro ao criar agendamento:', error);
        }
    });
}

/**
 * Hook para invalidar caches (útil para refresh manual)
 */
export function useRefreshBookings() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.daySlots] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
    };
}
