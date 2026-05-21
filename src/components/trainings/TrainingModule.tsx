'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, Edit2, X, Clock, MapPin, Target } from 'lucide-react';
import { TrainingSession, TrainingType } from '../../types';

export default function TrainingModule() {
  const { t, language } = useTranslation();
  const { trainingSessions, teams, addTrainingSession, updateTrainingSession, deleteTrainingSession } = useClubStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);

  // Form Fields
  const [teamId, setTeamId] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [date, setDate] = useState('2026-05-22');
  const [time, setTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [locationEn, setLocationEn] = useState('');
  const [locationAr, setLocationAr] = useState('');
  const [focusAreaEn, setFocusAreaEn] = useState('Defense & Digging');
  const [focusAreaAr, setFocusAreaAr] = useState('الدفاع والاستقبال');
  const [type, setType] = useState<TrainingType>('Technical');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');

  const openAddModal = () => {
    setEditingSession(null);
    setTeamId(teams[0]?.id || '');
    setTitleEn('');
    setTitleAr('');
    setDate('2026-05-22');
    setTime('09:00');
    setDurationMinutes(90);
    setLocationEn('Main Gym Court');
    setLocationAr('ملعب الصالة الرئيسية');
    setFocusAreaEn('Defense & Digging');
    setFocusAreaAr('الدفاع والاستقبال');
    setType('Technical');
    setDescriptionEn('');
    setDescriptionAr('');
    setIsModalOpen(true);
  };

  const openEditModal = (session: TrainingSession) => {
    setEditingSession(session);
    setTeamId(session.teamId);
    setTitleEn(session.titleEn);
    setTitleAr(session.titleAr);
    setDate(session.date);
    setTime(session.time);
    setDurationMinutes(session.durationMinutes);
    setLocationEn(session.locationEn);
    setLocationAr(session.locationAr);
    setFocusAreaEn(session.focusAreaEn);
    setFocusAreaAr(session.focusAreaAr);
    setType(session.type);
    setDescriptionEn(session.descriptionEn || '');
    setDescriptionAr(session.descriptionAr || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !titleAr || !teamId) return;

    const payload = {
      teamId,
      titleEn,
      titleAr,
      date,
      time,
      durationMinutes: Number(durationMinutes),
      locationEn,
      locationAr,
      focusAreaEn,
      focusAreaAr,
      type,
      descriptionEn,
      descriptionAr
    };

    if (editingSession) {
      updateTrainingSession(editingSession.id, payload);
    } else {
      addTrainingSession(payload);
    }

    setIsModalOpen(false);
  };

  const getTeamName = (pTeamId: string) => {
    const team = teams.find(t => t.id === pTeamId);
    if (!team) return '';
    return language === 'ar' ? team.nameAr : team.nameEn;
  };

  return (
    <div className="space-y-6">
      {/* Top Console */}
      <div className="flex justify-between items-center text-start">
        <div>
          <h2 className="text-lg font-black text-foreground">{t('training')}</h2>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'قم بجدولة وتنظيم حصص التدريب الفنية ومحاور التركيز.' : 'Schedule practice sessions and define tactical themes.'}</p>
        </div>
        <button
          onClick={openAddModal}
          className="h-10 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20 cursor-pointer animate-fade-in"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add')}</span>
        </button>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingSessions.map((session, idx) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-2xl glass-card flex flex-col justify-between text-start relative group hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[9px] font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                    {getTeamName(session.teamId)}
                  </span>
                  <h3 className="font-black text-foreground text-xs mt-2 line-clamp-1">
                    {language === 'ar' ? session.titleAr : session.titleEn}
                  </h3>
                </div>

                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(session)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTrainingSession(session.id)}
                    className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                {language === 'ar' ? session.descriptionAr : session.descriptionEn}
              </p>
            </div>

            {/* Parameters list */}
            <div className="space-y-2.5 border-t border-border/40 pt-3 mt-4 text-[10px] text-muted-foreground font-medium">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                  <span>{session.time} ({session.durationMinutes} min)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                  <span className="truncate">{language === 'ar' ? session.locationAr : session.locationEn}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-bold text-foreground text-[10px]">{language === 'ar' ? session.focusAreaAr : session.focusAreaEn}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg p-6 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto z-10 text-start"
            >
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h3 className="font-bold text-sm text-foreground">
                  {editingSession ? t('editSession') : t('scheduleSession')}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('teams')}</label>
                    <select
                      value={teamId}
                      onChange={(e) => setTeamId(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    >
                      <option value="">{t('none')}</option>
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{language === 'ar' ? t.nameAr : t.nameEn}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('trainingType')}</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as TrainingType)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    >
                      <option value="Technical">{language === 'ar' ? t('technical') : 'Technical'}</option>
                      <option value="Tactical">{language === 'ar' ? t('tactical') : 'Tactical'}</option>
                      <option value="Physical">{language === 'ar' ? t('physical') : 'Physical'}</option>
                      <option value="Recovery">{language === 'ar' ? t('recovery') : 'Recovery'}</option>
                      <option value="Match Preparation">{language === 'ar' ? t('matchPreparation') : 'Match Preparation'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Session Title (EN)</label>
                    <input
                      type="text"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">عنوان الحصة التدريبية (AR)</label>
                    <input
                      type="text"
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('date')}</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('duration')}</label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Location (EN)</label>
                    <input
                      type="text"
                      value={locationEn}
                      onChange={(e) => setLocationEn(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">الموقع (AR)</label>
                    <input
                      type="text"
                      value={locationAr}
                      onChange={(e) => setLocationAr(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Focus Area (EN)</label>
                    <select
                      value={focusAreaEn}
                      onChange={(e) => setFocusAreaEn(e.target.value)}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    >
                      <option value="Defense & Digging">Defense & Digging</option>
                      <option value="Serving & Passing">Serving & Passing</option>
                      <option value="Blocking & Rotation">Blocking & Rotation</option>
                      <option value="Physical Conditioning">Physical Conditioning</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">محور التركيز (AR)</label>
                    <select
                      value={focusAreaAr}
                      onChange={(e) => setFocusAreaAr(e.target.value)}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    >
                      <option value="الدفاع والاستقبال">الدفاع والاستقبال</option>
                      <option value="الإرسال والتمرير">الإرسال والتمرير</option>
                      <option value="حائط الصد والدوران">حائط الصد والدوران</option>
                      <option value="اللياقة البدنية والاستشفاء">اللياقة البدنية والاستشفاء</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Description (EN)</label>
                    <textarea
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-muted/40 rounded-lg border border-border resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">التفاصيل والتعليمات (AR)</label>
                    <textarea
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-muted/40 rounded-lg border border-border resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 px-4 hover:bg-muted text-muted-foreground rounded-lg font-bold cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-bold cursor-pointer"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
