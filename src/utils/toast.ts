// Toast simples sem dependências externas
// TODO: Substituir por react-hot-toast quando instalado

interface ToastOptions {
    type: 'success' | 'error' | 'info';
    message: string;
    duration?: number;
}

class SimpleToast {
    private container: HTMLElement | null = null;

    private createContainer() {
        if (this.container) return this.container;

        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2';
        document.body.appendChild(this.container);
        return this.container;
    }

    show({ type, message, duration = 4000 }: ToastOptions) {
        console.log(`[${type.toUpperCase()}] ${message}`);

        const container = this.createContainer();
        const toast = document.createElement('div');

        const bgColor = {
            success: 'bg-accent',
            error: 'bg-danger',
            info: 'bg-primary'
        }[type];

        toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-pulse`;
        toast.textContent = message;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);
    }

    success(message: string) {
        this.show({ type: 'success', message });
    }

    error(message: string) {
        this.show({ type: 'error', message });
    }

    info(message: string) {
        this.show({ type: 'info', message });
    }
}

export const toast = new SimpleToast();
