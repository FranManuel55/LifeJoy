export const LEVEL_TABLE = [
    { level: 1, minXp: 0 },
    { level: 2, minXp: 100 },
    { level: 3, minXp: 250 },
    { level: 4, minXp: 450 },
    { level: 5, minXp: 700 },
    { level: 6, minXp: 1000 },
    { level: 7, minXp: 1350 },
    { level: 8, minXp: 1750 },
    { level: 9, minXp: 2200 },
    { level: 10, minXp: 2700 },
];

// Función 1: Saber qué nivel soy según mi XP total
export const calculateLevelFromXp = (currentXp) => {
    // Buscamos el nivel más alto cuya minXp sea menor o igual a mi XP
    for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
        if (currentXp >= LEVEL_TABLE[i].minXp) {
            return LEVEL_TABLE[i].level;
        }
    }
    return 1; // Por defecto nivel 1
};

// Función 2: Calcular progreso (%) hacia el siguiente nivel
export const calculateProgressToNextLevel = (currentXp, currentLevel) => {
    if (currentLevel >= 10) return 100; // Nivel máximo

    const currentLevelData = LEVEL_TABLE[currentLevel - 1];
    const nextLevelData = LEVEL_TABLE[currentLevel];

    // Fórmula: (XP_Actual - Min_Nivel_Actual) / (Min_Siguiente - Min_Nivel_Actual) * 100
    const progress = ((currentXp - currentLevelData.minXp) / (nextLevelData.minXp - currentLevelData.minXp)) * 100;

    return Math.min(100, Math.max(0, progress)); // Aseguramos que esté entre 0 y 100
};

// Función 3: Calcular daño por tarea fallada
export const calculatePenalty = (baseDamage, taskCategory, categoriesState) => {
    let finalDamage = baseDamage;

    // 3.1 Buffering por Nivel de la Categoría de la Tarea
    const taskCatLevel = categoriesState[taskCategory]?.level || 1;

    if (taskCatLevel <= 2) {
        // Niveles 1-2: Zona de Peligro (+50%)
        finalDamage = finalDamage * 1.5;
    } else if (taskCatLevel <= 4) {
        // Niveles 3-4: Daño Considerable (+25%)
        finalDamage = finalDamage * 1.25;
    } else if (taskCatLevel <= 6) {
        // Niveles 5-6: Daño Normal (x1) - Sin cambios
        finalDamage = finalDamage;
    } else if (taskCatLevel <= 8) {
        // Niveles 7-8: Daño Levemente Reducido (-10%)
        finalDamage = finalDamage * 0.90;
    } else {
        // Niveles 9-10: Maestría (-25%)
        finalDamage = finalDamage * 0.75;
    }

    // 3.2 Penalización CONSTANTE por mala Salud (Niveles 1-5)
    const healthLevel = categoriesState['health']?.level || 1;

    if (healthLevel <= 5) {
        // Si tienes salud frágil (Lv 1-5), todo duele más (+25%)
        finalDamage = finalDamage * 1.25;
    }

    return Math.ceil(finalDamage);
};

// --- NUEVAS FUNCIONES DE AGREGACIÓN ---

// Función 4: Calcular XP total sumando todas las categorías
export const calculateTotalXp = (categories) => {
    return Object.values(categories).reduce((sum, cat) => sum + cat.xp, 0);
};

// Función 5: Calcular Nivel Promedio del jugador
export const calculateAverageLevel = (categories) => {
    const levels = Object.values(categories).map((cat) => cat.level);
    if (levels.length === 0) return 1;

    const sum = levels.reduce((acc, lvl) => acc + lvl, 0);
    return Math.round(sum / levels.length);
};