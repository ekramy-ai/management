'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Calendar, Users, Info, Save } from 'lucide-react';
import { AttendanceStatus } from '../../types';

export default function AttendanceModule() {
  const { t, language } = useTranslation();
  const { trainingSessions, players, attendance, setPlayerAttendance, teams } = useClubStore();

  const [selectedSessionId, setSelectedSessionId] = useState(trainingSessions[0]?.id || '');
  const selectedSession = trainingSessions.find(ts => ts.id === selectedSessionId);

  // Filter players that belong to the active team of the training session
  const activePlayers = players.filter(p => p.teamId === selectedSession?.teamId);

  // Get current attendance status for a player in this session
  const getPlayerStatus = (playerId: string): AttendanceStatus => {
    const record = attendance.find(
      a => a.sessionId === selectedSessionId && a.playerId === playerId && a.sessionType === 'Training'
    );
    return record ? record.status : 'Present'; // Present by default
  };

  const handleStatusChange = (playerId: string, status: AttendanceStatus) => {
    setPlayerAttendance(selectedSessionId, 'Training', playerId, status);
  };

  // Stats calculation for the selected session
  const currentAttendance = attendance.filter(a => a.sessionId === selectedSessionId && a.sessionType === 'Training');
  const presentCount = activePlayers.filter(p => getPlayerStatus(p.id) === 'Present').length;
  const excusedCount = activePlayers.filter(p => getPlayerStatus(p.id) === 'Excused').length;
  const absentCount = activePlayers.filter(p => getPlayerStatus(p.id) === 'Absent').length;

  const attendancePercent = activePlayers.length > 0 
    ? Math.round((presentCount / activePlayers.length) * 100) 
    : 100;

  const getTeamName = (teamId?: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return '';
    return language === 'ar' ? team.nameAr : team.nameEn;
  };

  return (
    <div className="space-y-6">
      {/* Top Console */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-start">
        <div>
          <h2 className="text-lg font-black text-foreground">{t('attendance')}</h2>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'سجل حضور وغياب اللاعبين للتدريبات والمباريات.' : 'Track player check-ins for practices and games.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start text-start">
        
        {/* Left Side: Session selector & Stats */}
        <div className="xl:col-span-1 space-y-5">
          <div className="p-5 rounded-2xl glass-card space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                {t('selectSession')}
              </label>
              
              <div className="relative">
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
            </div>

            {selectedSession && (
              <div className="p-3 bg-muted/30 border border-border/50 rounded-xl space-y-2.5 text-xs">
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

          {/* Quick Attendance Stats */}
          {selectedSession && (
            <div className="p-5 rounded-2xl glass-card space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t('attendanceOverview')}
              </h3>

              <div className="text-center py-4 border-b border-border">
                <span className="text-3xl font-black text-foreground">{attendancePercent}%</span>
                <p className="text-[10px] text-muted-foreground uppercase mt-1 tracking-wider">{t('attendanceRate')}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                  <span className="text-emerald-500 font-bold block">{presentCount}</span>
                  <span className="text-[9px] text-muted-foreground">{t('present')}</span>
                </div>
                <div className="p-2 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                  <span className="text-amber-500 font-bold block">{excusedCount}</span>
                  <span className="text-[9px] text-muted-foreground">{t('excused')}</span>
                </div>
                <div className="p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <span className="text-red-500 font-bold block">{absentCount}</span>
                  <span className="text-[9px] text-muted-foreground">{t('absent')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Checklist Matrix */}
        <div className="xl:col-span-3">
          {selectedSession ? (
            <div className="rounded-2xl glass-card overflow-hidden">
              <div className="h-14 bg-muted/40 border-b border-border flex items-center px-5 justify-between">
                <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                  {language === 'ar' ? 'قائمة تحضير لاعبي الفريق' : 'Team Roster Checklist'}
                </span>
                <span className="px-2 py-0.5 bg-brand-500/10 text-brand-500 font-bold text-[10px] rounded">
                  {activePlayers.length} {language === 'ar' ? 'لاعب إجمالاً' : 'players total'}
                </span>
              </div>

              <div className="divide-y divide-border/60">
                {activePlayers.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-xs">
                    {language === 'ar' 
                      ? 'لا يوجد لاعبون مسجلون في هذا الفريق حالياً.' 
                      : 'No players registered under this squad. Go to Players module to assign squads.'}
                  </div>
                ) : (
                  activePlayers.map((player) => {
                    const currentStatus = getPlayerStatus(player.id);
                    return (
                      <div key={player.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-7 text-center font-mono font-bold text-brand-500">
                            #{player.jerseyNumber}
                          </span>
                          <div>
                            <span className="font-bold text-foreground text-xs block">
                              {language === 'ar' ? player.nameAr : player.nameEn}
                            </span>
                            <span className="text-[9px] text-muted-foreground">
                              {t(player.position.charAt(0).toLowerCase() + player.position.slice(1) as any)}
                            </span>
                          </div>
                        </div>

                        {/* Tri-state buttons */}
                        <div className="flex gap-2.5">
                          <button
                            onClick={() => handleStatusChange(player.id, 'Present')}
                            className={`h-9 px-3.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10'
                                : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('present')}</span>
                          </button>

                          <button
                            onClick={() => handleStatusChange(player.id, 'Excused')}
                            className={`h-9 px-3.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              currentStatus === 'Excused'
                                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/10'
                                : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{t('excused')}</span>
                          </button>

                          <button
                            onClick={() => handleStatusChange(player.id, 'Absent')}
                            className={`h-9 px-3.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              currentStatus === 'Absent'
                                ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/10'
                                : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{t('absent')}</span>
                          </button>
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

      </div>
    </div>
  );
}
