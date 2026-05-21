'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, Edit2, ShieldAlert, GraduationCap, X } from 'lucide-react';
import { Team } from '../../types';

export default function TeamsModule() {
  const { t, language } = useTranslation();
  const { teams, staff, players, addTeam, updateTeam, deleteTeam } = useClubStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  
  // Form fields
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [ageGroup, setAgeGroup] = useState('Senior');
  const [gender, setGender] = useState<'Men' | 'Women' | 'Mixed'>('Men');
  const [headCoachId, setHeadCoachId] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [colorHex, setColorHex] = useState('#3b82f6');

  const openAddModal = () => {
    setEditingTeam(null);
    setNameEn('');
    setNameAr('');
    setAgeGroup('Senior');
    setGender('Men');
    setHeadCoachId('');
    setDescriptionEn('');
    setDescriptionAr('');
    setColorHex('#3b82f6');
    setIsModalOpen(true);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setNameEn(team.nameEn);
    setNameAr(team.nameAr);
    setAgeGroup(team.ageGroup);
    setGender(team.gender);
    setHeadCoachId(team.headCoachId || '');
    setDescriptionEn(team.descriptionEn || '');
    setDescriptionAr(team.descriptionAr || '');
    setColorHex(team.colorHex || '#3b82f6');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !nameAr) return;

    const payload = {
      nameEn,
      nameAr,
      ageGroup,
      gender,
      headCoachId: headCoachId || undefined,
      descriptionEn,
      descriptionAr,
      colorHex
    };

    if (editingTeam) {
      updateTeam(editingTeam.id, payload);
    } else {
      addTeam(payload);
    }

    setIsModalOpen(false);
  };

  // Get coach name by ID
  const getCoachName = (coachId?: string) => {
    const coach = staff.find(s => s.id === coachId);
    if (!coach) return t('coachNotAssigned');
    return language === 'ar' ? coach.nameAr : coach.nameEn;
  };

  // Calculate players count for a team
  const getPlayerCount = (teamId: string) => {
    return players.filter(p => p.teamId === teamId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex justify-between items-center text-start">
        <div>
          <h2 className="text-lg font-black text-foreground">{t('teams')}</h2>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'أضف وهيئ فرق النادي الرياضية ومستويات الأعمار.' : 'Configure club training teams and rosters.'}</p>
        </div>
        <button
          onClick={openAddModal}
          className="h-10 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add')}</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, idx) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-2xl glass-card flex flex-col justify-between h-56 text-start relative overflow-hidden group border-t-4"
            style={{ borderColor: team.colorHex || '#3b82f6' }}
          >
            <div>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-black text-foreground text-sm tracking-tight">
                    {language === 'ar' ? team.nameAr : team.nameEn}
                  </h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5 inline-block bg-muted/60 px-2 py-0.5 rounded-full border border-border">
                    {team.ageGroup} • {team.gender}
                  </span>
                </div>

                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(team)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                {language === 'ar' ? team.descriptionAr : team.descriptionEn}
              </p>
            </div>

            <div className="space-y-2 border-t border-border/40 pt-3 mt-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-500" />
                  <span className="text-[11px]">{t('headCoachLabel')}:</span>
                </div>
                <span className="font-bold text-foreground truncate max-w-[120px] text-[11px]">
                  {getCoachName(team.headCoachId)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[11px]">{t('rosterCount')}:</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-bold rounded text-[10px]">
                  {getPlayerCount(team.id)} {language === 'ar' ? 'لاعب' : 'players'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Creation / Edit Modal */}
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
                  {editingTeam ? t('editTeam') : t('createTeam')}
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
                    <label className="font-bold text-muted-foreground">Team Name (EN)</label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      required
                      placeholder="e.g. First Team Men"
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">اسم الفريق (AR)</label>
                    <input
                      type="text"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      required
                      placeholder="مثال: الفريق الأول رجال"
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('ageGroup')}</label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    >
                      <option value="Senior">Senior</option>
                      <option value="U21">U21</option>
                      <option value="U19">U19</option>
                      <option value="U17">U17</option>
                      <option value="Youth">Youth academy</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('gender')}</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">{t('headCoachLabel')}</label>
                  <select
                    value={headCoachId}
                    onChange={(e) => setHeadCoachId(e.target.value)}
                    className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                  >
                    <option value="">{t('none')}</option>
                    {staff
                      .filter(s => s.role === 'Head Coach' || s.role === 'Assistant Coach')
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {language === 'ar' ? s.nameAr : s.nameEn} ({s.role})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Description (EN)</label>
                    <textarea
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">نبذة عن الفريق (AR)</label>
                    <textarea
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Color Hex Accent</label>
                  <div className="flex gap-2.5 items-center">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer"
                    />
                    <span className="font-mono text-xs">{colorHex}</span>
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
