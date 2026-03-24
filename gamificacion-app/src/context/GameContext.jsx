import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

// Servicios
import { subscribeToGameState, saveGameState, createInitialGameState, resetGameState, mergeCategories } from "../services/gameService";
import { processTaskCompletion, processTaskFailure, processRepeatableProgress, undoRepeatableProgress, addTaskToState, editTaskInState, deleteTaskFromState, toggleCategoryInState } from "../services/taskService";
import { checkDailyReset } from "../services/dailyResetService";

// Estado inicial de referencia
const initialState = {
    life: 100,
    level: 1,
    categories: {
        education: { level: 1, xp: 0, label: "Educación", isActive: true },
        health: { level: 1, xp: 0, label: "Salud", isActive: true },
        home: { level: 1, xp: 0, label: "Hogar", isActive: true },
        finances: { level: 1, xp: 0, label: "Finanzas", isActive: true },
        hobbies: { level: 1, xp: 0, label: "Hobbies", isActive: true },
        social: { level: 1, xp: 0, label: "Social", isActive: true },
    },
    tasks: [
        {
            id: 1,
            title: "Leer 10 páginas",
            description: "Leer un libro de desarrollo personal o técnico",
            category: "education",
            reward: 10,
            penalty: 2,
            completed: false,
        },
        {
            id: 2,
            title: "Entrenamiento 30m",
            description: "Hacer ejercicio físico (correr, pesas, yoga)",
            category: "health",
            reward: 20,
            penalty: 5,
            completed: false,
        },
        {
            id: 3,
            title: "Limpiar habitación",
            description: "Mantener el orden en el espacio de trabajo/dormitorio",
            category: "home",
            reward: 15,
            penalty: 3,
            completed: false,
        },
    ],
    history: {},
};

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState(initialState);
    const [loadingGame, setLoadingGame] = useState(true);
    const [levelUpData, setLevelUpData] = useState(null);
    const [dailyReport, setDailyReport] = useState(null);
    const isSyncing = useRef(true);

    const { user } = useAuth();

    // =============================================
    // EFECTO 1: Suscripción a Firestore (tiempo real)
    // =============================================
    useEffect(() => {
        if (!user) {
            setGameState(initialState);
            setLoadingGame(false);
            isSyncing.current = false;
            return;
        }

        setLoadingGame(true);
        isSyncing.current = true;

        const unsubscribe = subscribeToGameState(
            user.uid,
            (data, exists) => {
                if (exists && data) {
                    // Mezcla profunda de categorías
                    const mergedCategories = mergeCategories(
                        data.categories || {},
                        initialState.categories
                    );

                    let loadedState = {
                        ...initialState,
                        ...data,
                        categories: mergedCategories
                    };

                    // Daily reset solo en la primera carga
                    if (loadingGame) {
                        const resetResult = checkDailyReset(loadedState);
                        if (resetResult) {
                            loadedState = resetResult.newState;
                            // Guardar inmediato para que la DB quede al día
                            saveGameState(user.uid, resetResult.newState);
                            // Mostrar reporte si hay daño
                            if (resetResult.report) {
                                setDailyReport(resetResult.report);
                            }
                        }
                    }

                    setGameState(loadedState);
                } else {
                    // Usuario nuevo: crear estado inicial
                    createInitialGameState(user.uid, initialState).then(newState => {
                        setGameState(newState);
                    });
                }

                setLoadingGame(false);
                setTimeout(() => { isSyncing.current = false; }, 500);
            },
            (error) => {
                console.error("Error escuchando Firestore:", error);
                setLoadingGame(false);
                isSyncing.current = false;
            }
        );

        return () => unsubscribe();
    }, [user]);

    // =============================================
    // EFECTO 2: Auto-guardado con debounce
    // =============================================
    useEffect(() => {
        if (!user || isSyncing.current) return;

        const timeoutId = setTimeout(() => {
            saveGameState(user.uid, gameState);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [gameState, user]);

    // =============================================
    // ACCIONES DEL JUEGO (delegan a servicios)
    // =============================================

    const closeLevelUpModal = () => setLevelUpData(null);

    const toggleTaskCompletion = (taskId, taskCategory, xpReward, lifeReward = 0) => {
        setGameState((prev) => {
            const { newState, levelUp } = processTaskCompletion(
                prev, taskId, taskCategory, xpReward, lifeReward
            );

            // Celebración de level up (con delay para dramatismo)
            if (levelUp) {
                setTimeout(() => setLevelUpData(levelUp), 500);
            }

            return newState;
        });
    };

    const failTask = (taskId, taskCategory, lifePenalty) => {
        setGameState((prev) => processTaskFailure(prev, taskId, taskCategory, lifePenalty));
    };

    const resetGame = async () => {
        if (user) {
            await resetGameState(user.uid, initialState);
        }
        setGameState(initialState);
    };

    const toggleCategory = (categoryId) => {
        setGameState(prev => toggleCategoryInState(prev, categoryId));
    };

    const addMission = (mission) => {
        setGameState(prev => addTaskToState(prev, mission));
    };

    const editMission = (id, updatedMission) => {
        setGameState(prev => editTaskInState(prev, id, updatedMission));
    };

    const deleteMission = (id) => {
        setGameState(prev => deleteTaskFromState(prev, id));
    };

    const incrementRepeatableTask = (taskId) => {
        setGameState((prev) => {
            const { newState, levelUp } = processRepeatableProgress(prev, taskId);

            if (levelUp) {
                setTimeout(() => setLevelUpData(levelUp), 500);
            }

            return newState;
        });
    };

    const decrementRepeatableTask = (taskId) => {
        setGameState((prev) => {
            const { newState } = undoRepeatableProgress(prev, taskId);
            return newState;
        });
    };

    // =============================================
    // PROVIDER
    // =============================================
    return (
        <GameContext.Provider
            value={{
                gameState,
                toggleTaskCompletion,
                failTask,
                resetGame,
                loadingGame,
                levelUpData,
                closeLevelUpModal,
                toggleCategory,
                dailyReport,
                closeDailyReport: () => setDailyReport(null),
                addMission,
                editMission,
                deleteMission,
                incrementRepeatableTask,
                decrementRepeatableTask
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);