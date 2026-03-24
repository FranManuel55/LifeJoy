/**
 * Cloud Functions para LifeJoy
 * 
 * Funciones server-side para validación y lógica crítica del juego.
 * Estas funciones se ejecutan en Firebase y NO pueden ser manipuladas
 * por el usuario desde el navegador.
 */
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// =============================================
// TABLA DE NIVELES (misma que en el frontend)
// =============================================
const LEVEL_TABLE = [
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

const calculateLevelFromXp = (currentXp) => {
    for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
        if (currentXp >= LEVEL_TABLE[i].minXp) {
            return LEVEL_TABLE[i].level;
        }
    }
    return 1;
};

// =============================================
// 1. CALLABLE: Validar y procesar completar tarea
// El cliente llama esta función, el servidor valida
// =============================================
exports.completeTask = onCall({ region: "southamerica-west1" }, async (request) => {
    // Verificar autenticación
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "Debes iniciar sesión.");
    }

    const uid = request.auth.uid;
    const { taskId, taskCategory, xpReward, lifeReward } = request.data;

    // Validar parámetros
    if (!taskId || !taskCategory || xpReward === undefined) {
        throw new HttpsError("invalid-argument", "Faltan parámetros requeridos.");
    }

    // Obtener estado actual
    const docRef = db.collection("users").doc(uid).collection("gamestate").doc("current");
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        throw new HttpsError("not-found", "No se encontró el estado del juego.");
    }

    const gameState = docSnap.data();
    const task = gameState.tasks?.find(t => t.id === taskId);

    if (!task) {
        throw new HttpsError("not-found", "Tarea no encontrada.");
    }

    // Procesar completar
    const isCompleting = !task.completed;
    let newLife = gameState.life;
    let actualLifeGained = 0;

    if (isCompleting) {
        newLife = Math.min(100, gameState.life + (lifeReward || 0));
        actualLifeGained = newLife - gameState.life;
    }

    const currentCat = gameState.categories[taskCategory];
    const multiplier = isCompleting ? 1 : -1;
    const newXp = Math.max(0, (currentCat?.xp || 0) + (xpReward * multiplier));
    const newLevel = calculateLevelFromXp(newXp);

    // Actualizar tareas
    const newTasks = gameState.tasks.map(t =>
        t.id === taskId ? {
            ...t,
            completed: isCompleting,
            lifeGained: isCompleting ? actualLifeGained : 0
        } : t
    );

    // Guardar
    await docRef.update({
        life: newLife,
        tasks: newTasks,
        [`categories.${taskCategory}.xp`]: newXp,
        [`categories.${taskCategory}.level`]: newLevel
    });

    return {
        success: true,
        newLife,
        newXp,
        newLevel,
        levelUp: isCompleting && newLevel > (currentCat?.level || 1)
    };
});

// =============================================
// 2. TRIGGER: Validar game state al escribir
// Se ejecuta automáticamente cuando hay una escritura
// =============================================
exports.validateGameState = onDocumentWritten(
    {
        document: "users/{userId}/gamestate/{docId}",
        region: "southamerica-west1"
    },
    async (event) => {
        const afterData = event.data?.after?.data();
        if (!afterData) return; // Documento eliminado, no validamos

        let needsUpdate = false;
        const updates = {};

        // Validar vida en rango 0-100
        if (afterData.life !== undefined) {
            if (afterData.life < 0) {
                updates.life = 0;
                needsUpdate = true;
            } else if (afterData.life > 100) {
                updates.life = 100;
                needsUpdate = true;
            }
        }

        // Validar XP no negativa en categorías
        if (afterData.categories) {
            Object.entries(afterData.categories).forEach(([key, cat]) => {
                if (cat.xp < 0) {
                    updates[`categories.${key}.xp`] = 0;
                    updates[`categories.${key}.level`] = 1;
                    needsUpdate = true;
                }
                // Recalcular nivel si no coincide
                const expectedLevel = calculateLevelFromXp(cat.xp || 0);
                if (cat.level !== expectedLevel) {
                    updates[`categories.${key}.level`] = expectedLevel;
                    needsUpdate = true;
                }
            });
        }

        // Si hay correcciones, aplicarlas
        if (needsUpdate) {
            console.log("⚠️ Corrigiendo datos inconsistentes:", updates);
            await event.data.after.ref.update(updates);
        }
    }
);

// =============================================
// 3. SCHEDULED: Reset diario automático (00:05 hora Argentina)
// Se ejecuta cada día a las 00:05 para procesar penalizaciones
// de todos los usuarios que no entraron ese día
// =============================================
exports.scheduledDailyReset = onSchedule(
    {
        schedule: "5 0 * * *",
        timeZone: "America/Argentina/Buenos_Aires",
        region: "southamerica-west1"
    },
    async (event) => {
        console.log("🕐 Ejecutando reset diario programado...");

        const today = new Date().toLocaleDateString("en-CA");

        // Buscar todos los usuarios que no se han logueado hoy
        const usersSnap = await db.collection("users").get();

        let processedCount = 0;

        for (const userDoc of usersSnap.docs) {
            const uid = userDoc.id;
            const gameRef = db.collection("users").doc(uid).collection("gamestate").doc("current");
            const gameSnap = await gameRef.get();

            if (!gameSnap.exists) continue;

            const gameData = gameSnap.data();

            // Solo procesar si no se logueó hoy
            if (gameData.lastLoginDate === today) continue;

            const dailyTasks = (gameData.tasks || []).filter(
                t => t.frequency === 'daily' || !t.frequency
            );

            const missedTasks = dailyTasks.filter(t => !t.completed);
            let dayDamage = 0;

            missedTasks.forEach(t => {
                dayDamage += (t.penalty || 2);
            });

            if (dayDamage > 0) {
                const newLife = Math.max(0, (gameData.life || 100) - dayDamage);
                const history = gameData.history || {};

                history[gameData.lastLoginDate || today] = {
                    status: 'failed',
                    damage: dayDamage,
                    date: gameData.lastLoginDate || today
                };

                // Reset tareas diarias
                const newTasks = (gameData.tasks || []).map(t => {
                    if (t.frequency === 'daily' || !t.frequency) {
                        return { ...t, completed: false, failed: false };
                    }
                    return t;
                });

                await gameRef.update({
                    life: newLife,
                    tasks: newTasks,
                    history: history,
                    lastLoginDate: today
                });

                processedCount++;
                console.log(`  ✅ Usuario ${uid}: -${dayDamage} HP (Life: ${newLife})`);
            }
        }

        console.log(`🏁 Reset diario completado. ${processedCount} usuarios procesados.`);
    }
);
