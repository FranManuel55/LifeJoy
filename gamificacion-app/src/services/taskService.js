/**
 * taskService.js
 * Servicio que encapsula toda la lógica de negocio para las misiones/tareas.
 * Cada función recibe el estado actual y retorna el nuevo estado (puro, sin side-effects).
 */
import { calculateLevelFromXp, calculatePenalty } from "../utils/gameMechanics";

/**
 * Procesa el toggle de completar/desmarcar una tarea.
 * Retorna el nuevo gameState actualizado.
 */
export const processTaskCompletion = (gameState, taskId, taskCategory, xpReward, lifeReward = 0) => {
    const task = gameState.tasks.find(t => t.id === taskId);
    if (!task) return { newState: gameState, levelUp: null };

    const isCompleting = !task.completed;
    let newLife = gameState.life;
    let actualLifeGained = 0;

    // --- LÓGICA DE VIDA ---
    if (isCompleting) {
        const potentialLife = gameState.life + lifeReward;
        newLife = Math.min(100, potentialLife);
        actualLifeGained = newLife - gameState.life;
    } else {
        const lifeToRevert = task.lifeGained !== undefined ? task.lifeGained : lifeReward;
        newLife = Math.max(0, gameState.life - lifeToRevert);
    }

    // --- LÓGICA DE XP ---
    const multiplier = isCompleting ? 1 : -1;
    const currentCategoryState = gameState.categories[taskCategory];
    const newXp = Math.max(0, currentCategoryState.xp + (xpReward * multiplier));
    const newLevel = calculateLevelFromXp(newXp);

    // --- DETECCIÓN DE LEVEL UP ---
    let levelUp = null;
    if (isCompleting && newLevel > currentCategoryState.level) {
        levelUp = {
            categoryKey: taskCategory,
            label: currentCategoryState.label,
            level: newLevel
        };
    }

    // --- ACTUALIZAR TAREAS ---
    const newTasks = gameState.tasks.map(t =>
        t.id === taskId ? {
            ...t,
            completed: isCompleting,
            lifeGained: isCompleting ? actualLifeGained : 0
        } : t
    );

    const newState = {
        ...gameState,
        life: newLife,
        tasks: newTasks,
        categories: {
            ...gameState.categories,
            [taskCategory]: {
                ...currentCategoryState,
                xp: newXp,
                level: newLevel
            }
        }
    };

    return { newState, levelUp };
};

/**
 * Procesa el incremento de progreso en una misión repetible.
 * Cuando currentCount alcanza targetCount, se auto-completa con recompensas.
 * Retorna { newState, levelUp, justCompleted }.
 */
export const processRepeatableProgress = (gameState, taskId) => {
    const task = gameState.tasks.find(t => t.id === taskId);
    if (!task || !task.targetCount) return { newState: gameState, levelUp: null, justCompleted: false };

    // Si ya está completada o fallada, no hacer nada
    if (task.completed || task.failed) return { newState: gameState, levelUp: null, justCompleted: false };

    const newCount = (task.currentCount || 0) + 1;
    const justCompleted = newCount >= task.targetCount;

    let newLife = gameState.life;
    let actualLifeGained = 0;
    let levelUp = null;
    let newXp, newLevel;
    const currentCategoryState = gameState.categories[task.category];

    if (justCompleted) {
        // Auto-completar: dar recompensas completas
        let lifeReward = 1;
        if (task.frequency === 'weekly') lifeReward = 3;
        if (task.frequency === 'monthly') lifeReward = 8;

        const potentialLife = gameState.life + lifeReward;
        newLife = Math.min(100, potentialLife);
        actualLifeGained = newLife - gameState.life;

        const xpReward = task.reward || 10;
        newXp = Math.max(0, currentCategoryState.xp + xpReward);
        newLevel = calculateLevelFromXp(newXp);

        if (newLevel > currentCategoryState.level) {
            levelUp = {
                categoryKey: task.category,
                label: currentCategoryState.label,
                level: newLevel
            };
        }
    }

    // Actualizar tarea
    const newTasks = gameState.tasks.map(t =>
        t.id === taskId ? {
            ...t,
            currentCount: newCount,
            completed: justCompleted,
            lifeGained: justCompleted ? actualLifeGained : 0
        } : t
    );

    const newState = {
        ...gameState,
        life: newLife,
        tasks: newTasks,
        ...(justCompleted ? {
            categories: {
                ...gameState.categories,
                [task.category]: {
                    ...currentCategoryState,
                    xp: newXp,
                    level: newLevel
                }
            }
        } : {})
    };

    return { newState, levelUp, justCompleted };
};

/**
 * Deshace el progreso en una misión repetible.
 * Resta 1 a currentCount. Si la misión estaba completada, revierte las recompensas.
 */
export const undoRepeatableProgress = (gameState, taskId) => {
    const task = gameState.tasks.find(t => t.id === taskId);
    if (!task || !task.targetCount || task.currentCount === 0) return { newState: gameState };

    if (task.failed) return { newState: gameState };

    const wasCompleted = task.completed;
    const newCount = task.currentCount - 1;

    let newLife = gameState.life;
    let newXp = gameState.categories[task.category].xp;
    let newLevel = gameState.categories[task.category].level;
    const currentCategoryState = gameState.categories[task.category];

    if (wasCompleted) {
        // Revertir recompensas de vida
        const lifeToRevert = task.lifeGained !== undefined ? task.lifeGained : 0;
        newLife = Math.max(0, gameState.life - lifeToRevert);

        // Revertir XP
        const xpToRevert = task.reward || 10;
        newXp = Math.max(0, currentCategoryState.xp - xpToRevert);
        newLevel = calculateLevelFromXp(newXp);
    }

    const newTasks = gameState.tasks.map(t =>
        t.id === taskId ? {
            ...t,
            currentCount: newCount,
            completed: false,
            lifeGained: 0
        } : t
    );

    const newState = {
        ...gameState,
        life: newLife,
        tasks: newTasks,
        ...(wasCompleted ? {
            categories: {
                ...gameState.categories,
                [task.category]: {
                    ...currentCategoryState,
                    xp: newXp,
                    level: newLevel
                }
            }
        } : {})
    };

    return { newState };
};

/**
 * Procesa el fallo de una tarea.
 * Aplica penalización de vida según las reglas del juego.
 * Retorna el nuevo gameState actualizado.
 */
export const processTaskFailure = (gameState, taskId, taskCategory, lifePenalty) => {
    const task = gameState.tasks.find(t => t.id === taskId);
    if (!task) return gameState;

    const isFailing = !task.failed;
    let newLife = gameState.life;

    if (isFailing) {
        const baseDamage = lifePenalty;
        const damage = calculatePenalty(baseDamage, taskCategory, gameState.categories);
        newLife = Math.max(0, gameState.life - damage);
    } else {
        const damageToRevert = task.lifeLost !== undefined ? task.lifeLost : 0;
        newLife = Math.min(100, gameState.life + damageToRevert);
    }

    const actualLifeLost = gameState.life - newLife;

    const newTasks = gameState.tasks.map(t =>
        t.id === taskId ? {
            ...t,
            failed: isFailing,
            completed: isFailing,
            lifeLost: isFailing ? actualLifeLost : 0
        } : t
    );

    return {
        ...gameState,
        life: newLife,
        tasks: newTasks
    };
};

/**
 * Agregar una nueva misión al game state.
 * Si tiene targetCount > 1, se inicializa como misión repetible con currentCount = 0.
 */
export const addTaskToState = (gameState, missionData) => {
    const newMission = {
        ...missionData,
        id: Date.now(),
        completed: false,
        failed: false,
        ...(missionData.targetCount && missionData.targetCount > 1
            ? { currentCount: 0 }
            : {})
    };

    return {
        ...gameState,
        tasks: [...gameState.tasks, newMission]
    };
};

/**
 * Editar una misión existente.
 */
export const editTaskInState = (gameState, taskId, updatedData) => {
    return {
        ...gameState,
        tasks: gameState.tasks.map(t =>
            t.id === taskId ? { ...t, ...updatedData } : t
        )
    };
};

/**
 * Eliminar una misión del game state.
 */
export const deleteTaskFromState = (gameState, taskId) => {
    return {
        ...gameState,
        tasks: gameState.tasks.filter(t => t.id !== taskId)
    };
};

/**
 * Alternar el estado activo/inactivo de una categoría.
 */
export const toggleCategoryInState = (gameState, categoryId) => {
    const currentCat = gameState.categories[categoryId];
    if (!currentCat) return gameState;

    return {
        ...gameState,
        categories: {
            ...gameState.categories,
            [categoryId]: {
                ...currentCat,
                isActive: !currentCat.isActive
            }
        }
    };
};
