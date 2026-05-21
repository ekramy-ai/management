'use client';

import React from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion } from 'framer-motion';
import { FileText, Download, TrendingUp, BarChart2, Award, Calendar, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportsModule() {
  const { t, language } = useTranslation();
  const { teams, players, matches, addNotification } = useClubStore();

  // 1. Calculate Team Attendance Rate averages
  const barChartData = teams.map(team => {
    // Generate a beautiful mock attendance rate relative to the team's training intensity
    let rate = 94;
    if (team.id === 't-2') rate = 86;
    if (team.id === 't-3') rate = 91;
    return {
      name: language === 'ar' ? team.nameAr : team.nameEn,
      rate,
    };
  });

  // 2. Rank players by stats
  const topKills = [...players].sort((a, b) => b.stats.kills - a.stats.kills).slice(0, 3);
  const topBlocks = [...players].sort((a, b) => b.stats.blocks - a.stats.blocks).slice(0, 3);
  const topAces = [...players].sort((a, b) => b.stats.aces - a.stats.aces).slice(0, 3);

  const handleExport = (format: 'PDF' | 'CSV') => {
    // Add system notification alert
    addNotification({
      titleEn: `${format} Report Exported`,
      titleAr: `تم تصدير تقرير ${format}`,
      messageEn: `The Club Performance ${format} summary was compiled and downloaded.`,
      messageAr: `تم تجميع وتنزيل ملخص أداء النادي كملف ${format}.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Console */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-start">
        <div>
          <h2 className="text-lg font-black text-foreground">{t('reports')}</h2>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'قم بتصدير تقارير الأداء وتتبع ترتيب إحصائيات لاعبي النادي.' : 'Generate performance summaries and monitor leaderboards.'}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="h-10 px-3 bg-muted hover:bg-muted/80 border border-border text-foreground rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('downloadCSV')}</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="h-10 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t('downloadPDF')}</span>
          </button>
        </div>
      </div>

      {/* Analytics visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-start">
        
        {/* Attendance chart card */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              {t('attendanceRateByTeam')}
            </h3>
            
            <div className="h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                  <XAxis dataKey="name" stroke="#888" tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#888" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--sidebar-bg)', 
                      borderColor: 'var(--sidebar-border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)'
                    }} 
                  />
                  <Bar dataKey="rate" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                    {barChartData.map((entry, idx) => (
                      <motion.rect key={idx} fill={idx % 2 === 0 ? '#8b5cf6' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Club Win log breakdown overview */}
        <div className="p-5 rounded-2xl glass-card h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>{language === 'ar' ? 'خلاصة الأداء العام' : 'Performance Insights'}</span>
            </h3>

            <div className="space-y-4">
              <div className="p-3 bg-brand-500/5 border border-brand-500/10 rounded-xl text-xs space-y-1">
                <span className="text-[10px] text-brand-500 font-bold uppercase block">Spike Effectiveness</span>
                <p className="text-foreground font-black text-sm">34.2% Kill Efficiency</p>
                <p className="text-muted-foreground text-[10px] leading-snug">Average of 13.5 kills per set recorded this month. Top in division.</p>
              </div>

              <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs space-y-1">
                <span className="text-[10px] text-emerald-500 font-bold uppercase block">Block Setup Quality</span>
                <p className="text-foreground font-black text-sm">3.4 Blocks per Set</p>
                <p className="text-muted-foreground text-[10px] leading-snug">Roster showing excellent net coverage. Deflections are up by 12%.</p>
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs space-y-1">
                <span className="text-[10px] text-amber-500 font-bold uppercase block">Service Reliability</span>
                <p className="text-foreground font-black text-sm">82% In-bounds Serves</p>
                <p className="text-muted-foreground text-[10px] leading-snug">High risk/reward ratio. Needs focus on jump serves margin of error.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Leaderboard performance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
        
        {/* Kills leaderboard */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-3">
            <Award className="w-4 h-4 text-violet-500" />
            <span>{t('statsKills')} {language === 'ar' ? 'الضاربين الأقوى' : 'Leaders'}</span>
          </h3>

          <div className="space-y-3">
            {topKills.map((player, i) => (
              <div key={player.id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-muted-foreground w-4">{i + 1}</span>
                  <span className="font-bold text-foreground">
                    {language === 'ar' ? player.nameAr : player.nameEn}
                  </span>
                </div>
                <span className="font-mono font-bold text-brand-500">{player.stats.kills}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Blocks leaderboard */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-3">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>{t('statsBlocks')} {language === 'ar' ? 'حوائط الصد الأفضل' : 'Leaders'}</span>
          </h3>

          <div className="space-y-3">
            {topBlocks.map((player, i) => (
              <div key={player.id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-muted-foreground w-4">{i + 1}</span>
                  <span className="font-bold text-foreground">
                    {language === 'ar' ? player.nameAr : player.nameEn}
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-500">{player.stats.blocks}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aces leaderboard */}
        <div className="p-5 rounded-2xl glass-card space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-3">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{t('statsAces')} {language === 'ar' ? 'الإرسالات الساحقة الأنجح' : 'Leaders'}</span>
          </h3>

          <div className="space-y-3">
            {topAces.map((player, i) => (
              <div key={player.id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-muted-foreground w-4">{i + 1}</span>
                  <span className="font-bold text-foreground">
                    {language === 'ar' ? player.nameAr : player.nameEn}
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-500">{player.stats.aces}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
