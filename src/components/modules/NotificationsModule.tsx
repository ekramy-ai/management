'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2, CheckCircle2, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

export default function NotificationsModule() {
  const { t, language } = useTranslation();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useClubStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'alert': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-brand-500" />;
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-start">
      {/* Top Console */}
      <div className="flex justify-between items-center text-start border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-black text-foreground">{t('notificationCenter')}</h2>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'استعرض إشعارات التنبيه وأحداث النظام الأخيرة.' : 'View system alerts and recent activity reports.'}</p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllNotificationsRead}
            className="h-10 px-4 bg-muted hover:bg-muted/80 border border-border text-foreground rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            <span>{t('markAllRead')}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`h-9 px-4 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-brand-500 text-white border-brand-500'
              : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {language === 'ar' ? 'كل التنبيهات' : 'All Notifications'} ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`h-9 px-4 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            filter === 'unread'
              ? 'bg-brand-500 text-white border-brand-500'
              : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {language === 'ar' ? 'غير المقروءة' : 'Unread'} ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Main List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 rounded-2xl glass-card text-center text-muted-foreground text-xs py-16 flex flex-col items-center justify-center">
            <Bell className="w-8 h-8 opacity-20 mb-2" />
            <span>{t('noNotifications')}</span>
          </div>
        ) : (
          filtered.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-center ${
                notif.read
                  ? 'bg-muted/10 border-border hover:bg-muted/20'
                  : 'bg-brand-500/5 border-brand-500/20 hover:bg-brand-500/10 shadow-sm'
              }`}
            >
              <div className="flex gap-3.5 items-start">
                <div className="mt-0.5 p-1.5 bg-muted/40 border border-border rounded-lg shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold ${notif.read ? 'text-foreground/80' : 'text-foreground'}`}>
                    {language === 'ar' ? notif.titleAr : notif.titleEn}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-normal max-w-xl">
                    {language === 'ar' ? notif.messageAr : notif.messageEn}
                  </p>
                </div>
              </div>

              <div className="text-end shrink-0 text-[10px] text-muted-foreground font-medium">
                {formatTimestamp(notif.timestamp)}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
