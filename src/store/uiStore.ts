import { create } from 'zustand';

export type ActiveTab = 
  | 'dashboard'
  | 'teams'
  | 'players'
  | 'staff'
  | 'attendance'
  | 'training'
  | 'matches'
  | 'reports'
  | 'notifications'
  | 'settings';

interface UIState {
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  activeTab: ActiveTab;
  sidebarOpen: boolean;
  notificationDrawerOpen: boolean;
  initializeUI: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  setActiveTab: (tab: ActiveTab) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  language: 'en',
  activeTab: 'dashboard',
  sidebarOpen: true,
  notificationDrawerOpen: false,

  initializeUI: () => {
    if (typeof window !== 'undefined') {
      const storedTheme = (localStorage.getItem('volleyclub-theme') || 'dark') as 'light' | 'dark';
      const storedLang = (localStorage.getItem('volleyclub-lang') || 'en') as 'en' | 'ar';
      
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(storedTheme);
      root.setAttribute('dir', storedLang === 'ar' ? 'rtl' : 'ltr');
      root.setAttribute('lang', storedLang);
      
      set({ theme: storedTheme, language: storedLang });
    }
  },

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(nextTheme);
      localStorage.setItem('volleyclub-theme', nextTheme);
    }
    return { theme: nextTheme };
  }),

  setTheme: (theme) => set(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('volleyclub-theme', theme);
    }
    return { theme };
  }),

  setLanguage: (language) => set(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
      root.setAttribute('lang', language);
      localStorage.setItem('volleyclub-lang', language);
    }
    return { language };
  }),

  setActiveTab: (activeTab) => set({ activeTab }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  toggleNotificationDrawer: () => set((state) => ({ notificationDrawerOpen: !state.notificationDrawerOpen })),
}));
