import { useState, useRef, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react'; // TODO: Instalar lucide-react
const ChevronLeft = () => <span>‹</span>;
const ChevronRight = () => <span>›</span>;
import { format, startOfWeek, addDays } from 'date-fns';
// import { ptBR } from 'date-fns/locale'; // TODO: Adicionar quando disponível
import type { DaySlots } from '../features/booking/types';
import { isToday, getCurrentZonedTime } from '../services/time';

interface CalendarWeekStripProps {
    daySlots: DaySlots[];
    selectedDate: string | null;
    onDateSelect: (dateISO: string) => void;
    isLoading?: boolean;
}

export function CalendarWeekStrip({
    daySlots,
    selectedDate,
    onDateSelect,
    isLoading = false
}: CalendarWeekStripProps) {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = getCurrentZonedTime();
        return startOfWeek(today, { weekStartsOn: 1 }); // Semana começa na segunda
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Gera os dias da semana atual
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(currentWeekStart, i);
        const dateISO = format(date, 'yyyy-MM-dd');
        const daySlot = daySlots.find(slot => slot.dateISO === dateISO);

        return {
            date,
            dateISO,
            hasSlots: !!daySlot && daySlot.slots.length > 0,
            availableCount: daySlot?.slots.filter(slot => slot.available).length || 0,
            totalCount: daySlot?.slots.length || 0
        };
    });

    const canGoPrevious = () => {
        const today = getCurrentZonedTime();
        return currentWeekStart > startOfWeek(today, { weekStartsOn: 1 });
    };

    const canGoNext = () => {
        const maxWeeks = 4; // SETTINGS.weeksForward
        const today = getCurrentZonedTime();
        const maxWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), maxWeeks * 7);
        return currentWeekStart < maxWeekStart;
    };

    const goToPreviousWeek = () => {
        if (canGoPrevious()) {
            setCurrentWeekStart((prev: Date) => addDays(prev, -7));
        }
    };

    const goToNextWeek = () => {
        if (canGoNext()) {
            setCurrentWeekStart((prev: Date) => addDays(prev, 7));
        }
    };

    // Auto-scroll para o dia selecionado
    useEffect(() => {
        if (selectedDate && scrollRef.current) {
            const selectedButton = scrollRef.current.querySelector(`[data-date="${selectedDate}"]`);
            if (selectedButton) {
                selectedButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [selectedDate]);

    if (isLoading) {
        return (
            <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-3">
                    <div className="skeleton h-6 w-32"></div>
                    <div className="flex gap-2 ml-auto">
                        <div className="skeleton h-8 w-8 rounded-lg"></div>
                        <div className="skeleton h-8 w-8 rounded-lg"></div>
                    </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="skeleton h-16 w-14 rounded-lg flex-shrink-0"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-3 bg-surface/50">
            {/* Header da semana */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-text">
                    {format(currentWeekStart, "MMMM 'de' yyyy")}
                </h2>

                <div className="flex gap-1">
                    <button
                        onClick={goToPreviousWeek}
                        disabled={!canGoPrevious()}
                        className="p-2 rounded-lg hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 touch-manipulation"
                        aria-label="Semana anterior"
                    >
                        <ChevronLeft />
                    </button>

                    <button
                        onClick={goToNextWeek}
                        disabled={!canGoNext()}
                        className="p-2 rounded-lg hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 touch-manipulation"
                        aria-label="Próxima semana"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>

            {/* Dias da semana */}
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {weekDays.map(({ date, dateISO, hasSlots, availableCount }) => {
                    const isSelected = selectedDate === dateISO;
                    const isTodayDate = isToday(dateISO);
                    const hasAvailableSlots = availableCount > 0;

                    return (
                        <button
                            key={dateISO}
                            data-date={dateISO}
                            onClick={() => hasSlots && onDateSelect(dateISO)}
                            disabled={!hasSlots}
                            className={`
                flex-shrink-0 w-14 h-16 rounded-lg border transition-all duration-150 touch-manipulation
                flex flex-col items-center justify-center gap-1
                ${isSelected
                                    ? 'bg-primary border-primary text-primary-contrast shadow-soft'
                                    : hasSlots
                                        ? 'bg-card border-muted/20 hover:border-primary/50 hover:bg-surface text-text'
                                        : 'bg-muted/10 border-muted/10 text-muted cursor-not-allowed'
                                }
                ${isTodayDate && !isSelected ? 'ring-2 ring-accent/50' : ''}
              `}
                        >
                            <span className="text-xs font-medium">
                                {format(date, 'EEE')}
                            </span>
                            <span className="text-sm font-semibold">
                                {format(date, 'd')}
                            </span>
                            {hasSlots && (
                                <div className={`w-1 h-1 rounded-full ${hasAvailableSlots ? 'bg-accent' : 'bg-muted'}`} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legenda */}
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    <span>Disponível</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted"></div>
                    <span>Ocupado</span>
                </div>
            </div>
        </div>
    );
}
