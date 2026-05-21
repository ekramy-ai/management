'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, Edit2, ShieldAlert, GraduationCap, X, Mail, Phone } from 'lucide-react';
import { Staff, Role } from '../../types';

export default function StaffModule() {
  const { t, language } = useTranslation();
  const { staff, addStaff, updateStaff, deleteStaff } = useClubStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Form Fields
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [role, setRole] = useState<Role>('Head Coach');
  const [specializationEn, setSpecializationEn] = useState('');
  const [specializationAr, setSpecializationAr] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const openAddModal = () => {
    setEditingStaff(null);
    setNameEn('');
    setNameAr('');
    setRole('Head Coach');
    setSpecializationEn('');
    setSpecializationAr('');
    setEmail('');
    setPhone('');
    setIsModalOpen(true);
  };

  const openEditModal = (member: Staff) => {
    setEditingStaff(member);
    setNameEn(member.nameEn);
    setNameAr(member.nameAr);
    setRole(member.role);
    setSpecializationEn(member.specializationEn || '');
    setSpecializationAr(member.specializationAr || '');
    setEmail(member.email);
    setPhone(member.phone);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !nameAr || !email || !phone) return;

    const payload = {
      nameEn,
      nameAr,
      role,
      specializationEn,
      specializationAr,
      email,
      phone
    };

    if (editingStaff) {
      updateStaff(editingStaff.id, payload);
    } else {
      addStaff(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Console */}
      <div className="flex justify-between items-center text-start">
        <div>
          <h2 className="text-lg font-black text-foreground">{t('staff')}</h2>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'أضف وهيئ طاقم تدريب وإدارة النادي الطبي.' : 'Configure administrative, medical, and tactical staff.'}</p>
        </div>
        <button
          onClick={openAddModal}
          className="h-10 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add')}</span>
        </button>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {staff.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-2xl glass-card flex flex-col justify-between text-start relative group hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-xs tracking-tight">
                      {language === 'ar' ? member.nameAr : member.nameEn}
                    </h3>
                    <span className="text-[9px] font-bold text-brand-500 uppercase mt-0.5 inline-block">
                      {t(member.role.charAt(0).toLowerCase() + member.role.slice(1).replace(' ', '') as any)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteStaff(member.id)}
                    className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Specialization competency */}
              <div className="mt-4 p-2 bg-muted/30 border border-border/50 rounded-lg">
                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                  {t('specialization')}
                </span>
                <p className="text-[11px] text-foreground font-semibold mt-0.5">
                  {language === 'ar' ? member.specializationAr : member.specializationEn}
                </p>
              </div>
            </div>

            {/* Contacts Info */}
            <div className="space-y-1.5 border-t border-border/40 pt-3 mt-4 text-[10px] text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                <span>{member.phone}</span>
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
                  {editingStaff ? t('editStaff') : t('createStaff')}
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
                    <label className="font-bold text-muted-foreground">Staff Name (EN)</label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">اسم الموظف (AR)</label>
                    <input
                      type="text"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">{t('role')}</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                  >
                    <option value="Head Coach">Head Coach</option>
                    <option value="Assistant Coach">Assistant Coach</option>
                    <option value="Physiotherapist">Physiotherapist</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Specialization (EN)</label>
                    <input
                      type="text"
                      value={specializationEn}
                      onChange={(e) => setSpecializationEn(e.target.value)}
                      placeholder="e.g. Set Rotations"
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">التخصص الفني (AR)</label>
                    <input
                      type="text"
                      value={specializationAr}
                      onChange={(e) => setSpecializationAr(e.target.value)}
                      placeholder="مثال: دوران حائط الصد"
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
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
