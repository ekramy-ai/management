'use client';

import React from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { useUIStore, ActiveTab } from '../../store/uiStore';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, CheckCircle2, TrendingUp, Trophy, ArrowUpRight, Plus, 
  ShieldAlert, Award
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DashboardModule() {
  const { t, language } = useTranslation();
  const { players, matches, trainingSessions, attendance, notifications } = useClubStore();
  const { setActiveTab } = useUIStore();

  // 1. KPI Calculations
  const activePlayersCount = players.filter(p => p.status === 'Active').length;
  const upcomingMatchesCount = matches.filter(m => m.status === 'Scheduled').length;
  
  // Avg Attendance calculation
  const totalAttendanceRecords = attendance.length;
  const presentRecords = attendance.filter(a => a.status === 'Present').length;
  const avgAttendanceRate = totalAttendanceRecords > 0 
    ? Math.round((presentRecords / totalAttendanceRecords) * 100) 
    : 92; // Default fallback if no data

  // Win Ratio calculation
  const completedMatches = matches.filter(m => m.status === 'Completed');
  const winCount = completedMatches.filter(m => m.ourScore > m.opponentScore).length;
  const winRatio = completedMatches.length > 0 
    ? Math.round((winCount / completedMatches.length) * 100) 
    : 75; // Default fallback if no data

  // 2. Charts Mock Data
  const attendanceData = [
    { date: '05/10', rate: 85 },
    { date: '05/12', rate: 90 },
    { date: '05/15', rate: 92 },
    { date: '05/19', rate: 100 },
    { date: '05/21', rate: 83 },
  ];

  const winLossData = [
    { name: language === 'ar' ? 'فوز' : 'Wins', value: winCount || 3, color: '#10b981' },
    { name: language === 'ar' ? 'خسارة' : 'Losses', value: (completedMatches.length - winCount) || 1, color: '#f43f5e' },
  ];

  // 3. KPI Cards configurations
  const kpis = [
    {
      title: t('kpiActivePlayers'),
      value: activePlayersCount,
      sub: `${players.length} ${t('players').toLowerCase()}`,
      icon: Users,
      colorClass: 'from-blue-500/20 to-indigo-500/10 text-blue-500 border-blue-500/20',
      trend: '+2 new'
    },
    {
      title: t('kpiUpcomingMatches'),
      value: upcomingMatchesCount,
      sub: t('winStreak'),
      icon: Trophy,
      colorClass: 'from-amber-500/20 to-orange-500/10 text-amber-500 border-amber-500/20',
      trend: 'Next: May 25'
    },
    {
      title: t('kpiAttendanceRate'),
      value: `${avgAttendanceRate}%`,
      sub: t('vsLastMonth'),
      icon: CheckCircle2,
      colorClass: 'from-emerald-500/20 to-teal-500/10 text-emerald-500 border-emerald-500/20',
      trend: '+4.2%'
    },
    {
      title: t('kpiWinRatio'),
      value: `${winRatio}%`,
      sub: `${winCount}W - ${completedMatches.length - winCount}L`,
      icon: TrendingUp,
      colorClass: 'from-violet-500/20 to-purple-500/10 text-violet-500 border-violet-500/20',
      trend: 'Top 3 League'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-800 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Decorative background grid elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-indigo-200 to-indigo-900 pointer-events-none" />
        
        <div className="relative z-10 space-y-1 text-start">
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <Trophy className="w-6 h-6 animate-spin text-amber-400" style={{ animationDuration: '4s' }} />
            <span>{language === 'ar' ? 'أهلاً بك في فولي كلوب برو' : 'Welcome to VolleyClub Pro'}</span>
          </h2>
          <p className="text-xs text-brand-100 max-w-xl">
            {language === 'ar'
              ? 'قم بإدارة تشكيلة الدوران، ومراقبة حضور اللاعبين، وتحليل مؤشرات الأداء الحيوية للنادي في لوحة تحكم سحابية موحدة.'
              : 'Manage match rotations, track training attendance, and monitor real-time club KPIs in a unified, professional sport workspace.'}
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('settings')}
          className="relative z-10 h-10 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>{language === 'ar' ? 'تهيئة إعدادات النادي' : 'Configure Club Info'}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between h-36 relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1.5 text-start">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className="text-2xl font-black text-foreground">
                    {kpi.value}
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border bg-gradient-to-br ${kpi.colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] mt-2 pt-2 border-t border-border/50">
                <span className="text-muted-foreground truncate max-w-[120px]">
                  {kpi.sub}
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 font-bold shrink-0">
                  {kpi.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Visualization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card text-start flex flex-col h-[350px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            {t('attendanceTrend')}
          </h3>
          <div className="flex-1 w-full text-xs min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="date" stroke="#888888" tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#888888" tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--sidebar-bg)', 
                    borderColor: 'var(--sidebar-border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }} 
                />
                <Area type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win/Loss Pie chart */}
        <div className="p-5 rounded-2xl glass-card text-start flex flex-col h-[350px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            {t('winLossBreakdown')}
          </h3>
          <div className="flex-1 w-full text-xs min-h-0 flex flex-col justify-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend indicators */}
            <div className="flex justify-center gap-6 mt-2">
              {winLossData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="font-medium text-muted-foreground">{entry.name}</span>
                  <span className="font-bold text-foreground">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Bottom Grid: Action Center & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Shortcuts */}
        <div className="p-5 rounded-2xl glass-card text-start flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              {t('quickActions')}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              <button 
                onClick={() => setActiveTab('players')}
                className="w-full h-11 px-3 bg-muted/40 hover:bg-muted/80 rounded-xl flex items-center justify-between border border-[var(--sidebar-border)] text-xs text-foreground font-semibold transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-brand-500 group-hover:scale-110 transition-transform" />
                  <span>{t('addPlayerShortcut')}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={() => setActiveTab('matches')}
                className="w-full h-11 px-3 bg-muted/40 hover:bg-muted/80 rounded-xl flex items-center justify-between border border-[var(--sidebar-border)] text-xs text-foreground font-semibold transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span>{t('recordMatch')}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={() => setActiveTab('attendance')}
                className="w-full h-11 px-3 bg-muted/40 hover:bg-muted/80 rounded-xl flex items-center justify-between border border-[var(--sidebar-border)] text-xs text-foreground font-semibold transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>{t('checkInPlayers')}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={() => setActiveTab('training')}
                className="w-full h-11 px-3 bg-muted/40 hover:bg-muted/80 rounded-xl flex items-center justify-between border border-[var(--sidebar-border)] text-xs text-foreground font-semibold transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span>{t('scheduleTraining')}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card text-start flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              {t('activityLog')}
            </h3>
            
            <div className="space-y-4">
              {notifications.slice(0, 3).map((notif, idx) => (
                <div key={idx} className="flex gap-3 text-xs items-start">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    notif.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    notif.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                    'bg-brand-500/10 border-brand-500/20 text-brand-500'
                  }`}>
                    {notif.type === 'success' ? <Trophy className="w-4 h-4" /> :
                     notif.type === 'warning' ? <ShieldAlert className="w-4 h-4" /> :
                     <Calendar className="w-4 h-4" />}
                  </div>
                  
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-foreground truncate">
                        {language === 'ar' ? notif.titleAr : notif.titleEn}
                      </h4>
                      <span className="text-[9px] text-muted-foreground shrink-0 font-medium">
                        {new Date(notif.timestamp).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {language === 'ar' ? notif.messageAr : notif.messageEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
