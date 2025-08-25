import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../utils/toast';
import { PROFESSIONAL_INFO } from '../config/availabilityConfig';

// Código de acesso simples (em produção seria um sistema de autenticação real)
const ACCESS_CODE = 'PSICO2025';

export function PsychologistLogin() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!code.trim()) {
            toast.error('Por favor, digite o código de acesso');
            return;
        }

        setIsLoading(true);

        // Simular validação
        setTimeout(() => {
            if (code.trim().toUpperCase() === ACCESS_CODE) {
                toast.success('Acesso autorizado!');
                // Salvar no localStorage para manter logado
                localStorage.setItem('psychologist_logged', 'true');
                navigate('/psychologist/dashboard');
            } else {
                toast.error('Código de acesso inválido');
                setCode('');
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleBack = () => {
        navigate('/');
    };

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
                        <h1 className="md-h3" style={{ margin: 0 }}>Acesso do Psicólogo</h1>
                    </div>
                </div>
            </div>

            <div className="md-container-sm" style={{ paddingTop: '48px', paddingBottom: '24px' }}>
                {/* Login Card */}
                <div className="md-card md-card-elevated" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <span className="material-icons" style={{
                            fontSize: '64px',
                            color: '#4caf50',
                            marginBottom: '16px',
                            display: 'block'
                        }}>
                            psychology
                        </span>
                        <h2 className="md-h3" style={{ color: '#4caf50', marginBottom: '8px' }}>
                            {PROFESSIONAL_INFO.name}
                        </h2>
                        <div className="md-body2" style={{ color: '#666' }}>
                            {PROFESSIONAL_INFO.title}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="md-textfield">
                            <input
                                type="password"
                                id="accessCode"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder=" "
                                disabled={isLoading}
                                autoComplete="current-password"
                                style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }}
                            />
                            <label htmlFor="accessCode">Código de Acesso</label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !code.trim()}
                            className="md-button md-button-contained"
                            style={{ width: '100%', marginTop: '16px' }}
                        >
                            {isLoading ? (
                                <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                                    <span>⏳</span>
                                    <span>Verificando...</span>
                                </div>
                            ) : (
                                <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                                    <span className="material-icons" style={{ fontSize: '18px' }}>login</span>
                                    <span>Entrar</span>
                                </div>
                            )}
                        </button>
                    </form>
                </div>

                {/* Help Card */}
                <div className="md-card" style={{ marginTop: '24px', backgroundColor: '#fff3e0', border: '1px solid #ff9800' }}>
                    <div className="md-flex" style={{ alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span className="material-icons" style={{ color: '#ff9800' }}>help_outline</span>
                        <span className="md-body1" style={{ fontWeight: '500', color: '#ff9800' }}>
                            Precisa de Ajuda?
                        </span>
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        <div className="md-body2" style={{ color: '#666' }}>
                            • Digite o código de acesso fornecido pelo administrador
                        </div>
                        <div className="md-body2" style={{ color: '#666' }}>
                            • O código é sensível a maiúsculas e minúsculas
                        </div>
                        <div className="md-body2" style={{ color: '#666' }}>
                            • Em caso de problemas, entre em contato com o suporte
                        </div>
                    </div>
                </div>

                {/* Demo Info (remover em produção) */}
                <div className="md-card" style={{ marginTop: '16px', backgroundColor: '#e3f2fd', border: '1px solid #2196f3' }}>
                    <div className="md-flex" style={{ alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span className="material-icons" style={{ color: '#1976d2' }}>info</span>
                        <span className="md-body1" style={{ fontWeight: '500', color: '#1976d2' }}>
                            Demo - Código de Teste
                        </span>
                    </div>
                    <div className="md-body2" style={{ color: '#1976d2', fontFamily: 'monospace', textAlign: 'center', fontSize: '16px', letterSpacing: '2px' }}>
                        PSICO2025
                    </div>
                </div>
            </div>
        </div>
    );
}
