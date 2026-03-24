import React from 'react';
import { RefreshCw, Skull } from 'lucide-react';

const GameOverScreen = ({ onReset }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-[#050810] flex flex-col items-center justify-center p-6 animate-fade-in text-center">

            {/* Ambient Red Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/30 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-md w-full">

                {/* Icon */}
                <div className="mb-8 p-6 bg-red-500/10 rounded-2xl border border-red-900/50">
                    <Skull className="w-20 h-20 text-red-500" />
                </div>

                <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
                    FIN DEL JUEGO
                </h1>

                <p className="text-xl text-red-400 font-medium mb-8">
                    Has agotado tu energía vital.
                </p>

                <p className="text-gray-500 mb-10 leading-relaxed">
                    Tu progreso se ha perdido. Todo viaje tiene un final, pero cada final es un nuevo comienzo.
                    <br />
                    <span className="text-red-500/80 text-sm mt-2 block font-bold uppercase tracking-widest border-t border-red-900/30 pt-4">
                        Reinicio Total
                    </span>
                </p>

                <button
                    onClick={onReset}
                    className="group relative px-8 py-4 bg-red-600 hover:bg-red-500 active:bg-red-700 active:scale-[0.98] text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-sm flex items-center gap-3"
                >
                    <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                    Reiniciar Viaje
                </button>
            </div>
        </div>
    );
};

export default GameOverScreen;
