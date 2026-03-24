# 📘 PROYECTO LIFEJOY - Game Design Document (GDD)
**(Gamificación de la Vida - Web Mobile App)**

---

## 🌟 1. Visión y Filosofía
El objetivo de **LifeJoy** no es solo ser una lista de tareas (To-Do List), sino un **RPG de la vida real**.
Transforma la rutina en una aventura donde el usuario es el protagonista.
*   **Meta**: Mantener un "Personaje" (tu vida) equilibrado y en crecimiento.
*   **Enfoque**: Balance entre áreas (Salud, Educación, Hogar, etc.) para evitar el "Game Over" (Burnout/Descuido).

---

## ⚙️ 2. Mecánicas de Juego (Core Loop)

### 2.1 Sistema de Vida (HP)
El indicador principal de bienestar.
*   **Rango**: 0 - 100 HP.
*   **Estado Inicial**: 100 HP.
*   **Recuperación**: La vida **NO** se regenera pasivamente ni durmiendo. Solo se gana completando misiones con disciplina.
*   **GAME OVER (Muerte Permanente)**:
    *   Si la vida llega a **0**, el jugador pierde **TODO**.
    *   **Consecuencia**: Reset a Nivel 1, 0 XP en todas las categorías. Borrón y cuenta nueva. Sin piedad.

### 2.2 Áreas de Vida (Categorías)
El usuario progresa en distintas dimensiones. Cada categoría es independiente.

**Categorías Base:**
1.  🧠 **Educación** (Intelecto, Carrera)
2.  💪 **Salud** (Físico, Mental) - *Categoría Crítica*
3.  🏠 **Hogar** (Entorno, Orden)
4.  💰 **Finanzas** (Ahorro, Inversión)
5.  🎨 **Hobbies** (Creatividad, Ocio)
6.  👥 **Social** (Relaciones, Networking)

> **Nota**: Desde la **Configuración**, el usuario puede Activar/Desactivar estas categorías para adaptar el juego a su foco actual.

### 2.2.1 Mecánica de "Cuerpo Frágil" 💔
La salud física es la base de todo. Si descuidas tu cuerpo, tu mente es más débil.
*   **Regla**: Si el Nivel de la categoría **SALUD** es **1, 2, 3, 4 o 5**:
    *   **Penalización**: Recibes un **+25% de Daño Extra** de cualquier fuente.
    *   *Ejemplo*: Fallar una tarea de Finanzas que haría 10 de daño, te hará 12.5 (redondeado a 13).
*   **Incentivo**: Mantener Salud en Nivel 6+ es prioritario para sobrevivir en niveles altos.

## 🚨 Regla especial – Salud

* **Niveles 1-5 (Estado Crítico/Frágil):**
  * Las penalizaciones generales (de cualquier tarea) aumentan un 25%.
  * La recuperación de vida es normal.
* **Niveles 6-10 (Estado Saludable):**
  * No hay penalización extra.
  * Bonificación de recuperación de vida (+10%).

Esto obliga al jugador a cuidar su salud.


### 2.3 Progresión (XP y Niveles)
Cada área de vida tiene su propia barra de experiencia.

| Nivel | XP Requerida |    Estado   |
| :--   | :--          | :--         |
| 1     | 0            | Novato      |
| 2     | 100          | Aprendiz    |
| 3     | 250          | Iniciado    |
| 4     | 450          | Practicante |
| 5     | 700          | Competente  |
| 6     | 1000         | Experto     |
| 7     | 1350         | Maestro     |
| 8     | 1750         | Gran Maestro|
| 9     | 2200         | Leyenda     |
| 10    | 2700         | Deidad      |
 
* Subir de nivel **no es decorativo**
* Representa qué tan bien está el jugador en esa área
* Si los puntos bajan, el nivel puede bajar

---

## 📝 Sistema de Tareas (conceptual)

Las tareas pertenecen a una categoría y a un tipo:

### Tipos de tareas

* **Diarias**
* **Semanales**
* **Semanales repetibles (con objetivo)**
   * Ejemplo: "Ir al gimnasio 3 veces".
   * Si no se cumple la cantidad mínima (3/3) al final de la semana, cuenta como fallo.
* **Mensuales**

Cada tarea tiene:

* Puntos que suma si se cumple
* Penalización de vida si no se cumple

### Balance de tareas

| Tipo              | Puntos | Vida perdida |
| ----------------- | ------ | ------------ |
| Diaria            | +10    | −2           |
| Semanal           | +40    | −8           |
| Semanal repetible | +25    | −5           |
| Mensual           | +150   | −25          |

---

## 💻 3. Arquitectura Técnica

### 3.1 Stack
*   **Frontend**: React + Vite + TailwindCSS.
*   **Base de Datos**: Firebase Firestore (NoSQL, Tiempo Real).
*   **Auth**: Firebase Auth (Google).

### 3.2 Persistencia y Estabilidad w/ GameContext
*   **Deep Merge (Mezcla Profunda)**: El sistema fusiona inteligentemente los datos de la nube con la configuración local. Esto permite añadir nuevas categorías en futuras actualizaciones sin borrar el progreso existente del usuario.
*   **Race Conditions**: Uso de `useRef` para impedir que la aplicación sobrescriba la base de datos antes de haber terminado de cargar la partida.

## ⚠️ Sistema de Penalizaciones (Actualizado)

Cuando una tarea no se cumple:

1. Se pierden los puntos que la tarea habría otorgado (XP negativa).
   * **Esto puede causar bajar de nivel.**
2. Se pierde vida.
3. La penalización de vida se evalúa según el **nivel de la categoría de la tarea**:
   * **Niveles 1-2:** Daño aumentado (+50%). "Zona de peligro".
   * **Niveles 3-4:** Daño considerable (+25%).
   * **Niveles 5-6:** Daño normal.
   * **Niveles 7-8:** Daño muy reducido (-10%).
   * **Niveles 9-10:** Daño mínimo (-25%). "Maestría".

Esto obliga al usuario a no descuidar ninguna categoría específica.

*   **Niveles 9-10:** Daño mínimo (-25%). "Maestría".

Esto obliga al usuario a no descuidar ninguna categoría específica.

---

## ⏳ Mecánicas de Tiempo y Calendario (Nuevo)

Para que el juego tenga continuidad, el tiempo es un factor clave.

### 1. Vencimiento de Misiones
*   **Diarias**:
    *   Vencen cada noche a las **00:00**.
    *   Si no se completaron: Se marcan como **Fallidas** (pierdes vida) y se reinician (se desmarcan) para el nuevo día.
*   **Semanales**:
    *   Vencen el **Domingo a las 23:59**.
    *   Si no se completaron: Se marcan como **Fallidas** y se reinician.

### 2. "Daño Offline" (Reporte Diario)
Si el usuario no entra a la app en un día, el juego sigue corriendo.
*   Al abrir la app en un nuevo día, el sistema detecta la ausencia.
*   **Cálculo**: (Tareas Diarias no hechas) * (Daño promedio).
*   **Notificación**: Muestra un resumen: "Mientras dormías perdiste **X puntos de vida** por tareas olvidadas".

---

## 🔁 Recuperación de Vida

La vida solo se recupera mediante acciones positivas:

| Acción                     | Vida recuperada |
| -------------------------- | --------------- |
| Completar tarea diaria     | +1              |
| Completar tarea semanal    | +3              |
| Completar tarea mensual    | +8              |
| Racha de 7 días sin fallar | +5              |

La vida nunca puede superar 100.

---

## 📱 4. Funcionalidades Activas (MVP Completo)

### 4.1 Dashboard
*   **Player Card**: Resumen visual de Nivel Global, Avatar y XP.
*   **Smart Grid**: Muestra las tarjetas de categorías (Educación, Salud, etc.).
    *   *Filtro*: Solo renderiza las categorías que el usuario tiene activas en Configuración.

### 4.2 Centro de Misiones
*   **Gestión de Tareas**: Lista de misiones disponibles para las áreas activas.
*   **Feedback Visual Real**:
    *   ✅ **Éxito**: Confeti, sonido (futuro), barra de XP subiendo.
    *   ❌ **Fallo**: Pantalla sacudida (futuro), barra de vida bajando, estado "Fallo" irreversible manual.

### 4.3 Configuración Modular
*   **Áreas de Vida**: El usuario puede apagar categorías (ej: "Hogar") si no quiere jugar con ellas temporalmente. El progreso se guarda en "segundo plano".
*   **Sesión**: Logout seguro.

---

## 🧪 5. Laboratorio de Ideas (Roadmap & Backlog)

### 4.4 Gestión de Misiones (Completo)
*   **CRUD Total**: Crear, Editar, Eliminar misiones.
*   **Lógica de Frecuencia**: Cálculo automático de XP/Daño según si es diaria/semanal.

### 4.5 Calendario (Completo)
*   **Historial**: Visualización de días ganados/perdidos.
*   **Reset Automático**: Lógica de "Daily Reset" y cálculo de daño offline.

---

## 🧪 5. Laboratorio de Ideas (Roadmap & Backlog)

### 🔨 En Desarrollo (Próximo Paso)
*   [ ] **Economía y Tienda**:
    *   Sistema de Oro (Gold).
    *   Tienda de recompensas (Cosméticos, Seguros de vida, Pociones de recuperación).

### 🔮 Conceptos Futuros (Sugerencias)
Estas ideas están aprobadas para exploración futura:

1.  **Misiones Especiales de Recuperación**:
    *   Tareas de alta dificultad ("Correr 10k", "Leer un libro entero") diseñadas específicamente para recuperar grandes cantidades de vida cuando estás en peligro.
2.  **Categorías de Prestigio (Ocultas)**:
    *   Desbloquear nuevas áreas (ej: "Liderazgo", "Espiritualidad") al alcanzar el Nivel 10 en categorías base.
3.  **Economía y Oro (Opcional)**:
    *   Posible implementación de una moneda virtual para comprar cosméticos o "seguros de vida".
4.  **Sistema de Rachas (Streaks)**:
    *   Mecánica por definir para premiar la consistencia diaria.
