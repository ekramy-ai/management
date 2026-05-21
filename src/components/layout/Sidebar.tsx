'use client';

import React, { useState } from 'react';
import { useUIStore, ActiveTab } from '../../store/uiStore';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, UserCheck, Trophy, 
  Calendar, FileText, Settings, Bell, ChevronLeft, 
  ChevronRight, Search, Activity, GraduationCap
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, toggleSidebar, toggleNotificationDrawer } = useUIStore();
  const { t, isRtl } = useTranslation();
  const notifications = useClubStore((state) => state.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: t('dashboard'), icon: LayoutDashboard },
    { id: 'teams' as ActiveTab, label: t('teams'), icon: Users },
    { id: 'players' as ActiveTab, label: t('players'), icon: Activity },
    { id: 'staff' as ActiveTab, label: t('staff'), icon: GraduationCap },
    { id: 'attendance' as ActiveTab, label: t('attendance'), icon: UserCheck },
    { id: 'training' as ActiveTab, label: t('training'), icon: Calendar },
    { id: 'matches' as ActiveTab, label: t('matches'), icon: Trophy },
    { id: 'reports' as ActiveTab, label: t('reports'), icon: FileText },
    { id: 'settings' as ActiveTab, label: t('settings'), icon: Settings },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.aside 
      animate={{ width: sidebarOpen ? 260 : 70 }}
      transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
      className={`relative h-screen bg-[var(--sidebar-bg)] border-e border-[var(--sidebar-border)] flex flex-col z-30 select-none shadow-sm transition-colors duration-300 shrink-0`}
    >
      {/* Brand Logo & Title */}
      <div className="h-16 flex items-center px-4 justify-between border-b border-[var(--sidebar-border)] transition-colors duration-300">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-brand-500/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: isRtl ? 15 : -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? 15 : -15 }}
                className="flex flex-col"
              >
                <span className="font-bold text-sm tracking-tight text-foreground whitespace-nowrap">
                  {t('appName')}
                </span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {t('appSubtitle')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle Collapse Arrow */}
        {sidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="w-6 h-6 rounded-md hover:bg-muted/80 flex items-center justify-center text-muted-foreground border border-[var(--sidebar-border)] cursor-pointer"
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Mini Toggle Collapse Button when collapsed */}
      {!sidebarOpen && (
        <button 
          onClick={toggleSidebar}
          className="mx-auto my-3 w-8 h-8 rounded-md hover:bg-muted/80 flex items-center justify-center text-muted-foreground border border-[var(--sidebar-border)] cursor-pointer"
        >
          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      )}

      {/* Search Input */}
      {sidebarOpen && (
        <div className="p-3">
          <div className="relative flex items-center">
            <Search className="absolute start-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 ps-9 pe-3 text-xs bg-muted/50 rounded-lg border border-[var(--sidebar-border)] focus:outline-none focus:border-brand-500 text-foreground transition-colors duration-200"
            />
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredMenuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full h-10 px-3 rounded-lg flex items-center gap-3 transition-all duration-200 group relative cursor-pointer ${
                isActive 
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10' 
                  : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
              
              {sidebarOpen && (
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
              )}

              {/* Collapsed Tooltip */}
              {!sidebarOpen && (
                <div className={`absolute start-16 bg-popover text-popover-foreground text-xs font-semibold px-2 py-1.5 rounded shadow-md border border-border opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap`}>
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile / Quick Info */}
      <div className="p-3 border-t border-[var(--sidebar-border)] transition-colors duration-300">
        <button
          onClick={toggleNotificationDrawer}
          className={`w-full h-10 px-3 rounded-lg flex items-center gap-3 transition-colors duration-200 hover:bg-muted/50 text-muted-foreground hover:text-foreground mb-1 relative cursor-pointer`}
        >
          <Bell className="w-4 h-4 shrink-0" />
          {sidebarOpen && (
            <span className="text-xs font-medium">{t('notifications')}</span>
          )}
          {unreadCount > 0 && (
            <span className={`absolute ${sidebarOpen ? 'end-3' : 'start-6 top-2'} min-w-5 h-5 px-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse`}>
              {unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 p-1 rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
            alt="User avatar"
            className="w-7 h-7 rounded-full border border-[var(--sidebar-border)] shrink-0 object-cover"
          />
          {sidebarOpen && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-foreground truncate">Carlos Alberto</span>
              <span className="text-[10px] text-muted-foreground truncate">{t('headCoach')}</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
