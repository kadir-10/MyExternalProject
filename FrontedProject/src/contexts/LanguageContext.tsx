import { createContext, useContext, useState } from "react";

type Language = "tr" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    tr: {
        dashboard: "Ana Sayfa",
        myHabits: "Alışkanlıklarım",
        statistics: "İstatistikler",
        settings: "Ayarlar",
        help: "Yardım",
        search: "Ara",
        logout: "Çıkış Yap",
        account: "Hesap",
        billing: "Faturalama",
        notifications: "Bildirimler",
        theme: "Tema",
        language: "Dil",
        light: "Açık",
        dark: "Koyu",
        newHabit: "Yeni Alışkanlık",
        welcome: "Hoşgeldin",
        totalHabits: "Toplam Alışkanlık",
        activeStreak: "Aktif Streak",
        completed: "Tamamlanan",
        successRate: "Başarı Oranı",
    },
    en: {
        dashboard: "Dashboard",
        myHabits: "My Habits",
        statistics: "Statistics",
        settings: "Settings",
        help: "Help",
        search: "Search",
        logout: "Log out",
        account: "Account",
        billing: "Billing",
        notifications: "Notifications",
        theme: "Theme",
        language: "Language",
        light: "Light",
        dark: "Dark",
        newHabit: "New Habit",
        welcome: "Welcome",
        totalHabits: "Total Habits",
        activeStreak: "Active Streak",
        completed: "Completed",
        successRate: "Success Rate",
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem("language");
        return (saved === "tr" || saved === "en") ? saved : "tr";
    });

    const t = (key: string): string => {
        return translations[language][key as keyof typeof translations.tr] || key;
    };

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
