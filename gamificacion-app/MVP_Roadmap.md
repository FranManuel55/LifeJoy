# 🗺️ Hoja de Ruta - MVP Gamificación de Vida

Esta guía divide el desarrollo en fases pequeñas y manejables para que puedas programar la aplicación paso a paso.

## Fase 1: El Corazón del Juego (Lógica y Estado)
Antes de hacer pantallas bonitas, necesitamos el cerebro que recuerde la Vida, los Niveles y las Tareas.

- [x] **1.1. Crear el `GameContext` (Esqueleto)**
  - [x] Estructura inicial y GameProvider.
  - [x] Estado base (Life, Categories, Tasks).

- [x] **1.2. Implementar la Lógica de Experiencia (XP)**
  - [x] Función `calculateLevelFromXp`.
  - [x] Función `completeTask` conectada en Context.

- [x] **1.3. Implementar la Lógica de Daño (Penalizaciones)**
  * [x] Reglas de juego implementadas en `gameMechanics.js`.
  * [x] Función `failTask` conectada en Context.

---

## Fase 2: Visualización Básica (COMPLETADO)
Conectar el cerebro (Context) con los ojos (UI).

- [x] **2.1. Conectar DashboardPage**
  - [x] Leer estado desde `useGame()`.
  - [x] **DONE:** Refactorizar `DashboardPage` (Container) y `Dashboard` (Presenter).
  - [x] Mostrar Barra de Vida real.
  - [x] Mostrar Tarjetas de Categoría reales (Lista simple implementada).

- [x] **2.2. Mejoras Visuales (Polishing)**
  - [x] PlayerCard con diseño premium (Glassmorphism).
  - [x] Dashboard con fondo y layout mejorado.
  - [x] Mover lista de categorías a componentes dedicados (`CategoryCard`).

---

## Fase 3: Acciones (Jugar) (COMPLETADO)
Poder interactuar con el sistema.

- [x] **3.1. Crear Misiones Reales**
  - [x] Definir una lista de tareas predeterminadas en código (un array de objetos).
  - [x] Botón "Completar" que sume XP y Vida.

- [x] **3.2. Simular Fallos**
  - [x] Botón "Fallar" (o lógica de tiempo) que reste Vida y XP.
  - [x] Verificar que las penalizaciones "duelen" como deben.
  - [x] Implementar estados visuales (Verde/Gris) y Undo.

---

## Fase 4: Persistencia y Pulido (COMPLETADO)
Que el progreso no se pierda al recargar.

- [x] **4.1. Integración con FireStore**
  - [x] Leer datos al iniciar sesión (`useGame` + `useEffect`).
  - [x] Guardar cambios automáticamente.
  - [x] Solucionar "Race Conditions" con `useRef` para evitar sobrescrituras.

- [x] **4.2. Sincronización Visual**
  - [x] Pantalla de carga ("Cargando progreso...") para evitar FOUC (Flash of Unstyled Content).
  - [x] Botón de Reset Debug (para limpiar datos corruptos).

---

## Fase 5: Ciclo de Vida (COMPLETADO)
Cerrar el círculo del juego.

- [x] **5.1. Game Over**
  - Si Vida llega a 0, mostrar pantalla de derrota ("Has muerto").
  - Opción para revivir (coste de XP o renacer nivel 1).

- [x] **5.2. Level Up**
  - Animación de confeti al subir de nivel.
  - Desbloqueo de nuevas misiones (futuro).

---

## Fase 6: Refactoring & Optimization (COMPLETADO)
Limpieza y mejora del código base.

- [x] **6.1. Code Cleanup**
  - [x] Eliminar imports no usados.
  - [x] Eliminar logs de debug.
  - [x] Manejar acciones vacías (Edit/Delete).

---

## Fase 7: Configuraciones (COMPLETADO)
Personaliza tu experiencia.

- [x] **7.1. Selección de Categorías**
  - Switch para activar/desactivar categorías (Salud, Finanzas, Hobbies...).
  - Dashboard y Misiones adaptativos (Solo muestran activas).

- [x] **7.2. Ajustes Generales**
  - Botón de acceso en Dashboard (Tarjeta de Jugador).
  - Menú estructurado con Submenús.
  - Gestión de cierre de sesión integrada.

---

## Fase 8: Gestión de Misiones (COMPLETADO)
Control total sobre tus tareas.

- [x] **8.1. Crear Misiones**
  - Implementar Modal o Formulario de "Añadir Misión".
  - Lógica de frecuencia (Diaria/Semanal/Mensual) con auto-cálculo de XP/Daño. (Regla: Weekly = 40xp/-8hp).
  - Guardar en Firestore.

- [x] **8.2. Editar y Borrar**
  - Poder modificar título/recompensa.
  - Eliminar misiones obsoletas.

---

## Fase 9: Tiempo y Calendario (COMPLETADO)
El juego nunca se detiene.

- [x] **9.1. Lógica de Tiempo ("Daily Check")**
  - Detectar cambio de día (comparar última conexión).
  - Calcular daño por tareas diarias no completadas ayer.
  - Mostrar Modal de "Resumen del Día" (Life Lost).
  - Resetear estado de tareas diarias.

- [x] **9.2. Vista de Calendario**
  - Nueva página `/calendar`.
  - Visualizar historial (Días ganados vs perdidos).

---

## Fase 10: Economía y Recompensas (SIGUIENTE)
Sistema de Oro y Tienda.

---

### 💡 Consejo del Copiloto
Te sugiero empezar por el punto **1.1**. Crea el archivo y define qué datos vas a necesitar guardar. ¡Avísame cuando estés listo para empezar!
