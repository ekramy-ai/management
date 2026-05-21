'use client';

import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { Sun, Moon, Globe, Bell, Menu } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme, language, setLanguage, activeTab, toggleSidebar, toggleNotificationDrawer } = useUIStore();
  const { t } = useTranslation();
  const notifications = useClubStore((state) => state.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-[var(--sidebar-bg)] border-b border-[var(--sidebar-border)] px-4 flex items-center justify-between z-20 shadow-sm transition-colors duration-300">
      {/* Mobile / Collapsed Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-muted text-muted-foreground focus:outline-none cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <h1 className="text-sm font-bold text-foreground capitalize tracking-tight">
          {t(activeTab as any)}
        </h1>
      </div>

      {/* Language, Theme & Actions */}
      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Language selector */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="h-9 px-3 rounded-lg hover:bg-muted/80 text-xs font-semibold flex items-center gap-1.5 border border-[var(--sidebar-border)] text-foreground cursor-pointer transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'en' ? 'العربية' : 'English'}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg hover:bg-muted/80 flex items-center justify-center border border-[var(--sidebar-border)] text-foreground cursor-pointer transition-colors"
          title={theme === 'light' ? t('dark') : t('light')}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {/* Alerts / Bell Trigger */}
        <button
          onClick={toggleNotificationDrawer}
          className="w-9 h-9 rounded-lg hover:bg-muted/80 flex items-center justify-center border border-[var(--sidebar-border)] text-foreground cursor-pointer relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[var(--sidebar-bg)] animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
}
