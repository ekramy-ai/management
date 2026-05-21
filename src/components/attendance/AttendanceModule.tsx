'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, AlertTriangle, XCircle, Clock, ShieldAlert,
  Calendar, Users, Info, Save, Layers, PieChart, Shield, HelpCircle,
  TrendingUp, Award, UserCheck, Settings, Search
} from 'lucide-react';
import { AttendanceStatus, Player, Staff } from '../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AttendanceModule() {
  const { t, language } = useTranslation();
  const { 
    trainingSessions, players, staff, attendance, 
    setPlayerAttendance, setStaffAttendance, bulkSetAttendance, teams 
  } = useClubStore();

  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'analytics'>('daily');
  const [activeSubTab, setActiveSubTab] = useState<'players' | 'staff'>('players');
  const [selectedSessionId, setSelectedSessionId] = useState(trainingSessions[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSession = trainingSessions.find(ts => ts.id === selectedSessionId);

  // Filter players and staff for the selected session's team
  const activePlayers = players.filter(p => p.teamId === selectedSession?.teamId);
  const activeStaff = staff; // Staff covers the entire club/academy

  // --- Helper state getters ---
  const getPlayerRecord = (playerId: string) => {
    return attendance.find(
      a => a.sessionId === selectedSessionId && a.playerId === playerId && a.sessionType === 'Training'
    );
  };

  const getStaffRecord = (staffId: string) => {
    return attendance.find(
      a => a.sessionId === selectedSessionId && a.staffId === staffId && a.sessionType === 'Training'
    );
  };

  const handlePlayerStatusChange = (playerId: string, status: AttendanceStatus) => {
    const existing = getPlayerRecord(playerId);
    setPlayerAttendance(selectedSessionId, 'Training', playerId, status, existing?.noteEn, existing?.noteAr);
  };

  const handleStaffStatusChange = (staffId: string, status: AttendanceStatus) => {
    const existing = getStaffRecord(staffId);
    setStaffAttendance(selectedSessionId, 'Training', staffId, status, existing?.noteEn, existing?.noteAr);
  };

  const handlePlayerNoteChange = (playerId: string, note: string) => {
    const existing = getPlayerRecord(playerId);
    setPlayerAttendance(
      selectedSessionId, 'Training', playerId, 
      existing?.status || 'Present', 
      note, note
    );
  };

  const handleStaffNoteChange = (staffId: string, note: string) => {
    const existing = getStaffRecord(staffId);
    setStaffAttendance(
      selectedSessionId, 'Training', staffId, 
      existing?.status || 'Present', 
      note, note
    );
  };

  // Bulk actions
  const handleBulkSetPlayers = (status: AttendanceStatus) => {
    const records = activePlayers.map(p => {
      const existing = getPlayerRecord(p.id);
      return {
        sessionId: selectedSessionId,
        sessionType: 'Training' as const,
        playerId: p.id,
        status,
        noteEn: existing?.noteEn,
        noteAr: existing?.noteAr,
        checkInTime: new Date().toISOString()
      };
    });
    bulkSetAttendance(records);
  };

  const handleBulkSetStaff = (status: AttendanceStatus) => {
    const records = activeStaff.map(s => {
      const existing = getStaffRecord(s.id);
      return {
        sessionId: selectedSessionId,
        sessionType: 'Training' as const,
        staffId: s.id,
        status,
        noteEn: existing?.noteEn,
        noteAr: existing?.noteAr,
        checkInTime: new Date().toISOString()
      };
    });
    bulkSetAttendance(records);
  };

  // --- Calculations for Current Session ---
  const presentCount = activePlayers.filter(p => (getPlayerRecord(p.id)?.status || 'Present') === 'Present').length;
  const lateCount = activePlayers.filter(p => getPlayerRecord(p.id)?.status === 'Late').length;
  const absentCount = activePlayers.filter(p => getPlayerRecord(p.id)?.status === 'Absent').length;
  const excusedCount = activePlayers.filter(p => getPlayerRecord(p.id)?.status === 'Excused').length;
  const injuredCount = activePlayers.filter(p => getPlayerRecord(p.id)?.status === 'Injured').length;

  const currentAttendanceRate = activePlayers.length > 0
    ? Math.round(((presentCount + lateCount) / activePlayers.length) * 100)
    : 100;

  // --- Monthly Aggregates across all training sessions ---
  const getPlayerStats = (player: Player) => {
    const records = attendance.filter(a => a.playerId === player.id && a.sessionType === 'Training');
    const total = records.length;
    if (total === 0) return { present: 0, late: 0, absent: 0, excused: 0, injured: 0, rate: 100 };

    const present = records.filter(r => r.status === 'Present').length;
    const late = records.filter(r => r.status === 'Late').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const excused = records.filter(r => r.status === 'Excused').length;
    const injured = records.filter(r => r.status === 'Injured').length;
    const rate = Math.round(((present + late) / total) * 100);

    return { present, late, absent, excused, injured, rate };
  };

  const getTeamName = (teamId?: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return '';
    return language === 'ar' ? team.nameAr : team.nameEn;
  };

  // Sort players for most absent list
  const playerStatsList = players.map(p => ({
    player: p,
    stats: getPlayerStats(p)
  }));

  const mostAbsentPlayers = [...playerStatsList]
    .filter(item => item.stats.absent > 0)
    .sort((a, b) => b.stats.absent - a.stats.absent)
    .slice(0, 4);

  // Late Arrivals Log
  const lateArrivalsLog = attendance
    .filter(a => a.status === 'Late')
    .map(a => {
      const player = players.find(p => p.id === a.playerId);
      const memberStaff = staff.find(s => s.id === a.staffId);
      const session = trainingSessions.find(s => s.id === a.sessionId);
      return {
        id: a.id,
        name: player 
          ? (language === 'ar' ? player.nameAr : player.nameEn)
          : memberStaff 
            ? (language === 'ar' ? memberStaff.nameAr : memberStaff.nameEn)
            : 'Unknown',
        type: player ? 'Player' : 'Staff',
        date: session?.date || 'Unknown',
        note: language === 'ar' ? a.noteAr : a.noteEn
      };
    })
    .slice(0, 4);

  // Discipline Alerts: players with attendance < 90%
  const disciplineAlerts = playerStatsList
    .filter(item => item.stats.rate < 90)
    .sort((a, b) => a.stats.rate - b.stats.rate);

  // Charts trend mapping
  const chartData = trainingSessions.map(session => {
    const sPlayers = players.filter(p => p.teamId === session.teamId);
    const sRecords = attendance.filter(a => a.sessionId === session.id && a.sessionType === 'Training');
    const sPresent = sRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const rate = sPlayers.length > 0 ? Math.round((sPresent / sPlayers.length) * 100) : 95;
    return {
      date: session.date.substring(5), // MM-DD
      rate
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-start">
        <div>
          <h2 className="text-lg font-black text-foreground">{t('attendance')}</h2>
          <p className="text-xs text-muted-foreground">
            {language === 'ar' 
              ? 'نظام التحضير الاحترافي للاعبين والأطقم الفنية والطبية والإدارية.' 
              : 'Professional attendance tracking matrix for players and coaches.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-muted/60 p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('daily')}
            className={`h-8 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'daily' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التحضير اليومي' : 'Daily Check-in'}</span>
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`h-8 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'monthly' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التقرير الشهري' : 'Monthly Grid'}</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`h-8 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التحليل الفني' : 'Analytics'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: DAILY CHECK-IN MATRIX */}
        {activeTab === 'daily' && (
          <motion.div
            key="daily-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start text-start"
          >
            {/* Session Selector & Panel stats */}
            <div className="xl:col-span-1 space-y-5">
              <div className="p-5 rounded-2xl glass-card space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    {t('selectSession')}
                  </label>
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="w-full h-11 px-3 text-xs bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                  >
                    {trainingSessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.date} - {language === 'ar' ? session.titleAr : session.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSession && (
                  <div className="p-3.5 bg-muted/30 border border-border/50 rounded-xl space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-500 shrink-0" />
                      <span className="font-bold text-foreground">{selectedSession.date} @ {selectedSession.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-bold text-foreground">{getTeamName(selectedSession.teamId)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-muted-foreground truncate">{language === 'ar' ? selectedSession.focusAreaAr : selectedSession.focusAreaEn}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* KPI Board */}
              {selectedSession && (
                <div className="p-5 rounded-2xl glass-card space-y-4">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {language === 'ar' ? 'ملخص حصة اليوم' : 'Session Quick Metrics'}
                  </h3>

                  <div className="text-center py-4 border-b border-border">
                    <span className="text-4xl font-black text-foreground">{currentAttendanceRate}%</span>
                    <p className="text-[10px] text-muted-foreground uppercase mt-1 tracking-wider">{t('attendanceRate')}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
                    <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg col-span-2 flex justify-between px-3 items-center">
                      <span className="text-muted-foreground">{t('present')}</span>
                      <span className="text-emerald-500 text-xs font-black">{presentCount}</span>
                    </div>
                    <div className="p-2 bg-cyan-500/5 border border-cyan-500/10 rounded-lg flex justify-between px-3 items-center">
                      <span className="text-muted-foreground">{t('late')}</span>
                      <span className="text-cyan-500 text-xs font-black">{lateCount}</span>
                    </div>
                    <div className="p-2 bg-red-500/5 border border-red-500/10 rounded-lg flex justify-between px-3 items-center">
                      <span className="text-muted-foreground">{t('absent')}</span>
                      <span className="text-red-500 text-xs font-black">{absentCount}</span>
                    </div>
                    <div className="p-2 bg-amber-500/5 border border-amber-500/10 rounded-lg flex justify-between px-3 items-center">
                      <span className="text-muted-foreground">{t('excused')}</span>
                      <span className="text-amber-500 text-xs font-black">{excusedCount}</span>
                    </div>
                    <div className="p-2 bg-rose-500/5 border border-rose-500/10 rounded-lg flex justify-between px-3 items-center">
                      <span className="text-muted-foreground">{t('injured')}</span>
                      <span className="text-rose-500 text-xs font-black">{injuredCount}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Matrix Sheet */}
            <div className="xl:col-span-3 space-y-4">
              {selectedSession ? (
                <div className="rounded-2xl glass-card overflow-hidden">
                  {/* Sub Header tabs for Players / Staff */}
                  <div className="h-14 bg-muted/40 border-b border-border flex justify-between items-center px-4">
                    <div className="flex gap-1 bg-muted p-0.5 rounded-lg border border-border">
                      <button
                        onClick={() => setActiveSubTab('players')}
                        className={`h-7 px-3 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          activeSubTab === 'players' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                        }`}
                      >
                        <Users className="w-3 h-3 text-brand-500" />
                        <span>{language === 'ar' ? 'اللاعبين' : 'Players'}</span>
                      </button>
                      <button
                        onClick={() => setActiveSubTab('staff')}
                        className={`h-7 px-3 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          activeSubTab === 'staff' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                        }`}
                      >
                        <Settings className="w-3 h-3 text-violet-500" />
                        <span>{language === 'ar' ? 'الطاقم الفني' : 'Staff'}</span>
                      </button>
                    </div>

                    {/* Bulk Commands */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => activeSubTab === 'players' ? handleBulkSetPlayers('Present') : handleBulkSetStaff('Present')}
                        className="h-8 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                      >
                        {t('bulkPresent')}
                      </button>
                      <button
                        onClick={() => activeSubTab === 'players' ? handleBulkSetPlayers('Absent') : handleBulkSetStaff('Absent')}
                        className="h-8 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                      >
                        {t('bulkAbsent')}
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-border/60">
                    {/* Players Check-in */}
                    {activeSubTab === 'players' && (
                      activePlayers.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-xs">
                          {language === 'ar' ? 'لا يوجد لاعبون مسجلون في هذا الفريق.' : 'No players registered under this squad.'}
                        </div>
                      ) : (
                        activePlayers.map((player) => {
                          const record = getPlayerRecord(player.id);
                          const status = record?.status || 'Present';
                          const note = record?.noteEn || '';
                          return (
                            <div key={player.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-3 w-48 shrink-0">
                                <span className="w-7 font-mono font-bold text-brand-500">#{player.jerseyNumber}</span>
                                <div className="text-start">
                                  <span className="font-bold text-foreground text-xs block">{language === 'ar' ? player.nameAr : player.nameEn}</span>
                                  <span className="text-[10px] text-muted-foreground">{t(player.position.charAt(0).toLowerCase() + player.position.slice(1) as any)}</span>
                                </div>
                              </div>

                              {/* Matrix Tri-state buttons */}
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  { val: 'Present' as AttendanceStatus, label: t('present'), color: 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10' },
                                  { val: 'Late' as AttendanceStatus, label: t('late'), color: 'bg-cyan-500 border-cyan-500 text-white shadow-cyan-500/10' },
                                  { val: 'Absent' as AttendanceStatus, label: t('absent'), color: 'bg-red-500 border-red-500 text-white shadow-red-500/10' },
                                  { val: 'Excused' as AttendanceStatus, label: t('excused'), color: 'bg-amber-500 border-amber-500 text-white shadow-amber-500/10' },
                                  { val: 'Injured' as AttendanceStatus, label: t('injured'), color: 'bg-rose-500 border-rose-500 text-white shadow-rose-500/10' },
                                ].map((btn) => (
                                  <button
                                    key={btn.val}
                                    onClick={() => handlePlayerStatusChange(player.id, btn.val)}
                                    className={`h-8 px-2.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                      status === btn.val
                                        ? `${btn.color} shadow-md`
                                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
                                    }`}
                                  >
                                    {btn.label}
                                  </button>
                                ))}
                              </div>

                              {/* Notes Input */}
                              <div className="flex-1 min-w-[150px]">
                                <input
                                  type="text"
                                  placeholder={t('remarks')}
                                  value={note}
                                  onChange={(e) => handlePlayerNoteChange(player.id, e.target.value)}
                                  className="w-full h-8 px-2.5 bg-muted/40 border border-border rounded-lg text-[10px] focus:outline-none focus:border-brand-500 text-foreground"
                                />
                              </div>
                            </div>
                          );
                        })
                      )
                    )}

                    {/* Staff Check-in */}
                    {activeSubTab === 'staff' && (
                      activeStaff.map((s) => {
                        const record = getStaffRecord(s.id);
                        const status = record?.status || 'Present';
                        const note = record?.noteEn || '';
                        return (
                          <div key={s.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 w-48 shrink-0">
                              <img src={s.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover border border-border" />
                              <div className="text-start">
                                <span className="font-bold text-foreground text-xs block">{language === 'ar' ? s.nameAr : s.nameEn}</span>
                                <span className="text-[10px] text-muted-foreground">{t(s.role.charAt(0).toLowerCase() + s.role.slice(1) as any)}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { val: 'Present' as AttendanceStatus, label: t('present'), color: 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10' },
                                { val: 'Late' as AttendanceStatus, label: t('late'), color: 'bg-cyan-500 border-cyan-500 text-white shadow-cyan-500/10' },
                                { val: 'Absent' as AttendanceStatus, label: t('absent'), color: 'bg-red-500 border-red-500 text-white shadow-red-500/10' },
                                { val: 'Excused' as AttendanceStatus, label: t('excused'), color: 'bg-amber-500 border-amber-500 text-white shadow-amber-500/10' },
                              ].map((btn) => (
                                <button
                                  key={btn.val}
                                  onClick={() => handleStaffStatusChange(s.id, btn.val)}
                                  className={`h-8 px-2.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                    status === btn.val
                                      ? `${btn.color} shadow-md`
                                      : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
                                  }`}
                                >
                                  {btn.label}
                                </button>
                              ))}
                            </div>

                            <div className="flex-1 min-w-[150px]">
                              <input
                                type="text"
                                placeholder={t('remarks')}
                                value={note}
                                onChange={(e) => handleStaffNoteChange(s.id, e.target.value)}
                                className="w-full h-8 px-2.5 bg-muted/40 border border-border rounded-lg text-[10px] focus:outline-none focus:border-brand-500 text-foreground"
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl glass-card text-center text-muted-foreground text-xs py-16 flex flex-col items-center justify-center">
                  <Calendar className="w-8 h-8 opacity-20 mb-2" />
                  <span>{language === 'ar' ? 'الرجاء جدولة حصة تدريبية أولاً لتتمكن من رصد الحضور.' : 'Please schedule a training session first in order to take attendance.'}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: MONTHLY REPORT */}
        {activeTab === 'monthly' && (
          <motion.div
            key="monthly-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Top statistics rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
              {/* Most Absent Players */}
              <div className="p-5 rounded-2xl glass-card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-3">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <span>{t('mostAbsent')}</span>
                </h3>
                <div className="space-y-3">
                  {mostAbsentPlayers.length === 0 ? (
                    <p className="text-xs text-muted-foreground">{t('noData')}</p>
                  ) : (
                    mostAbsentPlayers.map((item, idx) => (
                      <div key={item.player.id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-muted-foreground font-mono">#{item.player.jerseyNumber}</span>
                          <span className="font-bold text-foreground">
                            {language === 'ar' ? item.player.nameAr : item.player.nameEn}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-bold text-[10px]">
                          {item.stats.absent} {language === 'ar' ? 'غياب' : 'absences'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Late Arrivals list */}
              <div className="p-5 rounded-2xl glass-card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-3">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <span>{t('lateArrivals')}</span>
                </h3>
                <div className="space-y-3">
                  {lateArrivalsLog.length === 0 ? (
                    <p className="text-xs text-muted-foreground">{t('noData')}</p>
                  ) : (
                    lateArrivalsLog.map((log) => (
                      <div key={log.id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{log.name}</span>
                          <span className="text-[9px] px-1 bg-muted text-muted-foreground rounded">{log.type}</span>
                        </div>
                        <div className="text-end">
                          <span className="text-muted-foreground text-[10px] block">{log.date}</span>
                          {log.note && <span className="text-cyan-500 text-[9px] italic block">{log.note}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Monthly Grid table */}
            <div className="rounded-2xl glass-card overflow-hidden text-start">
              <div className="h-14 bg-muted/40 border-b border-border flex items-center justify-between px-5">
                <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                  {t('monthlyReport')}
                </span>
                
                {/* Search in Report */}
                <div className="relative w-48">
                  <Search className="absolute start-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 ps-8 pe-2.5 bg-muted/50 border border-border rounded-lg text-[10px] focus:outline-none focus:border-brand-500 text-foreground"
                  />
                </div>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/20 text-muted-foreground font-bold h-10 select-none">
                      <th className="px-4 text-start font-bold">#</th>
                      <th className="px-4 text-start font-bold">{t('playerName')}</th>
                      <th className="px-4 text-start font-bold">{t('teams')}</th>
                      <th className="px-4 text-center font-bold">{t('present')}</th>
                      <th className="px-4 text-center font-bold">{t('late')}</th>
                      <th className="px-4 text-center font-bold">{t('absent')}</th>
                      <th className="px-4 text-center font-bold">{t('excused')}</th>
                      <th className="px-4 text-center font-bold">{t('injured')}</th>
                      <th className="px-4 text-end font-bold">{t('attendanceRate')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {playerStatsList
                      .filter(item => 
                        item.player.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.player.nameAr.includes(searchQuery)
                      )
                      .map((item) => (
                        <tr key={item.player.id} className="hover:bg-muted/20 h-11 transition-colors">
                          <td className="px-4 font-mono text-brand-500 font-bold">#{item.player.jerseyNumber}</td>
                          <td className="px-4 font-bold">{language === 'ar' ? item.player.nameAr : item.player.nameEn}</td>
                          <td className="px-4 text-muted-foreground">{getTeamName(item.player.teamId)}</td>
                          <td className="px-4 text-center font-bold text-emerald-500">{item.stats.present}</td>
                          <td className="px-4 text-center font-bold text-cyan-500">{item.stats.late}</td>
                          <td className="px-4 text-center font-bold text-red-500">{item.stats.absent}</td>
                          <td className="px-4 text-center font-bold text-amber-500">{item.stats.excused}</td>
                          <td className="px-4 text-center font-bold text-rose-500">{item.stats.injured}</td>
                          <td className="px-4 text-end">
                            <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                              item.stats.rate >= 90 
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : item.stats.rate >= 75 
                                  ? 'bg-amber-500/10 text-amber-500' 
                                  : 'bg-red-500/10 text-red-500'
                            }`}>
                              {item.stats.rate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: ANALYTICS & DISCIPLINE REPORT */}
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start text-start"
          >
            {/* Left: Trend line chart */}
            <div className="xl:col-span-2 space-y-6">
              <div className="p-5 rounded-2xl glass-card h-[350px] flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    {t('attendanceTrend')}
                  </h3>
                  
                  <div className="h-60 text-xs w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAttendanceAnalytics" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                        <XAxis dataKey="date" stroke="#888" tickLine={false} />
                        <YAxis domain={[50, 100]} stroke="#888" tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--sidebar-bg)', 
                            borderColor: 'var(--sidebar-border)',
                            borderRadius: '8px',
                            color: 'var(--foreground)'
                          }} 
                        />
                        <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendanceAnalytics)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Discipline & Low Attendance alert logs */}
            <div className="xl:col-span-1 space-y-6">
              <div className="p-5 rounded-2xl glass-card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-3">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>{t('disciplineReport')}</span>
                </h3>

                <div className="space-y-3">
                  {disciplineAlerts.length === 0 ? (
                    <p className="text-xs text-muted-foreground">{language === 'ar' ? 'جميع اللاعبين يمتلكون نسب التزام تفوق ٩٠٪. رائع!' : 'All roster members have attendance > 90%. Exceptional!'}</p>
                  ) : (
                    disciplineAlerts.map((item) => (
                      <div key={item.player.id} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex justify-between items-center text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground">{language === 'ar' ? item.player.nameAr : item.player.nameEn}</span>
                          <span className="text-[9px] text-muted-foreground block">{getTeamName(item.player.teamId)}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 font-black text-[10px]">
                          {item.stats.rate}% Rate
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
