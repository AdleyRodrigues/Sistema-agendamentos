import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../utils/toast';
import { useAllBookings } from '../features/booking/hooks';
import { formatDateTimeForDisplay } from '../services/time';
import { PROFESSIONAL_INFO } from '../config/availabilityConfig';
import type { Booking } from '../features/booking/types';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';

export function PsychologistDashboard() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('upcoming');

    const { data: bookings = [], isLoading, refetch } = useAllBookings();

    // Verificar se está logado
    useEffect(() => {
        const isLogged = localStorage.getItem('psychologist_logged');
        if (!isLogged) {
            toast.error('Acesso não autorizado');
            navigate('/psychologist/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('psychologist_logged');
        toast.success('Logout realizado com sucesso');
        navigate('/');
    };

    const handleBack = () => {
        navigate('/');
    };

    // Filtrar agendamentos
    const filteredBookings = bookings.filter((booking: Booking) => {
        const bookingDate = parseISO(booking.dateISO);

        switch (filter) {
            case 'today':
                return isToday(bookingDate);
            case 'upcoming':
                return !isPast(bookingDate);
            case 'past':
                return isPast(bookingDate);
            default:
                return true;
        }
    });

    // Estatísticas
    const stats = {
        total: bookings.length,
        today: bookings.filter((b: Booking) => isToday(parseISO(b.dateISO))).length,
        upcoming: bookings.filter((b: Booking) => !isPast(parseISO(b.dateISO))).length,
        past: bookings.filter((b: Booking) => isPast(parseISO(b.dateISO))).length
    };

    const getBookingStatus = (booking: Booking) => {
        const bookingDate = parseISO(booking.dateISO);

        if (isToday(bookingDate)) {
            return { label: 'Hoje', color: '#4caf50', icon: 'today' };
        } else if (isTomorrow(bookingDate)) {
            return { label: 'Amanhã', color: '#ff9800', icon: 'event' };
        } else if (isPast(bookingDate)) {
            return { label: 'Realizada', color: '#666', icon: 'check_circle' };
        } else {
            return { label: 'Agendada', color: '#2196f3', icon: 'schedule' };
        }
    };

    if (isLoading) {
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
                            <div className="md-body1">Carregando agendamentos...</div>
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
                    <div className="md-flex md-flex-between">
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={handleBack}
                                className="md-button md-button-text"
                                style={{ minWidth: '40px', padding: '8px' }}
                            >
                                <span className="material-icons">home</span>
                            </button>
                            <div>
                                <h1 className="md-h3" style={{ margin: '0 0 4px 0' }}>Dashboard</h1>
                                <div className="md-caption" style={{ color: '#666' }}>
                                    {PROFESSIONAL_INFO.name}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="md-button md-button-outlined"
                            style={{ padding: '8px 16px' }}
                        >
                            <span className="material-icons" style={{ fontSize: '18px', marginRight: '8px' }}>logout</span>
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            <div className="md-container-sm" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
                {/* Statistics Cards */}
                <div className="md-grid md-grid-2" style={{ marginBottom: '24px' }}>
                    <div className="md-card">
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#e3f2fd',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span className="material-icons" style={{ color: '#1976d2' }}>event</span>
                            </div>
                            <div>
                                <div className="md-h2" style={{ margin: '0 0 4px 0', color: '#1976d2' }}>
                                    {stats.total}
                                </div>
                                <div className="md-body2" style={{ color: '#666' }}>Total de Agendamentos</div>
                            </div>
                        </div>
                    </div>

                    <div className="md-card">
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#e8f5e8',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span className="material-icons" style={{ color: '#4caf50' }}>today</span>
                            </div>
                            <div>
                                <div className="md-h2" style={{ margin: '0 0 4px 0', color: '#4caf50' }}>
                                    {stats.today}
                                </div>
                                <div className="md-body2" style={{ color: '#666' }}>Consultas Hoje</div>
                            </div>
                        </div>
                    </div>

                    <div className="md-card">
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#fff3e0',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span className="material-icons" style={{ color: '#ff9800' }}>schedule</span>
                            </div>
                            <div>
                                <div className="md-h2" style={{ margin: '0 0 4px 0', color: '#ff9800' }}>
                                    {stats.upcoming}
                                </div>
                                <div className="md-body2" style={{ color: '#666' }}>Próximas Consultas</div>
                            </div>
                        </div>
                    </div>

                    <div className="md-card">
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f3e5f5',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span className="material-icons" style={{ color: '#9c27b0' }}>check_circle</span>
                            </div>
                            <div>
                                <div className="md-h2" style={{ margin: '0 0 4px 0', color: '#9c27b0' }}>
                                    {stats.past}
                                </div>
                                <div className="md-body2" style={{ color: '#666' }}>Consultas Realizadas</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="md-card" style={{ marginBottom: '16px' }}>
                    <div className="md-flex md-gap-1" style={{ overflowX: 'auto' }}>
                        {[
                            { key: 'upcoming', label: 'Próximas', count: stats.upcoming },
                            { key: 'today', label: 'Hoje', count: stats.today },
                            { key: 'all', label: 'Todas', count: stats.total },
                            { key: 'past', label: 'Realizadas', count: stats.past }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key as any)}
                                className={`md-button ${filter === tab.key ? 'md-button-contained' : 'md-button-text'}`}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length > 0 ? (
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {filteredBookings
                            .sort((a: Booking, b: Booking) => {
                                // Ordenar por data e hora
                                const dateA = new Date(`${a.dateISO}T${a.startTime}`);
                                const dateB = new Date(`${b.dateISO}T${b.startTime}`);
                                return dateA.getTime() - dateB.getTime();
                            })
                            .map((booking: Booking) => {
                                const status = getBookingStatus(booking);

                                return (
                                    <div key={booking.id} className="md-card">
                                        <div className="md-flex" style={{ alignItems: 'flex-start', gap: '16px' }}>
                                            {/* Status Icon */}
                                            <div style={{
                                                padding: '12px',
                                                backgroundColor: `${status.color}20`,
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <span className="material-icons" style={{ color: status.color }}>
                                                    {status.icon}
                                                </span>
                                            </div>

                                            {/* Booking Info */}
                                            <div style={{ flex: 1 }}>
                                                <div className="md-flex md-flex-between" style={{ alignItems: 'flex-start', marginBottom: '8px' }}>
                                                    <div>
                                                        <h3 className="md-body1" style={{ fontWeight: '500', margin: '0 0 4px 0' }}>
                                                            {booking.patientName}
                                                        </h3>
                                                        <div className="md-caption" style={{ color: status.color }}>
                                                            {status.label}
                                                        </div>
                                                    </div>
                                                    <div className="md-chip" style={{ backgroundColor: `${status.color}20`, color: status.color }}>
                                                        {formatDateTimeForDisplay(booking.dateISO, booking.startTime)}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gap: '4px', marginBottom: '12px' }}>
                                                    <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                                                        <span className="material-icons" style={{ fontSize: '16px', color: '#666' }}>schedule</span>
                                                        <span className="md-body2">{booking.startTime} - {booking.endTime}</span>
                                                    </div>

                                                    <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                                                        <span className="material-icons" style={{ fontSize: '16px', color: '#666' }}>email</span>
                                                        <span className="md-body2">{booking.email}</span>
                                                    </div>

                                                    {booking.phone && (
                                                        <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                                                            <span className="material-icons" style={{ fontSize: '16px', color: '#666' }}>phone</span>
                                                            <span className="md-body2">{booking.phone}</span>
                                                        </div>
                                                    )}

                                                    {booking.notes && (
                                                        <div className="md-flex" style={{ alignItems: 'flex-start', gap: '8px' }}>
                                                            <span className="material-icons" style={{ fontSize: '16px', color: '#666', marginTop: '2px' }}>note</span>
                                                            <span className="md-body2" style={{ fontStyle: 'italic' }}>{booking.notes}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <div className="md-card">
                        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                            <span className="material-icons" style={{ fontSize: '64px', color: '#ccc', marginBottom: '16px' }}>
                                event_busy
                            </span>
                            <h3 className="md-h3">Nenhum agendamento encontrado</h3>
                            <div className="md-body2" style={{ color: '#666' }}>
                                {filter === 'today' && 'Não há consultas agendadas para hoje'}
                                {filter === 'upcoming' && 'Não há consultas futuras agendadas'}
                                {filter === 'past' && 'Não há consultas realizadas'}
                                {filter === 'all' && 'Nenhuma consulta foi agendada ainda'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="md-card" style={{ marginTop: '24px' }}>
                    <h3 className="md-h3" style={{ marginBottom: '16px' }}>Ações Rápidas</h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        <button
                            onClick={() => navigate('/patient/booking')}
                            className="md-button md-button-outlined"
                            style={{ justifyContent: 'flex-start', padding: '16px' }}
                        >
                            <span className="material-icons" style={{ marginRight: '12px' }}>add</span>
                            <div style={{ textAlign: 'left' }}>
                                <div className="md-body1" style={{ fontWeight: '500' }}>Ver Página de Agendamentos</div>
                                <div className="md-caption">Visualizar como os pacientes veem</div>
                            </div>
                        </button>

                        <button
                            onClick={() => refetch()}
                            className="md-button md-button-outlined"
                            style={{ justifyContent: 'flex-start', padding: '16px' }}
                        >
                            <span className="material-icons" style={{ marginRight: '12px' }}>refresh</span>
                            <div style={{ textAlign: 'left' }}>
                                <div className="md-body1" style={{ fontWeight: '500' }}>Atualizar Lista</div>
                                <div className="md-caption">Recarregar agendamentos</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
