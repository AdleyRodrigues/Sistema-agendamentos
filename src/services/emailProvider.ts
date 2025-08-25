import type { Booking } from '../features/booking/types';
import { formatDateTimeForDisplay } from './time';
import { PROFESSIONAL_INFO } from '../config/availabilityConfig';

export interface EmailPayload {
    to: string;
    subject: string;
    booking: Booking;
}

class EmailProvider {
    /**
     * Envia e-mail de confirmação de agendamento
     * Por enquanto apenas loga no console (mock)
     */
    async send(template: 'booking_confirmed', payload: EmailPayload): Promise<void> {
        console.log('📧 E-mail enviado (MOCK):');
        console.log('Template:', template);
        console.log('Para:', payload.to);
        console.log('Assunto:', payload.subject);
        console.log('Dados do agendamento:');
        console.log({
            paciente: payload.booking.patientName,
            data: formatDateTimeForDisplay(payload.booking.dateISO, payload.booking.startTime),
            modalidade: PROFESSIONAL_INFO.modality,
            profissional: PROFESSIONAL_INFO.name,
            observacoes: payload.booking.notes || 'Nenhuma'
        });

        // TODO(next): Implementar envio real de e-mail
        // Opções: SendGrid, AWS SES, Resend, etc.
        // 
        // Exemplo com Resend:
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //   from: 'agendamentos@clinica.com',
        //   to: payload.to,
        //   subject: payload.subject,
        //   html: generateBookingConfirmationHTML(payload.booking)
        // });

        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    /**
     * Gera payload padrão para e-mail de confirmação
     */
    createBookingConfirmationPayload(booking: Booking): EmailPayload {
        return {
            to: booking.email,
            subject: `Confirmação de Agendamento - ${formatDateTimeForDisplay(booking.dateISO, booking.startTime)}`,
            booking
        };
    }
}

// TODO(next): Implementar templates de e-mail em HTML
// function generateBookingConfirmationHTML(booking: Booking): string {
//   return `
//     <h1>Agendamento Confirmado</h1>
//     <p>Olá ${booking.patientName},</p>
//     <p>Seu agendamento foi confirmado para:</p>
//     <ul>
//       <li><strong>Data:</strong> ${formatDateTimeForDisplay(booking.dateISO, booking.startTime)}</li>
//       <li><strong>Profissional:</strong> ${PROFESSIONAL_INFO.name}</li>
//       <li><strong>Modalidade:</strong> ${PROFESSIONAL_INFO.modality}</li>
//     </ul>
//     ${booking.notes ? `<p><strong>Observações:</strong> ${booking.notes}</p>` : ''}
//     <p>Em caso de dúvidas, entre em contato conosco.</p>
//   `;
// }

export const emailProvider = new EmailProvider();
