import { BookOpen, Activity, Home, TrendingUp, Palette, Users } from "lucide-react";

export const CATEGORY_CONFIG = {
    education: {
        id: "education",
        label: "Educación",
        color: "blue", // Azul
        icon: BookOpen,
        description: "Mejorar habilidades y conocimiento"
    },
    health: {
        id: "health",
        label: "Salud",
        color: "red", // Rojo
        icon: Activity,
        description: "Cuidar el cuerpo y la mente"
    },
    home: {
        id: "home",
        label: "Hogar",
        color: "amber", // Ámbar
        icon: Home,
        description: "Mantener el orden y la armonía"
    },
    finances: {
        id: "finances",
        label: "Finanzas",
        color: "emerald", // Esmeralda (Dinero)
        icon: TrendingUp,
        description: "Gestión de recursos y crecimiento"
    },
    hobbies: {
        id: "hobbies",
        label: "Hobbies",
        color: "violet", // Violeta (Creatividad)
        icon: Palette,
        description: "Tiempo libre, creatividad y pasiones"
    },
    social: {
        id: "social",
        label: "Social",
        color: "cyan", // Cian (Conexiones)
        icon: Users,
        description: "Amigos, familia y conexiones"
    }
};

export const getCategoryColor = (categoryId) => {
    return CATEGORY_CONFIG[categoryId]?.color || "gray";
};

export const getCategoryLabel = (categoryId) => {
    return CATEGORY_CONFIG[categoryId]?.label || categoryId;
};
