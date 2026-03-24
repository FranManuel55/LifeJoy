import { useState, useEffect } from "react";
import { X, Save, AlertCircle, Repeat } from "lucide-react";
import { useGame } from "../context/GameContext";
import { getCategoryColor, getCategoryLabel, CATEGORY_CONFIG } from "../utils/constants";

const FREQUENCY_RULES = {
    daily: { label: "Diaria", xp: 10, penalty: 2 },
    weekly: { label: "Semanal", xp: 40, penalty: 8 },
    monthly: { label: "Mensual", xp: 150, penalty: 25 },
};

const AddMissionModal = ({ isOpen, onClose, initialData = null, onSave }) => {
    const { gameState } = useGame();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "health",
        frequency: "daily",
        targetCount: 1,
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title || "",
                    description: initialData.description || "",
                    category: initialData.category || "health",
                    frequency: initialData.frequency || "daily",
                    targetCount: initialData.targetCount || 1,
                });
            } else {
                setFormData({
                    title: "",
                    description: "",
                    category: Object.keys(gameState.categories).find(key => gameState.categories[key].isActive) || "health",
                    frequency: "daily",
                    targetCount: 1,
                });
            }
            setError("");
        }
    }, [isOpen, initialData, gameState.categories]);

    const activeCategories = Object.entries(gameState.categories)
        .filter(([_, cat]) => cat.isActive)
        .map(([key, cat]) => ({ id: key, label: cat.label }));

    const currentRule = FREQUENCY_RULES[formData.frequency] || FREQUENCY_RULES.daily;
    const isRepeatable = formData.targetCount > 1;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError("El título es obligatorio");
            return;
        }

        if (formData.targetCount < 1 || formData.targetCount > 30) {
            setError("La cantidad debe estar entre 1 y 30");
            return;
        }

        const missionData = {
            ...formData,
            targetCount: parseInt(formData.targetCount),
            reward: currentRule.xp,
            penalty: currentRule.penalty,
        };

        onSave(missionData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fade-in">
            <div className="bg-gray-900 border border-white/[0.06] w-full max-w-md rounded-2xl overflow-hidden animate-bounce-in">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/[0.06] bg-gray-800/50">
                    <h2 className="text-lg font-bold text-white">
                        {initialData ? "Editar Misión" : "Nueva Misión"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej: Ir al gimnasio"
                            className="w-full bg-gray-800 border border-white/[0.06] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder:text-gray-600"
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Descripción (Opcional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detalles extra..."
                            className="w-full bg-gray-800 border border-white/[0.06] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder:text-gray-600 resize-none h-20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-gray-800 border border-white/[0.06] rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer"
                            >
                                {activeCategories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-gray-900 text-white">
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Frequency */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Frecuencia</label>
                            <select
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                className="w-full bg-gray-800 border border-white/[0.06] rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer"
                            >
                                {Object.entries(FREQUENCY_RULES).map(([key, rule]) => (
                                    <option key={key} value={key} className="bg-gray-900 text-white">
                                        {rule.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Target Count (Repeticiones) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            <span className="flex items-center gap-1.5">
                                <Repeat size={14} className="text-violet-400" />
                                ¿Cuántas veces por período?
                            </span>
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, targetCount: Math.max(1, formData.targetCount - 1) })}
                                className="w-10 h-10 rounded-lg bg-gray-800 border border-white/[0.06] text-white font-bold text-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                            >
                                −
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={formData.targetCount}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 1;
                                        setFormData({ ...formData, targetCount: Math.min(30, Math.max(1, val)) });
                                    }}
                                    className="w-full bg-gray-800 border border-white/[0.06] rounded-xl px-4 py-2.5 text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, targetCount: Math.min(30, formData.targetCount + 1) })}
                                className="w-10 h-10 rounded-lg bg-gray-800 border border-white/[0.06] text-white font-bold text-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                        {isRepeatable && (
                            <p className="text-xs text-violet-400/70 mt-2 flex items-center gap-1">
                                <Repeat size={12} />
                                La misión se completará al llegar a {formData.targetCount} veces ({FREQUENCY_RULES[formData.frequency]?.label.toLowerCase()})
                            </p>
                        )}
                    </div>

                    {/* Stats Preview */}
                    <div className="p-4 rounded-xl border border-amber-900/30 bg-amber-950/20 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="text-white/90 font-medium">Recompensas:</p>
                            <ul className="text-gray-400 mt-1 space-y-1">
                                <li>✨ <strong className="text-amber-400">+{currentRule.xp} XP</strong> al completar{isRepeatable ? ` (las ${formData.targetCount} veces)` : ''}</li>
                                <li>❤️ <strong className="text-red-400">-{currentRule.penalty} Vida</strong> al fallar</li>
                            </ul>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center font-medium">
                            {error}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="pt-1">
                        <button
                            type="submit"
                            className="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {initialData ? "Guardar Cambios" : "Crear Misión"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddMissionModal;
