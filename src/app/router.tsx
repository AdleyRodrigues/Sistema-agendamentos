import { createBrowserRouter } from 'react-router-dom';
import { UserSelection } from '../pages/UserSelection';
import { BookingPublic } from '../pages/BookingPublic';
import { BookingConfirmation } from '../pages/BookingConfirmation';
import { PsychologistLogin } from '../pages/PsychologistLogin';
import { PsychologistDashboard } from '../pages/PsychologistDashboard';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <UserSelection />,
    },
    {
        path: '/patient/booking',
        element: <BookingPublic />,
    },
    {
        path: '/booking/confirmed/:id',
        element: <BookingConfirmation />,
    },
    {
        path: '/psychologist/login',
        element: <PsychologistLogin />,
    },
    {
        path: '/psychologist/dashboard',
        element: <PsychologistDashboard />,
    },
    {
        path: '*',
        element: (
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="md-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <span className="material-icons" style={{ fontSize: '72px', color: '#ff9800', marginBottom: '16px' }}>
                        error_outline
                    </span>
                    <h1 className="md-h2" style={{ color: '#ff9800', marginBottom: '8px' }}>404</h1>
                    <h2 className="md-h3" style={{ marginBottom: '16px' }}>Página não encontrada</h2>
                    <div className="md-body1" style={{ color: '#666', marginBottom: '24px' }}>
                        A página que você está procurando não existe.
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="md-button md-button-contained"
                    >
                        <span className="material-icons" style={{ marginRight: '8px' }}>home</span>
                        Voltar ao início
                    </button>
                </div>
            </div>
        ),
    },
]);