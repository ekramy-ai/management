'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useUIStore } from '../../store/uiStore';
import { useClubStore } from '../../store/clubStore';
import { Settings, RefreshCcw, Save, Globe, Moon, Sun, Info } from 'lucide-react';

export default function SettingsModule() {
  const { t, language } = useTranslation();
  const { theme, setLanguage, setTheme } = useUIStore();
  const { addNotification } = useClubStore();

  const [clubName, setClubName] = useState('VolleyClub Pro Jeddah');
  const [stadiumName, setStadiumName] = useState('Prince Abdullah Al-Faisal Arena');
  const [accentColor, setAccentColor] = useState('#8b5cf6');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      titleEn: 'Settings Saved Successfully',
      titleAr: 'تم حفظ الإعدادات بنجاح',
      messageEn: 'Club profile variables and stadium naming have been modified.',
      messageAr: 'تم تعديل متغيرات ملف النادي واسم الصالة بنجاح.',
      type: 'success'
    });
  };

  const handleResetDatabase = () => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من رغبتك في إعادة ضبط قاعدة البيانات للوضع الافتراضي؟' : 'Are you sure you want to reset the mock database? All custom inputs will be lost.')) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-start">
      
      {/* Top Title */}
      <div>
        <h2 className="text-lg font-black text-foreground">{t('settings')}</h2>
        <p className="text-xs text-muted-foreground">{language === 'ar' ? 'قم بتهيئة وحفظ إعدادات النادي وتفضيلات النظام العامة.' : 'Configure general club information and system settings.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Settings Links */}
        <div className="md:col-span-1 p-5 rounded-2xl glass-card space-y-3">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-500/10 text-brand-500 text-xs font-bold">
            <Settings className="w-4 h-4" />
            <span>{t('clubInformation')}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg text-muted-foreground hover:bg-muted/40 hover:text-foreground text-xs font-medium cursor-pointer">
            <Globe className="w-4 h-4" />
            <span>{t('systemPreferences')}</span>
          </div>
          <div 
            onClick={handleResetDatabase}
            className="flex items-center gap-2 p-2.5 rounded-lg text-red-500 hover:bg-red-500/10 text-xs font-medium cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>{t('resetDatabase')}</span>
          </div>
        </div>

        {/* Configurations Fields form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Form Club Details */}
          <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-500" />
              <span>{t('clubInformation')}</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">{t('clubName')}</label>
                <input
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  required
                  className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">{t('stadiumName')}</label>
                <input
                  type="text"
                  value={stadiumName}
                  onChange={(e) => setStadiumName(e.target.value)}
                  required
                  className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">{t('primaryColor')}</label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer"
                  />
                  <span className="font-mono text-xs text-muted-foreground">{accentColor}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                className="h-10 px-5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t('saveSettings')}</span>
              </button>
            </div>
          </form>

          {/* Preferences Settings */}
          <div className="p-6 rounded-2xl glass-card space-y-4 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>{t('systemPreferences')}</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">{t('defaultLanguage')}</span>
                  <span className="text-[10px] text-muted-foreground">Select LTR / RTL localization.</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`h-9 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('ar')}
                    className={`h-9 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      language === 'ar'
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    العربية
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-4">
                <div>
                  <span className="font-bold text-foreground block">{t('defaultTheme')}</span>
                  <span className="text-[10px] text-muted-foreground">Choose system visual theme.</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`h-9 px-3.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      theme === 'light'
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>{t('light')}</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`h-9 px-3.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>{t('dark')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
