/**
 * gameService.js
 * Servicio centralizado para la interacción con Firestore.
 * Maneja la carga, guardado y suscripción del game state.
 */
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";

// Referencia al documento del game state del usuario
const getDocRef = (uid) => doc(db, "users", uid, "gamestate", "current");

/**
 * Suscribirse a cambios en tiempo real del game state.
 * Retorna una función unsubscribe para limpiar el listener.
 */
export const subscribeToGameState = (uid, onData, onError) => {
    const docRef = getDocRef(uid);

    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            onData(docSnap.data(), true); // data, exists
        } else {
            onData(null, false); // No hay datos
        }
    }, (error) => {
        console.error("Error escuchando Firestore:", error);
        if (onError) onError(error);
    });
};

/**
 * Guardar el game state completo en Firestore.
 * Usa merge para no sobrescribir campos no enviados.
 */
export const saveGameState = async (uid, gameState) => {
    try {
        const docRef = getDocRef(uid);
        await setDoc(docRef, gameState, { merge: true });
    } catch (error) {
        console.error("Error guardando juego:", error);
        throw error;
    }
};

/**
 * Crear el game state inicial para un usuario nuevo.
 */
export const createInitialGameState = async (uid, initialState) => {
    try {
        const docRef = getDocRef(uid);
        const today = new Date().toLocaleDateString("en-CA");
        const newState = { ...initialState, lastLoginDate: today };
        await setDoc(docRef, newState);
        return newState;
    } catch (error) {
        console.error("Error creando estado inicial:", error);
        throw error;
    }
};

/**
 * Resetear el juego a estado inicial.
 */
export const resetGameState = async (uid, initialState) => {
    try {
        const docRef = getDocRef(uid);
        await setDoc(docRef, initialState);
        return initialState;
    } catch (error) {
        console.error("Error reseteando juego:", error);
        throw error;
    }
};

/**
 * Obtener los datos del perfil de un jugador por su UID.
 */
export const getPlayerData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data();
};

/**
 * Mezcla profunda de categorías: fusiona las categorías guardadas
 * en Firestore con las categorías por defecto (initialState).
 * Esto permite agregar nuevas categorías en futuras actualizaciones
 * sin borrar el progreso existente del usuario.
 */
export const mergeCategories = (savedCategories, defaultCategories) => {
    const merged = { ...defaultCategories };

    Object.keys(savedCategories).forEach(key => {
        if (merged[key]) {
            merged[key] = { ...merged[key], ...savedCategories[key] };
        } else {
            merged[key] = savedCategories[key];
        }
    });

    return merged;
};
