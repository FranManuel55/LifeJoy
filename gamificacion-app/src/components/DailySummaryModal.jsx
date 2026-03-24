import { useRef, useEffect } from "react";
import { AlertTriangle, HeartCrack, CheckCircle2, History } from "lucide-react";
import canvasConfetti from 'canvas-confetti';

const DailySummaryModal = ({ report, onClose }) => {
    useEffect(() => {
        if (report && report.damage === 0) {
            canvasConfetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [report]);

    if (!report) return null;

    const isPerfect = report.damage === 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fade-in">
            <div className={`w-full max-w-md bg-gray-900 border ${isPerfect ? 'border-green-900/40' : 'border-red-900/40'} rounded-2xl overflow-hidden animate-bounce-in`}>

                <div className="p-6 text-center">

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isPerfect ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                            {isPerfect ? (
                                <CheckCircle2 className="w-9 h-9 text-green-400" />
                            ) : (
                                <HeartCrack className="w-9 h-9 text-red-500" />
                            )}
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isPerfect ? "¡Día Perfecto!" : "¡Reporte de Daño!"}
                    </h2>

                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-5">
                        <History className="w-4 h-4" />
                        <span>Desde tu última conexión ({report.date})</span>
                    </div>

                    {/* Content */}
                    <div className={`p-4 rounded-xl border mb-6 ${isPerfect ? 'bg-green-950/30 border-green-900/30' : 'bg-red-950/30 border-red-900/30'}`}>
                        {isPerfect ? (
                            <div className="space-y-2">
                                <p className="text-green-300 text-base font-medium">
                                    No perdiste vida.
                                </p>
                                <p className="text-green-400/70 text-sm">
                                    Tus hábitos están seguros. ¡Sigue así!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-red-400 text-sm uppercase tracking-wide font-semibold mb-1">Vida Perdida</p>
                                    <p className="text-5xl font-black text-red-500">-{report.damage}</p>
                                </div>
                                <div className="h-px bg-red-900/30 w-full"></div>
                                <div>
                                    <p className="text-red-200/70 font-medium">
                                        Olvidaste <span className="text-white font-bold">{report.missedCount}</span> tareas diarias.
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Las tareas han sido reiniciadas para hoy.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className={`w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-[0.98] ${isPerfect
                            ? 'bg-green-600 hover:bg-green-500 active:bg-green-700'
                            : 'bg-red-600 hover:bg-red-500 active:bg-red-700'
                            }`}
                    >
                        {isPerfect ? "¡Genial!" : "Aceptar y Continuar"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DailySummaryModal;
