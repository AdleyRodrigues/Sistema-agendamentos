import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../utils/toast';
import { useDaySlots, useCreateBooking } from '../features/booking/hooks';
import { getSlotsForDate, isSlotAvailable } from '../features/booking/slotLogic';
import { calculateEndTime } from '../services/time';
import { emailProvider } from '../services/emailProvider';
import { PROFESSIONAL_INFO } from '../config/availabilityConfig';
import type { BookingFormData, CreateBookingPayload } from '../features/booking/types';
import { BookingForm } from '../components/BookingForm';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isBefore } from 'date-fns';
import { getCurrentZonedTime } from '../services/time';

// Função para traduzir meses
const getMonthName = (date: Date) => {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Função para traduzir data completa
const getFullDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
};

export function BookingPublic() {
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(getCurrentZonedTime());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data: daySlots = [], isLoading: slotsLoading } = useDaySlots();
    const createBookingMutation = useCreateBooking();

    const selectedDateSlots = selectedDate ? getSlotsForDate(daySlots, selectedDate) : [];

    // Gerar dias do calendário
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Domingo
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd
    });

    // Obter informações do dia
    const getDayInfo = (date: Date) => {
        const dateISO = format(date, 'yyyy-MM-dd');
        const daySlot = daySlots.find(slot => slot.dateISO === dateISO);
        const today = getCurrentZonedTime();

        return {
            dateISO,
            date,
            dayNumber: format(date, 'd'),
            isCurrentMonth: isSameMonth(date, currentMonth),
            isToday: isToday(date),
            isPast: isBefore(date, today) && !isToday(date),
            hasSlots: !!daySlot && daySlot.slots.length > 0,
            availableCount: daySlot?.slots.filter(slot => slot.available).length || 0,
            isSelected: selectedDate === dateISO
        };
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => addDays(startOfMonth(prev), -15));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => addDays(endOfMonth(prev), 15));
        setSelectedDate(null);
    };

    const handleDateSelect = (dateISO: string, dayInfo: any) => {
        if (dayInfo.isPast || !dayInfo.hasSlots) return;

        setSelectedDate(dateISO);
        setSelectedTime(null);
    };

    const handleTimeSelect = (startTime: string) => {
        if (!selectedDate) return;

        const isAvailable = isSlotAvailable(daySlots, selectedDate, startTime);
        if (!isAvailable) {
            toast.error('Este horário não está mais disponível');
            return;
        }

        setSelectedTime(startTime);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData: BookingFormData) => {
        if (!selectedDate || !selectedTime) return;

        try {
            const endTime = calculateEndTime(selectedTime);

            const payload: CreateBookingPayload = {
                ...formData,
                dateISO: selectedDate,
                startTime: selectedTime,
                endTime
            };

            const booking = await createBookingMutation.mutateAsync(payload);

            const emailPayload = emailProvider.createBookingConfirmationPayload(booking);
            await emailProvider.send('booking_confirmed', emailPayload);

            toast.success('Agendamento confirmado com sucesso!');
            navigate(`/booking/confirmed/${booking.id}`);

        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            toast.error(error instanceof Error ? error.message : 'Erro ao agendar consulta');
        } finally {
            setIsFormOpen(false);
            setSelectedTime(null);
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedTime(null);
    };

    const handleBack = () => {
        navigate('/');
    };

    if (slotsLoading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
                <div className="md-app-bar">
                    <div className="md-container-sm">
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={handleBack}
                                className="md-button md-button-text"
                                style={{ minWidth: '40px', padding: '8px' }}
                            >
                                <span className="material-icons">arrow_back</span>
                            </button>
                            <h1 className="md-h3" style={{ margin: 0 }}>Carregando...</h1>
                        </div>
                    </div>
                </div>

                <div className="md-container-sm" style={{ paddingTop: '24px' }}>
                    <div className="md-card">
                        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                            <div className="md-body1">Carregando agenda...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
            {/* Header */}
            <div className="md-app-bar">
                <div className="md-container-sm">
                    <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={handleBack}
                            className="md-button md-button-text"
                            style={{ minWidth: '40px', padding: '8px' }}
                        >
                            <span className="material-icons">arrow_back</span>
                        </button>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                            <h1 className="md-h2" style={{ margin: '0 0 4px 0', color: '#1976d2' }}>
                                {PROFESSIONAL_INFO.name}
                            </h1>
                            <div className="md-body2" style={{ color: '#666', margin: '0 0 4px 0' }}>
                                {PROFESSIONAL_INFO.title}
                            </div>
                            <div className="md-caption" style={{ color: '#1976d2', fontWeight: '500' }}>
                                Agende sua consulta
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md-container-sm" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
                {/* Calendar */}
                <div className="md-card md-card-elevated">
                    {/* Calendar Header */}
                    <div className="md-flex md-flex-between" style={{ alignItems: 'center', marginBottom: '24px' }}>
                        <button
                            onClick={handlePrevMonth}
                            className="md-button md-button-text"
                            style={{ minWidth: '40px', padding: '8px' }}
                        >
                            <span className="material-icons">chevron_left</span>
                        </button>

                        <h2 className="md-h3" style={{ margin: 0, textAlign: 'center' }}>
                            {getMonthName(currentMonth)}
                        </h2>

                        <button
                            onClick={handleNextMonth}
                            className="md-button md-button-text"
                            style={{ minWidth: '40px', padding: '8px' }}
                        >
                            <span className="material-icons">chevron_right</span>
                        </button>
                    </div>

                    {/* Days of week header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px',
                        marginBottom: '8px',
                        padding: '0 4px'
                    }}>
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                            <div key={day} style={{
                                textAlign: 'center',
                                padding: '8px 4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#666'
                            }}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '4px',
                        padding: '0 4px'
                    }}>
                        {calendarDays.map((day) => {
                            const dayInfo = getDayInfo(day);

                            return (
                                <div
                                    key={dayInfo.dateISO}
                                    onClick={() => handleDateSelect(dayInfo.dateISO, dayInfo)}
                                    style={{
                                        aspectRatio: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: dayInfo.isSelected ? '2px solid #1976d2' :
                                            dayInfo.isToday ? '2px solid #ff9800' : '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        cursor: (dayInfo.hasSlots && !dayInfo.isPast) ? 'pointer' : 'default',
                                        backgroundColor: dayInfo.isSelected ? '#e3f2fd' :
                                            dayInfo.isToday ? '#fff3e0' :
                                                dayInfo.isPast ? '#f5f5f5' :
                                                    dayInfo.hasSlots ? '#ffffff' : '#fafafa',
                                        opacity: dayInfo.isCurrentMonth ? 1 : 0.4,
                                        transition: 'all 0.2s ease-in-out',
                                        position: 'relative',
                                        minHeight: '50px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (dayInfo.hasSlots && !dayInfo.isPast && !dayInfo.isSelected) {
                                            e.currentTarget.style.backgroundColor = '#f0f8ff';
                                            e.currentTarget.style.borderColor = '#1976d2';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!dayInfo.isSelected) {
                                            e.currentTarget.style.backgroundColor = dayInfo.isToday ? '#fff3e0' :
                                                dayInfo.isPast ? '#f5f5f5' :
                                                    dayInfo.hasSlots ? '#ffffff' : '#fafafa';
                                            e.currentTarget.style.borderColor = dayInfo.isToday ? '#ff9800' : '#e0e0e0';
                                        }
                                    }}
                                >
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: dayInfo.isToday ? '700' : '500',
                                        color: dayInfo.isSelected ? '#1976d2' :
                                            dayInfo.isToday ? '#ff9800' :
                                                dayInfo.isPast ? '#999' :
                                                    dayInfo.hasSlots ? '#333' : '#ccc'
                                    }}>
                                        {dayInfo.dayNumber}
                                    </div>

                                    {dayInfo.hasSlots && dayInfo.availableCount > 0 && (
                                        <div style={{
                                            fontSize: '10px',
                                            color: '#4caf50',
                                            fontWeight: '500',
                                            marginTop: '2px'
                                        }}>
                                            {dayInfo.availableCount} vagas
                                        </div>
                                    )}

                                    {dayInfo.hasSlots && dayInfo.availableCount === 0 && (
                                        <div style={{
                                            fontSize: '10px',
                                            color: '#f44336',
                                            fontWeight: '500',
                                            marginTop: '2px'
                                        }}>
                                            Lotado
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '16px',
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <div className="md-flex" style={{ alignItems: 'center', gap: '6px' }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#4caf50',
                                borderRadius: '50%'
                            }} />
                            <span style={{ fontSize: '12px', color: '#666' }}>Disponível</span>
                        </div>
                        <div className="md-flex" style={{ alignItems: 'center', gap: '6px' }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#f44336',
                                borderRadius: '50%'
                            }} />
                            <span style={{ fontSize: '12px', color: '#666' }}>Lotado</span>
                        </div>
                        <div className="md-flex" style={{ alignItems: 'center', gap: '6px' }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#ff9800',
                                borderRadius: '50%'
                            }} />
                            <span style={{ fontSize: '12px', color: '#666' }}>Hoje</span>
                        </div>
                    </div>
                </div>

                {/* Time Slots */}
                {selectedDate ? (
                    <div className="md-card" style={{ marginTop: '24px' }}>
                        <div className="md-flex md-flex-between" style={{ alignItems: 'center', marginBottom: '16px' }}>
                            <h3 className="md-h3" style={{ margin: 0 }}>
                                Horários - {getFullDate(selectedDate)}
                            </h3>
                            {selectedDateSlots.length > 0 && (
                                <div className="md-chip md-chip-primary">
                                    {selectedDateSlots.filter(slot => slot.available).length} disponíveis
                                </div>
                            )}
                        </div>

                        {selectedDateSlots.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                gap: '8px'
                            }}>
                                {selectedDateSlots.map((slot) => (
                                    <button
                                        key={slot.startTime}
                                        onClick={() => slot.available && handleTimeSelect(slot.startTime)}
                                        disabled={!slot.available}
                                        className={`md-button ${slot.available ? 'md-button-outlined' : 'md-button-text'}`}
                                        style={{
                                            padding: '16px 12px',
                                            flexDirection: 'column',
                                            minHeight: '60px',
                                            backgroundColor: slot.available ? '#ffffff' : '#f5f5f5',
                                            borderColor: slot.available ? '#1976d2' : '#e0e0e0',
                                            color: slot.available ? '#1976d2' : '#999',
                                            cursor: slot.available ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        <div style={{ fontWeight: '600', fontSize: '16px' }}>
                                            {slot.startTime}
                                        </div>
                                        <div style={{ fontSize: '12px', marginTop: '2px' }}>
                                            {slot.available ? 'Disponível' : 'Ocupado'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                                <span className="material-icons" style={{ fontSize: '48px', color: '#ccc', marginBottom: '12px' }}>
                                    event_busy
                                </span>
                                <div className="md-body1" style={{ marginBottom: '8px' }}>Nenhum horário disponível</div>
                                <div className="md-caption" style={{ color: '#666' }}>
                                    Selecione outro dia no calendário
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="md-card" style={{ marginTop: '24px' }}>
                        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                            <span className="material-icons" style={{ fontSize: '64px', color: '#1976d2', marginBottom: '16px' }}>
                                event
                            </span>
                            <h3 className="md-h3">Selecione uma data</h3>
                            <div className="md-body2" style={{ color: '#666' }}>
                                Clique em um dia no calendário para ver os horários disponíveis
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Form Modal */}
            {selectedDate && selectedTime && (
                <BookingForm
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    endTime={calculateEndTime(selectedTime)}
                />
            )}

            {/* Loading overlay */}
            {createBookingMutation.isPending && (
                <div className="md-modal-backdrop">
                    <div className="md-card" style={{ padding: '32px', textAlign: 'center' }}>
                        <div className="md-body1" style={{ marginBottom: '16px' }}>
                            Confirmando agendamento...
                        </div>
                        <div style={{ color: '#1976d2' }}>⏳</div>
                    </div>
                </div>
            )}
        </div>
    );
}