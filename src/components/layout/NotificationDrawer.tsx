'use client';

import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCheck, Bell, ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function NotificationDrawer() {
  const { notificationDrawerOpen, toggleNotificationDrawer } = useUIStore();
  const { t, language, isRtl } = useTranslation();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useClubStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'alert': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-brand-500" />;
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <AnimatePresence>
      {notificationDrawerOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={toggleNotificationDrawer}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Slider Panel */}
          <motion.div
            initial={{ x: isRtl ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed top-0 bottom-0 ${isRtl ? 'left-0' : 'right-0'} w-full sm:w-[380px] bg-[var(--sidebar-bg)] border-${isRtl ? 'e' : 's'} border-[var(--sidebar-border)] shadow-2xl z-50 flex flex-col transition-colors duration-300`}
          >
            {/* Header */}
            <div className="h-16 border-b border-[var(--sidebar-border)] px-4 flex items-center justify-between transition-colors duration-300">
              <div className="flex items-center gap-2 text-foreground">
                <Bell className="w-4 h-4 text-brand-500" />
                <span className="font-bold text-sm">{t('notificationCenter')}</span>
              </div>
              <div className="flex items-center gap-1">
                {notifications.some(n => !n.read) && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                    title={t('markAllRead')}
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={toggleNotificationDrawer}
                  className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs py-8">
                  <Bell className="w-8 h-8 opacity-20 mb-2" />
                  <span>{t('noNotifications')}</span>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer text-start ${
                      notif.read 
                        ? 'bg-muted/10 border-[var(--sidebar-border)] hover:bg-muted/20' 
                        : 'bg-brand-500/5 border-brand-500/20 hover:bg-brand-500/10 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <p className={`text-xs font-bold truncate ${notif.read ? 'text-foreground/80' : 'text-foreground'}`}>
                            {language === 'ar' ? notif.titleAr : notif.titleEn}
                          </p>
                          <span className="text-[9px] text-muted-foreground shrink-0 font-medium">
                            {formatTimestamp(notif.timestamp)}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                          {language === 'ar' ? notif.messageAr : notif.messageEn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
