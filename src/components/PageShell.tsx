import React from 'react';
// import { ArrowLeft } from 'lucide-react'; // TODO: Instalar lucide-react
const ArrowLeft = () => <span>←</span>;
import { useNavigate } from 'react-router-dom';

interface PageShellProps {
    children: React.ReactNode;
    title?: string;
    showBackButton?: boolean;
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
    className?: string;
}

export function PageShell({
    children,
    title,
    showBackButton = false,
    headerContent,
    footerContent,
    className = ''
}: PageShellProps) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bg text-text flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-sm border-b border-muted/20 safe-area-inset-top">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
                    {showBackButton && (
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-lg hover:bg-card transition-colors duration-150 touch-manipulation"
                            aria-label="Voltar"
                        >
                            <ArrowLeft />
                        </button>
                    )}

                    {title && (
                        <h1 className="text-lg font-semibold text-text flex-1 truncate">
                            {title}
                        </h1>
                    )}

                    {headerContent}
                </div>
            </header>

            {/* Main Content */}
            <main className={`flex-1 max-w-md mx-auto w-full ${className}`}>
                {children}
            </main>

            {/* Footer */}
            {footerContent && (
                <footer className="sticky bottom-0 bg-surface/80 backdrop-blur-sm border-t border-muted/20 safe-area-inset-bottom">
                    <div className="max-w-md mx-auto px-4 py-3">
                        {footerContent}
                    </div>
                </footer>
            )}
        </div>
    );
}
