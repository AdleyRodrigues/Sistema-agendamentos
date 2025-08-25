
// import { Clock, CheckCircle } from 'lucide-react'; // TODO: Instalar lucide-react
const Clock = () => <span>🕒</span>;
const CheckCircle = () => <span>✓</span>;
import type { TimeSlot as TimeSlotType } from '../features/booking/types';

interface TimeSlotProps {
    slot: TimeSlotType;
    isSelected?: boolean;
    onClick: () => void;
    className?: string;
}

export function TimeSlot({
    slot,
    isSelected = false,
    onClick,
    className = ''
}: TimeSlotProps) {
    const { startTime, endTime, available } = slot;

    return (
        <button
            onClick={onClick}
            disabled={!available}
            className={`
        w-full min-h-touch p-3 rounded-lg border transition-all duration-150 touch-manipulation
        flex items-center justify-between group
        ${isSelected
                    ? 'bg-primary border-primary text-primary-contrast shadow-soft scale-[1.02]'
                    : available
                        ? 'bg-card border-muted/20 hover:border-primary/50 hover:bg-surface text-text hover:shadow-soft'
                        : 'bg-muted/10 border-muted/10 text-muted cursor-not-allowed opacity-60'
                }
        ${className}
      `}
        >
            <div className="flex items-center gap-3">
                <div className={`
          p-2 rounded-lg transition-colors duration-150
          ${isSelected
                        ? 'bg-primary-contrast/20'
                        : available
                            ? 'bg-primary/10 group-hover:bg-primary/20'
                            : 'bg-muted/20'
                    }
        `}>
                    <div className={`transition-colors duration-150 ${isSelected
                        ? 'text-primary-contrast'
                        : available
                            ? 'text-primary'
                            : 'text-muted'
                        }`}><Clock /></div>
                </div>

                <div className="text-left">
                    <div className={`
            font-medium text-sm
            ${isSelected ? 'text-primary-contrast' : 'text-text'}
          `}>
                        {startTime} - {endTime}
                    </div>
                    <div className={`
            text-xs
            ${isSelected
                            ? 'text-primary-contrast/80'
                            : available
                                ? 'text-muted'
                                : 'text-muted/60'
                        }
          `}>
                        {available ? 'Disponível' : 'Ocupado'}
                    </div>
                </div>
            </div>

            {isSelected && (
                <div className="flex-shrink-0 text-primary-contrast"><CheckCircle /></div>
            )}

            {!available && (
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                </div>
            )}
        </button>
    );
}

interface TimeSlotsGridProps {
    slots: TimeSlotType[];
    selectedSlot?: string;
    onSlotSelect: (startTime: string) => void;
    isLoading?: boolean;
    className?: string;
}

export function TimeSlotsGrid({
    slots,
    selectedSlot,
    onSlotSelect,
    isLoading = false,
    className = ''
}: TimeSlotsGridProps) {
    if (isLoading) {
        return (
            <div className={`space-y-3 ${className}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton h-14 w-full rounded-lg"></div>
                ))}
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className={`text-center py-8 ${className}`}>
                <div className="text-4xl text-muted mx-auto mb-3"><Clock /></div>
                <p className="text-muted text-sm">
                    Nenhum horário disponível para este dia
                </p>
            </div>
        );
    }

    const availableSlots = slots.filter(slot => slot.available);
    const occupiedSlots = slots.filter(slot => !slot.available);

    return (
        <div className={`space-y-4 ${className}`}>
            {availableSlots.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-text mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        Horários Disponíveis ({availableSlots.length})
                    </h3>
                    <div className="space-y-2">
                        {availableSlots.map((slot) => (
                            <TimeSlot
                                key={slot.startTime}
                                slot={slot}
                                isSelected={selectedSlot === slot.startTime}
                                onClick={() => onSlotSelect(slot.startTime)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {occupiedSlots.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-muted"></div>
                        Horários Ocupados ({occupiedSlots.length})
                    </h3>
                    <div className="space-y-2">
                        {occupiedSlots.map((slot) => (
                            <TimeSlot
                                key={slot.startTime}
                                slot={slot}
                                onClick={() => { }} // Não faz nada
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
