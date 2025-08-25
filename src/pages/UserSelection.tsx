import { useNavigate } from 'react-router-dom';
import { PROFESSIONAL_INFO } from '../config/availabilityConfig';

export function UserSelection() {
    const navigate = useNavigate();

    const handlePatientAccess = () => {
        navigate('/patient/booking');
    };

    const handlePsychologistAccess = () => {
        navigate('/psychologist/login');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
            {/* Header */}
            <div className="md-app-bar">
                <div className="md-container-sm">
                    <div style={{ textAlign: 'center' }}>
                        <h1 className="md-h2" style={{ margin: '0 0 4px 0', color: '#1976d2' }}>
                            Sistema de Agendamentos
                        </h1>
                        <div className="md-body2" style={{ color: '#666', margin: '0 0 4px 0' }}>
                            {PROFESSIONAL_INFO.name} - {PROFESSIONAL_INFO.title}
                        </div>
                        <div className="md-caption" style={{ color: '#1976d2', fontWeight: '500' }}>
                            Selecione como deseja acessar
                        </div>
                    </div>
                </div>
            </div>

            <div className="md-container-sm" style={{ paddingTop: '48px', paddingBottom: '24px' }}>
                {/* Welcome Card */}
                <div className="md-card md-card-elevated" style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <span className="material-icons" style={{
                        fontSize: '72px',
                        color: '#1976d2',
                        marginBottom: '16px',
                        display: 'block'
                    }}>
                        psychology
                    </span>
                    <h1 className="md-h2" style={{ color: '#1976d2', marginBottom: '8px' }}>
                        Bem-vindo!
                    </h1>
                    <div className="md-body1" style={{ color: '#666', marginBottom: '16px' }}>
                        Como você gostaria de acessar o sistema?
                    </div>
                </div>

                {/* User Type Selection */}
                <div style={{ display: 'grid', gap: '16px' }}>
                    {/* Patient Access */}
                    <div
                        className="md-card"
                        onClick={handlePatientAccess}
                        style={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            border: '2px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#1976d2';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)';
                        }}
                    >
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                padding: '16px',
                                backgroundColor: '#e3f2fd',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span className="material-icons" style={{ color: '#1976d2', fontSize: '32px' }}>
                                    person
                                </span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 className="md-h3" style={{ margin: '0 0 8px 0', color: '#1976d2' }}>
                                    Sou Paciente
                                </h3>
                                <div className="md-body2" style={{ color: '#666', marginBottom: '8px' }}>
                                    Quero agendar uma consulta
                                </div>
                                <div className="md-caption" style={{ color: '#1976d2' }}>
                                    • Visualizar horários disponíveis<br />
                                    • Agendar consultas<br />
                                    • Receber confirmações por e-mail
                                </div>
                            </div>
                            <span className="material-icons" style={{ color: '#1976d2' }}>
                                arrow_forward_ios
                            </span>
                        </div>
                    </div>

                    {/* Psychologist Access */}
                    <div
                        className="md-card"
                        onClick={handlePsychologistAccess}
                        style={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            border: '2px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#4caf50';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)';
                        }}
                    >
                        <div className="md-flex" style={{ alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                padding: '16px',
                                backgroundColor: '#e8f5e8',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span className="material-icons" style={{ color: '#4caf50', fontSize: '32px' }}>
                                    psychology
                                </span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 className="md-h3" style={{ margin: '0 0 8px 0', color: '#4caf50' }}>
                                    Sou Psicólogo
                                </h3>
                                <div className="md-body2" style={{ color: '#666', marginBottom: '8px' }}>
                                    Quero gerenciar meus agendamentos
                                </div>
                                <div className="md-caption" style={{ color: '#4caf50' }}>
                                    • Visualizar agendamentos<br />
                                    • Gerenciar horários<br />
                                    • Acompanhar consultas
                                </div>
                            </div>
                            <span className="material-icons" style={{ color: '#4caf50' }}>
                                arrow_forward_ios
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="md-card" style={{ marginTop: '32px', backgroundColor: '#f3e5f5', border: '1px solid #9c27b0' }}>
                    <div className="md-flex" style={{ alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span className="material-icons" style={{ color: '#9c27b0' }}>info</span>
                        <span className="md-body1" style={{ fontWeight: '500', color: '#9c27b0' }}>
                            Informações Importantes
                        </span>
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                            <span className="material-icons" style={{ fontSize: '16px', color: '#666' }}>schedule</span>
                            <span className="md-body2">Consultas de 50 minutos</span>
                        </div>
                        <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                            <span className="material-icons" style={{ fontSize: '16px', color: '#666' }}>videocam</span>
                            <span className="md-body2">Atendimento online via videoconferência</span>
                        </div>
                        <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                            <span className="material-icons" style={{ fontSize: '16px', color: '#666' }}>email</span>
                            <span className="md-body2">Confirmações enviadas por e-mail</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
