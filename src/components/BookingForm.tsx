import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { BookingFormData } from '../features/booking/types';
import { formatDateTimeForDisplay } from '../services/time';

// Schema de validação
const bookingSchema = z.object({
    patientName: z.string()
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(100, 'Nome muito longo')
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),

    email: z.string()
        .email('E-mail inválido')
        .max(100, 'E-mail muito longo'),

    phone: z.string()
        .optional()
        .refine((phone: string | undefined) => {
            if (!phone || phone.trim() === '') return true;
            const cleaned = phone.replace(/\D/g, '');
            return cleaned.length >= 10 && cleaned.length <= 11;
        }, 'Telefone deve ter 10 ou 11 dígitos'),

    notes: z.string()
        .max(500, 'Observações muito longas')
        .optional(),
});

interface BookingFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BookingFormData) => Promise<void>;
    selectedDate: string;
    selectedTime: string;
    endTime: string;
}

export function BookingForm({
    isOpen,
    onClose,
    onSubmit,
    selectedDate,
    selectedTime,
    endTime
}: BookingFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            patientName: '',
            email: '',
            phone: '',
            notes: ''
        }
    });

    const handleFormSubmit = async (data: BookingFormData) => {
        try {
            await onSubmit(data);
            reset();
        } catch (error) {
            console.error('Erro no formulário:', error);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            onClose();
        }
    };

    // Máscara simples para telefone
    const formatPhone = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    if (!isOpen) return null;

    return (
        <div className="md-modal-backdrop" onClick={handleClose}>
            <div className="md-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="md-modal-header">
                    <div className="md-flex md-flex-between">
                        <div>
                            <h2 className="md-h3" style={{ margin: '0 0 4px 0' }}>
                                Agendar Consulta
                            </h2>
                            <div className="md-body2" style={{ color: '#666' }}>
                                {formatDateTimeForDisplay(selectedDate, selectedTime)}
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="md-button md-button-text"
                            style={{ minWidth: '40px', padding: '8px' }}
                            aria-label="Fechar"
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="md-modal-body">
                        {/* Resumo do agendamento */}
                        <div className="md-card" style={{ background: '#e3f2fd', border: '1px solid #2196f3', marginBottom: '24px' }}>
                            <div className="md-flex" style={{ alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <span className="material-icons" style={{ color: '#1976d2' }}>event</span>
                                <span className="md-body1" style={{ fontWeight: '500', color: '#1976d2' }}>
                                    Resumo do Agendamento
                                </span>
                            </div>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                                    <span className="material-icons" style={{ fontSize: '16px', color: '#666' }}>schedule</span>
                                    <span className="md-body2">{selectedTime} - {endTime}</span>
                                </div>
                                <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                                    <span className="material-icons" style={{ fontSize: '16px', color: '#666' }}>videocam</span>
                                    <span className="md-body2">Consulta online</span>
                                </div>
                            </div>
                        </div>

                        {/* Nome completo */}
                        <div className="md-textfield">
                            <input
                                {...register('patientName')}
                                id="patientName"
                                type="text"
                                placeholder=" "
                                autoComplete="name"
                            />
                            <label htmlFor="patientName">Nome completo *</label>
                            {errors.patientName && (
                                <div style={{ color: '#b00020', fontSize: '12px', marginTop: '4px' }}>
                                    {errors.patientName.message}
                                </div>
                            )}
                        </div>

                        {/* E-mail */}
                        <div className="md-textfield">
                            <input
                                {...register('email')}
                                id="email"
                                type="email"
                                placeholder=" "
                                autoComplete="email"
                            />
                            <label htmlFor="email">E-mail *</label>
                            {errors.email && (
                                <div style={{ color: '#b00020', fontSize: '12px', marginTop: '4px' }}>
                                    {errors.email.message}
                                </div>
                            )}
                        </div>

                        {/* Telefone (opcional) */}
                        <div className="md-textfield">
                            <input
                                {...register('phone', {
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                        e.target.value = formatPhone(e.target.value);
                                    }
                                })}
                                id="phone"
                                type="tel"
                                placeholder=" "
                                autoComplete="tel"
                            />
                            <label htmlFor="phone">Telefone (opcional)</label>
                            {errors.phone && (
                                <div style={{ color: '#b00020', fontSize: '12px', marginTop: '4px' }}>
                                    {errors.phone.message}
                                </div>
                            )}
                        </div>

                        {/* Observações */}
                        <div className="md-textfield">
                            <textarea
                                {...register('notes')}
                                id="notes"
                                rows={3}
                                placeholder=" "
                                style={{ resize: 'none', minHeight: '80px' }}
                            />
                            <label htmlFor="notes">Observações (opcional)</label>
                            {errors.notes && (
                                <div style={{ color: '#b00020', fontSize: '12px', marginTop: '4px' }}>
                                    {errors.notes.message}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="md-modal-footer">
                        <div className="md-flex md-gap-2" style={{ justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="md-button md-button-outlined"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="md-button md-button-contained"
                                style={{ minWidth: '140px' }}
                            >
                                {isSubmitting ? (
                                    <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                                        <span>⏳</span>
                                        <span>Agendando...</span>
                                    </div>
                                ) : (
                                    <div className="md-flex" style={{ alignItems: 'center', gap: '8px' }}>
                                        <span className="material-icons" style={{ fontSize: '18px' }}>check</span>
                                        <span>Confirmar</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}