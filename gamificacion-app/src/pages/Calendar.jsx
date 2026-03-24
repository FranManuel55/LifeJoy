import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, CheckCircle2, XCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const Calendar = () => {
    const { gameState } = useGame();
    const { history = {}, tasks = [] } = gameState;

    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const todayKey = new Date().toLocaleDateString("en-CA");

    const getDateKey = (day) => {
        const d = new Date(year, month, day);
        return d.toLocaleDateString("en-CA");
    };

    // Compute today's live status from current tasks
    const todayLiveStatus = useMemo(() => {
        const dailyTasks = tasks.filter(t => t.frequency === 'daily' || !t.frequency);
        if (dailyTasks.length === 0) return null;

        const completedCount = dailyTasks.filter(t => t.completed).length;
        const failedCount = dailyTasks.filter(t => t.failed).length;
        const totalCount = dailyTasks.length;

        // If no tasks have been interacted with yet today, don't show a status
        if (completedCount === 0 && failedCount === 0) return null;

        const allDone = completedCount === totalCount;
        const hasFailures = failedCount > 0;

        return {
            status: allDone && !hasFailures ? 'perfect' : (hasFailures || completedCount > 0) ? 'in-progress' : null,
            completed: completedCount,
            total: totalCount,
            failed: failedCount,
        };
    }, [tasks]);

    // Build effective history: stored history + live today
    const getEffectiveDay = (dateKey) => {
        if (dateKey === todayKey && todayLiveStatus) {
            return {
                status: todayLiveStatus.status === 'perfect' ? 'perfect' : 'in-progress',
                completed: todayLiveStatus.completed,
                total: todayLiveStatus.total,
                failed: todayLiveStatus.failed,
            };
        }
        return history[dateKey] || null;
    };

    let perfectDays = 0;
    let failedDays = 0;

    for (let i = 1; i <= daysInMonth; i++) {
        const key = getDateKey(i);
        const dayData = getEffectiveDay(key);
        if (dayData) {
            if (dayData.status === 'perfect') perfectDays++;
            else if (dayData.status === 'failed') failedDays++;
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0e1a] p-4 md:p-8 pb-32 text-white overflow-y-auto">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6 flex items-center justify-center gap-3">
                    <CalIcon className="w-8 h-8 text-cyan-400" />
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Historial
                    </h1>
                </div>

                {/* Calendar Card */}
                <div className="bg-gray-900 border border-white/[0.06] rounded-2xl p-5">

                    {/* Month Nav */}
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ChevronLeft />
                        </button>
                        <h2 className="text-xl font-bold">
                            {MONTHS[month]} <span className="text-gray-500 text-base ml-1">{year}</span>
                        </h2>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ChevronRight />
                        </button>
                    </div>

                    {/* Stats Summary */}
                    <div className="flex gap-3 mb-6">
                        <div className="flex-1 bg-green-950/40 border border-green-900/40 rounded-xl p-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-green-400 w-4 h-4" />
                                <span className="text-xs text-green-300 font-medium">Perfectos</span>
                            </div>
                            <span className="text-xl font-black text-green-400">{perfectDays}</span>
                        </div>
                        <div className="flex-1 bg-red-950/40 border border-red-900/40 rounded-xl p-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <XCircle className="text-red-400 w-4 h-4" />
                                <span className="text-xs text-red-300 font-medium">Fallidos</span>
                            </div>
                            <span className="text-xl font-black text-red-400">{failedDays}</span>
                        </div>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 mb-3 text-center">
                        {DAYS.map(d => (
                            <div key={d} className="text-gray-600 text-xs font-semibold uppercase tracking-wider py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-7 gap-1.5 md:gap-3">
                        {/* Empty slots */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                        ))}

                        {/* Days */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateKey = getDateKey(day);
                            const dayData = getEffectiveDay(dateKey);
                            const isToday = dateKey === todayKey;
                            const isFuture = dateKey > todayKey;

                            return (
                                <div
                                    key={day}
                                    className={`
                                        aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all group
                                        ${isFuture ? 'bg-gray-900/30 border border-white/[0.02]' :
                                            isToday
                                                ? 'bg-amber-500/10 border-2 border-amber-500/40 ring-1 ring-amber-500/20'
                                                : 'bg-gray-800/50 border border-white/[0.04]'}
                                        ${dayData?.status === 'perfect' ? '!bg-green-500/15 !border-green-500/40' : ''}
                                        ${dayData?.status === 'failed' ? '!bg-red-500/15 !border-red-500/40' : ''}
                                        ${dayData?.status === 'in-progress' && isToday ? '!bg-amber-500/15 !border-amber-500/40' : ''}
                                    `}
                                >
                                    <span className={`text-sm font-semibold
                                        ${isFuture ? 'text-gray-700' :
                                            isToday ? 'text-white' : 'text-gray-500'}
                                        ${dayData ? '!text-white' : ''}`}>
                                        {day}
                                    </span>

                                    {/* Status Dot */}
                                    {dayData && (
                                        <div className={`mt-0.5 w-1.5 h-1.5 rounded-full
                                            ${dayData.status === 'perfect' ? 'bg-green-400' :
                                                dayData.status === 'in-progress' ? 'bg-amber-400' :
                                                    'bg-red-500'}`}
                                        />
                                    )}

                                    {/* Tooltip: past damage */}
                                    {dayData?.damage > 0 && (
                                        <div className="absolute opacity-0 group-hover:opacity-100 -top-8 bg-red-600 text-white text-xs px-2 py-1 rounded-lg pointer-events-none transition-opacity whitespace-nowrap z-20">
                                            -{dayData.damage} HP
                                        </div>
                                    )}

                                    {/* Tooltip: today's progress */}
                                    {isToday && todayLiveStatus && (
                                        <div className="absolute opacity-0 group-hover:opacity-100 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg pointer-events-none transition-opacity whitespace-nowrap z-20 border border-white/10">
                                            {todayLiveStatus.completed}/{todayLiveStatus.total} misiones
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Calendar;
