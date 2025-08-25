import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '../utils/toast';
import { useBookingById } from '../features/booking/hooks';
import { formatDateTimeForDisplay } from '../services/time';
import { downloadICSFile, generateGoogleCalendarURL } from '../services/ics';
import { PROFESSIONAL_INFO } from '../config/availabilityConfig';

export function BookingConfirmation() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: booking, isLoading, error } = useBookingById(id || '');

    const handleDownloadICS = () => {
        if (!booking) return;

        try {
            downloadICSFile(booking);
            toast.success('Arquivo de calendário baixado!');
        } catch (error) {
            console.error('Erro ao baixar ICS:', error);
            toast.error('Erro ao baixar arquivo de calendário');
        }
    };

    const handleAddToGoogleCalendar = () => {
        if (!booking) return;

        try {
            const url = generateGoogleCalendarURL(booking);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Erro ao abrir Google Calendar:', error);
            toast.error('Erro ao abrir Google Calendar');
        }
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
                <div className="md-app-bar">
                    <div className="md-container-sm">
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={() => navigate(-1)}
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
                            <div className="md-body1">Carregando informações...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
                <div className="md-app-bar">
                    <div className="md-container-sm">
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={() => navigate(-1)}
                                className="md-button md-button-text"
                                style={{ minWidth: '40px', padding: '8px' }}
                            >
                                <span className="material-icons">arrow_back</span>
                            </button>
                            <h1 className="md-h3" style={{ margin: 0, color: '#b00020' }}>Erro</h1>
                        </div>
                    </div>
                </div>

                <div className="md-container-sm" style={{ paddingTop: '24px' }}>
                    <div className="md-card">
                        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                            <span className="material-icons" style={{ fontSize: '64px', color: '#b00020', marginBottom: '16px' }}>
                                error_outline
                            </span>
                            <h2 className="md-h3">Agendamento não encontrado</h2>
                            <div className="md-body2" style={{ color: '#666', marginBottom: '24px' }}>
                                O agendamento que você está procurando não existe ou foi removido.
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="md-button md-button-contained"
                            >
                                <span className="material-icons" style={{ marginRight: '8px' }}>home</span>
                                Voltar ao início
                            </button>
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
                            onClick={() => navigate(-1)}
                            className="md-button md-button-text"
                            style={{ minWidth: '40px', padding: '8px' }}
                        >
                            <span className="material-icons">arrow_back</span>
                        </button>
                        <h1 className="md-h3" style={{ margin: 0 }}>Confirmação</h1>
                    </div>
                </div>
            </div>

            <div className="md-container-sm" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
                {/* Success Header */}
                <div className="md-card md-card-elevated" style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span className="material-icons" style={{
                        fontSize: '72px',
                        color: '#4caf50',
                        marginBottom: '16px',
                        display: 'block'
                    }}>
                        check_circle
                    </span>
                    <h1 className="md-h2" style={{ color: '#4caf50', marginBottom: '8px' }}>
                        Agendamento Confirmado!
                    </h1>
                    <div className="md-body1" style={{ color: '#666' }}>
                        Sua consulta foi agendada com sucesso
                    </div>
                </div>

                {/* Booking Details */}
                <div className="md-card" style={{ marginBottom: '24px' }}>
                    <h2 className="md-h3" style={{ marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0' }}>
                        Detalhes da Consulta
                    </h2>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        {/* Data e Hora */}
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
                            <div style={{ flex: 1 }}>
                                <div className="md-body1" style={{ fontWeight: '500' }}>
                                    {formatDateTimeForDisplay(booking.dateISO, booking.startTime)}
                                </div>
                                <div className="md-caption">
                                    Duração: {booking.startTime} - {booking.endTime}
                                </div>
                            </div>
                        </div>

                        {/* Profissional */}
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#e8f5e8',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span className="material-icons" style={{ color: '#4caf50' }}>person</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="md-body1" style={{ fontWeight: '500' }}>{PROFESSIONAL_INFO.name}</div>
                                <div className="md-caption">{PROFESSIONAL_INFO.title}</div>
                            </div>
                        </div>

                        {/* Modalidade */}
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#fff3e0',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span className="material-icons" style={{ color: '#ff9800' }}>videocam</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="md-body1" style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                                    Consulta {PROFESSIONAL_INFO.modality}
                                </div>
                                <div className="md-caption">
                                    Link será enviado por e-mail
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="md-card" style={{ marginBottom: '24px' }}>
                    <h2 className="md-h3" style={{ marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0' }}>
                        Seus Dados
                    </h2>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        <div className="md-flex" style={{ alignItems: 'center', gap: '12px' }}>
                            <span className="material-icons" style={{ color: '#666', fontSize: '20px' }}>person</span>
                            <span className="md-body1">{booking.patientName}</span>
                        </div>

                        <div className="md-flex" style={{ alignItems: 'center', gap: '12px' }}>
                            <span className="material-icons" style={{ color: '#666', fontSize: '20px' }}>email</span>
                            <span className="md-body1">{booking.email}</span>
                        </div>

                        {booking.phone && (
                            <div className="md-flex" style={{ alignItems: 'center', gap: '12px' }}>
                                <span className="material-icons" style={{ color: '#666', fontSize: '20px' }}>phone</span>
                                <span className="md-body1">{booking.phone}</span>
                            </div>
                        )}

                        {booking.notes && (
                            <div className="md-flex" style={{ alignItems: 'flex-start', gap: '12px' }}>
                                <span className="material-icons" style={{ color: '#666', fontSize: '20px', marginTop: '2px' }}>note</span>
                                <div style={{ flex: 1 }}>
                                    <div className="md-caption" style={{ marginBottom: '4px' }}>Observações:</div>
                                    <div className="md-body2">{booking.notes}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Calendar Actions */}
                <div className="md-card" style={{ marginBottom: '24px' }}>
                    <h2 className="md-h3" style={{ marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0' }}>
                        Adicionar ao Calendário
                    </h2>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        <button
                            onClick={handleDownloadICS}
                            className="md-button md-button-outlined"
                            style={{ justifyContent: 'flex-start', padding: '16px' }}
                        >
                            <span className="material-icons" style={{ marginRight: '12px' }}>file_download</span>
                            <div style={{ textAlign: 'left' }}>
                                <div className="md-body1" style={{ fontWeight: '500' }}>Baixar arquivo .ics</div>
                                <div className="md-caption">
                                    Compatível com Apple Calendar, Outlook, etc.
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={handleAddToGoogleCalendar}
                            className="md-button md-button-outlined"
                            style={{ justifyContent: 'flex-start', padding: '16px' }}
                        >
                            <span className="material-icons" style={{ marginRight: '12px' }}>open_in_new</span>
                            <div style={{ textAlign: 'left' }}>
                                <div className="md-body1" style={{ fontWeight: '500' }}>Google Calendar</div>
                                <div className="md-caption">
                                    Abrir no Google Calendar
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="md-card" style={{ backgroundColor: '#e3f2fd', border: '1px solid #2196f3', marginBottom: '24px' }}>
                    <h3 className="md-h3" style={{ color: '#1976d2', marginBottom: '12px' }}>Próximos Passos</h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                            <span className="material-icons" style={{ color: '#1976d2', fontSize: '16px' }}>circle</span>
                            <span className="md-body2">Você receberá um e-mail de confirmação</span>
                        </div>
                        <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                            <span className="material-icons" style={{ color: '#1976d2', fontSize: '16px' }}>circle</span>
                            <span className="md-body2">O link da consulta online será enviado por e-mail</span>
                        </div>
                        <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                            <span className="material-icons" style={{ color: '#1976d2', fontSize: '16px' }}>circle</span>
                            <span className="md-body2">Em caso de dúvidas, entre em contato conosco</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="md-card" style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/')}
                        className="md-button md-button-contained"
                        style={{ width: '100%' }}
                    >
                        <span className="material-icons" style={{ marginRight: '8px' }}>home</span>
                        Fazer Novo Agendamento
                    </button>
                </div>
            </div>
        </div>
    );
}