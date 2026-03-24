/**
 * dailyResetService.js
 * Servicio que maneja toda la lógica de tiempo:
 * - Detección de cambio de día
 * - Cálculo de daño offline (días sin jugar)
 * - Reset diario y semanal de misiones
 */

/**
 * Helper: Obtener la fecha del día siguiente en formato YYYY-MM-DD.
 */
const getNextDay = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("en-CA");
};

/**
 * Verifica si hay un cambio de día y procesa el reset.
 * Retorna:
 *   - null si NO hubo cambio de día
 *   - { newState, report } si SÍ hubo cambio de día
 *     - newState: el estado actualizado con daño aplicado y tareas reseteadas
 *     - report: { damage, missedCount, date } para mostrar al usuario
 */
export const checkDailyReset = (currentGameState) => {
    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
    const lastLogin = currentGameState.lastLoginDate || today;

    // Si es el mismo día, no hay reset
    if (lastLogin === today) {
        return null;
    }

    console.log(`📅 Nuevo día detectado! Último: ${lastLogin} vs Hoy: ${today}`);

    const newHistory = { ...currentGameState.history };
    let newLife = currentGameState.life;
    const dailyTasks = currentGameState.tasks.filter(t => t.frequency === 'daily' || !t.frequency);

    // Daño máximo diario = suma de TODAS las daily penalties
    const maxDailyDamage = dailyTasks.reduce((acc, t) => acc + (t.penalty || 2), 0);

    // --- RECORRER TODOS LOS DÍAS DESDE lastLogin HASTA AYER ---
    let currentDateIter = lastLogin;

    while (currentDateIter < today) {
        let dayDamage = 0;

        if (currentDateIter === lastLogin) {
            // DÍA DEL ÚLTIMO LOGIN: El daño depende de las tareas que dejó incompletas
            const missedTasks = dailyTasks.filter(t => !t.completed);
            missedTasks.forEach(t => {
                dayDamage += (t.penalty || 2);
            });
        } else {
            // DÍAS INTERMEDIOS (ausencia total): Daño máximo
            dayDamage = maxDailyDamage;
        }

        // Aplicar daño acumulado
        newLife = Math.max(0, newLife - dayDamage);

        // Guardar en historial
        newHistory[currentDateIter] = {
            status: dayDamage > 0 ? 'failed' : 'perfect',
            damage: dayDamage,
            date: currentDateIter
        };

        // Avanzar al siguiente día
        currentDateIter = getNextDay(currentDateIter);
    }

    // --- RESETEAR MISIONES DIARIAS para HOY ---
    const newTasks = currentGameState.tasks.map(t => {
        if (t.frequency === 'daily' || !t.frequency) {
            return {
                ...t,
                completed: false,
                failed: false,
                ...(t.targetCount && t.targetCount > 1 ? { currentCount: 0 } : {})
            };
        }
        return t;
    });

    // --- RESET SEMANAL (si es lunes) ---
    const currentDayOfWeek = new Date().getDay(); // 0=Dom, 1=Lun
    const lastWeeklyReset = currentGameState.lastWeeklyReset || "";

    if (currentDayOfWeek === 1 && lastWeeklyReset !== today) {
        const weeklyTasks = currentGameState.tasks.filter(t => t.frequency === 'weekly');
        weeklyTasks.forEach(t => {
            if (!t.completed) {
                const pen = t.penalty || 8;
                newLife = Math.max(0, newLife - pen);
            }
        });
        // Reset tareas semanales (incluyendo currentCount para repetibles)
        newTasks.forEach(t => {
            if (t.frequency === 'weekly') {
                t.completed = false;
                t.failed = false;
                if (t.targetCount && t.targetCount > 1) t.currentCount = 0;
            }
        });
    }

    // --- GENERAR REPORTE ---
    const totalDamageTaken = currentGameState.life - newLife;
    let report = null;

    if (totalDamageTaken > 0) {
        report = {
            damage: totalDamageTaken,
            missedCount: Math.ceil(totalDamageTaken / 2), // Estimado
            date: lastLogin
        };
    }

    const newState = {
        ...currentGameState,
        life: newLife,
        tasks: newTasks,
        lastLoginDate: today,
        history: newHistory
    };

    return { newState, report };
};
