'use client';

import React from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { useUIStore, ActiveTab } from '../../store/uiStore';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, CheckCircle2, TrendingUp, Trophy, ArrowUpRight, Plus, 
  ShieldAlert, Activity, ClipboardCheck, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';

export default function DashboardModule() {
  const { t, language } = useTranslation();
  const { players, matches, trainingSessions, attendance, notifications, staff } = useClubStore();
  const { setActiveTab } = useUIStore();

  // 1. KPI Calculations
  const totalPlayersCount = players.length;
  const injuredPlayersCount = players.filter(p => p.status === 'Injured').length;
  const upcomingMatchesCount = matches.filter(m => m.status === 'Scheduled').length;
  const upcomingTrainingsCount = trainingSessions.filter(ts => {
    const sessionDate = new Date(ts.date);
    const today = new Date();
    today.setHours(0,0,0,0);
    return sessionDate >= today;
  }).length;
  
  // Avg Attendance calculation
  const playerAttendanceRecords = attendance.filter(a => a.playerId !== undefined && a.sessionType === 'Training');
  const presentPlayerRecords = playerAttendanceRecords.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const avgAttendanceRate = playerAttendanceRecords.length > 0 
    ? Math.round((presentPlayerRecords / playerAttendanceRecords.length) * 100) 
    : 92; // Default fallback

  // Staff Attendance calculation
  const staffAttendanceRecords = attendance.filter(a => a.staffId !== undefined);
  const presentStaffRecords = staffAttendanceRecords.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const staffAttendanceRate = staffAttendanceRecords.length > 0
    ? Math.round((presentStaffRecords / staffAttendanceRecords.length) * 100)
    : 96; // Default fallback

  // Win Ratio calculation (for team performance representation)
  const completedMatches = matches.filter(m => m.status === 'Completed');
  const winCount = completedMatches.filter(m => m.ourScore > m.opponentScore).length;

  // 2. Chart Data
  // Attendance Trend
  const attendanceData = [
    { date: '05/10', rate: 85 },
    { date: '05/12', rate: 90 },
    { date: '05/15', rate: 92 },
    { date: '05/19', rate: 95 },
    { date: '05/21', rate: 83 },
  ];

  // Training Load representation (hours per training type)
  const loadByType = trainingSessions.reduce((acc, ts) => {
    const hours = ts.durationMinutes / 60;
    acc[ts.type] = (acc[ts.type] || 0) + hours;
    return acc;
  }, {} as Record<string, number>);

  const trainingLoadData = Object.entries(loadByType).map(([name, hours]) => ({
    name: language === 'ar' ? t(name.toLowerCase() as any) : name,
    hours,
  }));

  // Player Status distribution
  const statusCounts = players.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const COLORS = ['#10b981', '#ef4444', '#6b7280', '#f59e0b'];
  const playerStatusData = Object.entries(statusCounts).map(([status, value]) => ({
    name: language === 'ar' ? t(status.charAt(0).toLowerCase() + status.slice(1) as any) : status,
    value,
  }));

  const winLossData = [
    { name: language === 'ar' ? 'فوز' : 'Wins', value: winCount || 3, color: '#10b981' },
    { name: language === 'ar' ? 'خسارة' : 'Losses', value: (completedMatches.length - winCount) || 1, color: '#f43f5e' },
  ];

  // 3. KPI Cards Configurations
  const kpis = [
    {
      title: language === 'ar' ? 'إجمالي اللاعبين' : 'Total Players',
      value: totalPlayersCount,
      sub: `${players.filter(p => p.status === 'Active').length} ${t('active')}`,
      icon: Users,
      colorClass: 'from-blue-500/20 to-indigo-500/10 text-blue-500 border-blue-500/20',
      trend: '+2 new'
    },
    {
      title: language === 'ar' ? 'معدل الحضور' : 'Attendance Rate',
      value: `${avgAttendanceRate}%`,
      sub: t('vsLastMonth'),
      icon: CheckCircle2,
      colorClass: 'from-emerald-500/20 to-teal-500/10 text-emerald-500 border-emerald-500/20',
      trend: '+2.1%'
    },
    {
      title: language === 'ar' ? 'التدريبات القادمة' : 'Upcoming Trainings',
      value: upcomingTrainingsCount,
      sub: language === 'ar' ? 'الأسبوع الحالي' : 'Scheduled this week',
      icon: Calendar,
      colorClass: 'from-blue-500/20 to-cyan-500/10 text-cyan-500 border-cyan-500/20',
      trend: 'Practice load: 5h'
    },
    {
      title: language === 'ar' ? 'المباريات القادمة' : 'Upcoming Matches',
      value: upcomingMatchesCount,
      sub: t('winStreak'),
      icon: Trophy,
      colorClass: 'from-amber-500/20 to-orange-500/10 text-amber-500 border-amber-500/20',
      trend: 'Next: May 25'
    },
    {
      title: language === 'ar' ? 'تنبيهات الإصابة' : 'Injury Alerts',
      value: injuredPlayersCount,
      sub: language === 'ar' ? 'قيد التأهيل الطبي' : 'In rehab program',
      icon: ShieldAlert,
      colorClass: 'from-red-500/20 to-rose-500/10 text-red-500 border-red-500/20',
      trend: '1 player'
    },
    {
      title: language === 'ar' ? 'حضور الطاقم الفني' : 'Staff Attendance',
      value: `${staffAttendanceRate}%`,
      sub: language === 'ar' ? 'المدربين والأطباء' : 'Coaches & Medicals',
      icon: ClipboardCheck,
      colorClass: 'from-violet-500/20 to-purple-500/10 text-violet-500 border-violet-500/20',
      trend: 'Optimal'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-800 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-start">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    {kpi.title}
                  </span>
                  <div className="text-xl font-black text-foreground">
                    {kpi.value}
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border bg-gradient-to-br ${kpi.colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex justify-between items-center text-[9px] mt-2 pt-2 border-t border-border/50">
                <span className="text-muted-foreground truncate max-w-[100px]">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance chart */}
        <div className="p-5 rounded-2xl glass-card text-start flex flex-col h-[320px]">
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

        {/* Training Load (Bar Chart) */}
        <div className="p-5 rounded-2xl glass-card text-start flex flex-col h-[320px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            {language === 'ar' ? 'توزيع حمل التدريب (ساعات)' : 'Training Load Distribution (Hours)'}
          </h3>
          <div className="flex-1 w-full text-xs min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="name" stroke="#888" tickLine={false} />
                <YAxis stroke="#888" tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--sidebar-bg)', 
                    borderColor: 'var(--sidebar-border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)'
                  }} 
                />
                <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Status Distribution (Pie chart) */}
        <div className="p-5 rounded-2xl glass-card text-start flex flex-col h-[320px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            {language === 'ar' ? 'توزيع حالات اللاعبين' : 'Player Status Distribution'}
          </h3>
          <div className="flex-1 w-full text-xs min-h-0 flex flex-col justify-center">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={playerStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {playerStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2">
              {playerStatusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-[11px]">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-medium text-muted-foreground">{entry.name}</span>
                  <span className="font-bold text-foreground">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Performance Win/Loss */}
        <div className="p-5 rounded-2xl glass-card text-start flex flex-col h-[320px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            {t('winLossBreakdown')}
          </h3>
          <div className="flex-1 w-full text-xs min-h-0 flex flex-col justify-center">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
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

        {/* Quick Actions & Upcoming Events combo */}
        <div className="p-5 rounded-2xl glass-card text-start flex flex-col justify-between h-[320px]">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              {language === 'ar' ? 'الحدث القادم' : 'Upcoming Main Event'}
            </h3>
            
            {matches.filter(m => m.status === 'Scheduled').slice(0, 1).map(match => (
              <div key={match.id} className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl text-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-amber-500 font-bold uppercase block">{language === 'ar' ? 'مباراة مجدولة' : 'Match Day'}</span>
                    <h4 className="font-black text-foreground text-sm mt-0.5">
                      vs {language === 'ar' ? match.opponentAr : match.opponentEn}
                    </h4>
                  </div>
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                
                <div className="space-y-1.5 text-muted-foreground text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(match.date).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? match.locationAr : match.locationEn}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('matches')}
                  className="w-full h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  {language === 'ar' ? 'فتح لوحة التشكيلة والدوران' : 'Open Rotation Board'}
                </button>
              </div>
            ))}

            {matches.filter(m => m.status === 'Scheduled').length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-xs">
                {language === 'ar' ? 'لا توجد مباريات قادمة' : 'No upcoming matches scheduled'}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('players')}
              className="flex-1 h-10 bg-muted/40 hover:bg-muted/70 text-foreground border border-border rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addPlayerShortcut')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('attendance')}
              className="flex-1 h-10 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>{t('checkInPlayers')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="p-5 rounded-2xl glass-card text-start flex flex-col justify-between">
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
                    <span className="text-[9px] text-muted-foreground shrink-0 font-medium font-mono">
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
  );
}
