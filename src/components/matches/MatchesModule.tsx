'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus, Edit2, Trash2, X, Calendar, MapPin, Activity, Sliders } from 'lucide-react';
import { Match, MatchStatus, SetScore } from '../../types';

export default function MatchesModule() {
  const { t, language } = useTranslation();
  const { matches, teams, players, addMatch, updateMatch, deleteMatch } = useClubStore();

  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id || '');
  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  // Form Fields
  const [teamId, setTeamId] = useState('');
  const [opponentEn, setOpponentEn] = useState('');
  const [opponentAr, setOpponentAr] = useState('');
  const [date, setDate] = useState('2026-05-25T18:00:00Z');
  const [locationEn, setLocationEn] = useState('');
  const [locationAr, setLocationAr] = useState('');
  const [status, setStatus] = useState<MatchStatus>('Scheduled');
  const [ourScore, setOurScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  
  // Set scores (max 5 sets in volleyball)
  const [set1Our, setSet1Our] = useState(0);
  const [set1Opp, setSet1Opp] = useState(0);
  const [set2Our, setSet2Our] = useState(0);
  const [set2Opp, setSet2Opp] = useState(0);
  const [set3Our, setSet3Our] = useState(0);
  const [set3Opp, setSet3Opp] = useState(0);
  const [set4Our, setSet4Our] = useState(0);
  const [set4Opp, setSet4Opp] = useState(0);
  const [set5Our, setSet5Our] = useState(0);
  const [set5Opp, setSet5Opp] = useState(0);

  // Court Rotation alignment (Positions 1 to 6)
  const teamPlayers = players.filter(p => p.teamId === selectedMatch?.teamId);

  const getPositionPlayer = (posIdx: number) => {
    if (!selectedMatch?.rotation) return '';
    return selectedMatch.rotation[posIdx] || '';
  };

  const handleSetRotationPlayer = (posIdx: number, playerId: string) => {
    if (!selectedMatch) return;
    const currentRotation = selectedMatch.rotation ? [...selectedMatch.rotation] : ['', '', '', '', '', ''];
    currentRotation[posIdx] = playerId;
    updateMatch(selectedMatch.id, { rotation: currentRotation });
  };

  const openAddModal = () => {
    setEditingMatch(null);
    setTeamId(teams[0]?.id || '');
    setOpponentEn('');
    setOpponentAr('');
    setDate('2026-05-25T18:00:00Z');
    setLocationEn('VolleyClub Court A');
    setLocationAr('ملعب النادي صالة أ');
    setStatus('Scheduled');
    setOurScore(0);
    setOpponentScore(0);
    setSet1Our(0); setSet1Opp(0);
    setSet2Our(0); setSet2Opp(0);
    setSet3Our(0); setSet3Opp(0);
    setSet4Our(0); setSet4Opp(0);
    setSet5Our(0); setSet5Opp(0);
    setIsModalOpen(true);
  };

  const openEditModal = (match: Match) => {
    setEditingMatch(match);
    setTeamId(match.teamId);
    setOpponentEn(match.opponentEn);
    setOpponentAr(match.opponentAr);
    setDate(match.date);
    setLocationEn(match.locationEn);
    setLocationAr(match.locationAr);
    setStatus(match.status);
    setOurScore(match.ourScore);
    setOpponentScore(match.opponentScore);
    
    // Fill set scores if they exist
    setSet1Our(match.setScores[0]?.home || 0);
    setSet1Opp(match.setScores[0]?.away || 0);
    setSet2Our(match.setScores[1]?.home || 0);
    setSet2Opp(match.setScores[1]?.away || 0);
    setSet3Our(match.setScores[2]?.home || 0);
    setSet3Opp(match.setScores[2]?.away || 0);
    setSet4Our(match.setScores[3]?.home || 0);
    setSet4Opp(match.setScores[3]?.away || 0);
    setSet5Our(match.setScores[4]?.home || 0);
    setSet5Opp(match.setScores[4]?.away || 0);
    
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponentEn || !opponentAr || !teamId) return;

    // Filter non-zero sets for completed matches
    const setScores: SetScore[] = [];
    if (set1Our > 0 || set1Opp > 0) setScores.push({ home: set1Our, away: set1Opp });
    if (set2Our > 0 || set2Opp > 0) setScores.push({ home: set2Our, away: set2Opp });
    if (set3Our > 0 || set3Opp > 0) setScores.push({ home: set3Our, away: set3Opp });
    if (set4Our > 0 || set4Opp > 0) setScores.push({ home: set4Our, away: set4Opp });
    if (set5Our > 0 || set5Opp > 0) setScores.push({ home: set5Our, away: set5Opp });

    const payload = {
      teamId,
      opponentEn,
      opponentAr,
      date,
      locationEn,
      locationAr,
      status,
      ourScore: Number(ourScore),
      opponentScore: Number(opponentScore),
      setScores,
      rotation: editingMatch?.rotation || ['', '', '', '', '', '']
    };

    if (editingMatch) {
      updateMatch(editingMatch.id, payload);
    } else {
      addMatch(payload);
    }

    setIsModalOpen(false);
  };

  const getTeamName = (pTeamId: string) => {
    const team = teams.find(t => t.id === pTeamId);
    if (!team) return '';
    return language === 'ar' ? team.nameAr : team.nameEn;
  };

  const volleyballPositions = [
    { label: 'Pos 4 (Front-Left)', index: 3, gridArea: 'col-start-1 row-start-1' },
    { label: 'Pos 3 (Front-Middle)', index: 2, gridArea: 'col-start-2 row-start-1' },
    { label: 'Pos 2 (Front-Right)', index: 1, gridArea: 'col-start-3 row-start-1' },
    { label: 'Pos 5 (Back-Left)', index: 4, gridArea: 'col-start-1 row-start-2' },
    { label: 'Pos 6 (Back-Middle)', index: 5, gridArea: 'col-start-2 row-start-2' },
    { label: 'Pos 1 (Back-Right / Server)', index: 0, gridArea: 'col-start-3 row-start-2' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Console */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-start">
        <div>
          <h2 className="text-lg font-black text-foreground">{t('matches')}</h2>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'قم بتسجيل وتعديل نتائج مباريات النادي وجدولة تشكيلات الدوران.' : 'Log match results and assign volleyball court rotation tactics.'}</p>
        </div>
        <button
          onClick={openAddModal}
          className="h-10 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20 cursor-pointer animate-fade-in"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add')}</span>
        </button>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start text-start">
        
        {/* Left list details */}
        <div className="xl:col-span-1 space-y-4">
          <div className="rounded-xl glass-card overflow-hidden">
            <div className="h-12 bg-muted/40 border-b border-border flex items-center px-4">
              <span className="font-bold text-xs text-foreground uppercase tracking-wider">{t('matches')}</span>
            </div>
            
            <div className="divide-y divide-border/60 max-h-[550px] overflow-y-auto">
              {matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatchId(match.id)}
                  className={`p-4 hover:bg-muted/30 transition-colors duration-150 cursor-pointer flex justify-between items-center text-xs group ${
                    selectedMatchId === match.id ? 'bg-brand-500/5' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-brand-500 uppercase">
                      {getTeamName(match.teamId)}
                    </span>
                    <h4 className="font-black text-foreground">
                      vs {language === 'ar' ? match.opponentAr : match.opponentEn}
                    </h4>
                    <span className="text-[9px] text-muted-foreground block">{match.date.split('T')[0]}</span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    {match.status === 'Completed' ? (
                      <div className="flex items-center gap-1">
                        <span className="font-black text-foreground text-sm font-mono">{match.ourScore}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="font-black text-foreground text-sm font-mono">{match.opponentScore}</span>
                      </div>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold text-[9px] uppercase">
                        {match.status}
                      </span>
                    )}

                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(match); }}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMatch(match.id); }}
                        className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Rotation Board Panel */}
        <div className="xl:col-span-2">
          {selectedMatch ? (
            <div className="p-5 rounded-2xl glass-card space-y-6">
              
              {/* Score summary head */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{getTeamName(selectedMatch.teamId)}</span>
                  <h3 className="text-sm font-black text-foreground">
                    vs {language === 'ar' ? selectedMatch.opponentAr : selectedMatch.opponentEn}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedMatch.date.split('T')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {language === 'ar' ? selectedMatch.locationAr : selectedMatch.locationEn}
                    </span>
                  </div>
                </div>

                {selectedMatch.status === 'Completed' && (
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">{t('setScoresLabel')}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedMatch.setScores.map((score, i) => (
                        <span key={i} className="px-2 py-0.5 bg-muted rounded font-mono font-bold text-[10px] text-foreground border border-border">
                          {score.home}-{score.away}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Court Alignment Visual Block */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-brand-500" />
                    <span>{t('rotationBoard')}</span>
                  </h4>
                  <span className="text-[10px] text-muted-foreground max-w-[200px] leading-snug">
                    {t('rotationHelper')}
                  </span>
                </div>

                {/* Simulated wood volleyball court */}
                <div className="court-surface-outer p-4 rounded-2xl shadow-inner max-w-lg mx-auto overflow-hidden">
                  <div className="court-surface rounded-xl p-4 grid grid-cols-3 grid-rows-2 gap-y-12 gap-x-6 min-h-[260px] relative">
                    
                    {/* Court Net Line overlay */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 court-line-net court-net-mesh" />

                    {volleyballPositions.map((pos, idx) => {
                      const currentPlayerId = getPositionPlayer(pos.index);
                      return (
                        <div key={idx} className={`${pos.gridArea} flex flex-col items-center gap-2 relative z-10`}>
                          <span className="text-[9px] font-bold text-white uppercase bg-black/40 px-2 py-0.5 rounded-full select-none">
                            {language === 'ar' ? `موقع ${pos.index + 1}` : pos.label.split(' ')[0] + ' ' + pos.label.split(' ')[1]}
                          </span>
                          
                          <div className="w-16 h-16 rounded-full border-4 border-white bg-blue-600/80 shadow-md flex items-center justify-center shrink-0 transition-all hover:scale-105">
                            <Activity className="w-8 h-8 text-white/30 absolute" />
                            <select
                              value={currentPlayerId}
                              onChange={(e) => handleSetRotationPlayer(pos.index, e.target.value)}
                              className="w-full h-full rounded-full opacity-100 bg-transparent text-white text-center font-black text-xs cursor-pointer focus:outline-none appearance-none"
                              style={{ padding: '0 4px', textOverflow: 'ellipsis' }}
                            >
                              <option value="" className="text-zinc-800">-</option>
                              {teamPlayers.map(p => (
                                <option key={p.id} value={p.id} className="text-zinc-800">
                                  #{p.jerseyNumber}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Render selected player's name snippet */}
                          {currentPlayerId && (
                            <span className="text-[10px] font-bold text-white bg-zinc-900/80 px-2 py-0.5 rounded truncate max-w-[80px]">
                              {players.find(p => p.id === currentPlayerId)?.nameEn.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Court Map Key */}
                <div className="p-3 bg-muted/30 border border-border/50 rounded-xl text-[10px] text-muted-foreground leading-relaxed flex items-start gap-2">
                  <Activity className="w-4 h-4 text-brand-500 shrink-0" />
                  <div>
                    {language === 'ar'
                      ? 'ملاحظة: الدوران في الكرة الطائرة ينتقل باتجاه عقارب الساعة (1 ← 6 ← 5 ← 4 ← 3 ← 2). المركز 1 هو مركز الإرسال.'
                      : 'Tactics Note: In volleyball, rotation shifts clockwise (1 → 6 → 5 → 4 → 3 → 2). Position 1 represents the active server.'}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl glass-card text-center text-muted-foreground text-xs py-16 flex flex-col items-center justify-center h-64">
              <Trophy className="w-8 h-8 opacity-20 mb-2" />
              <span>{t('noData')}</span>
            </div>
          )}
        </div>

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
              className="relative w-full max-w-2xl p-6 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto z-10 text-start animate-fade-in"
            >
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h3 className="font-bold text-sm text-foreground">
                  {editingMatch ? t('editMatch') : t('createMatch')}
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
                    <label className="font-bold text-muted-foreground">{t('matchStatus')}</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as MatchStatus)}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Live">Live</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Opponent Name (EN)</label>
                    <input
                      type="text"
                      value={opponentEn}
                      onChange={(e) => setOpponentEn(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">اسم الخصم (AR)</label>
                    <input
                      type="text"
                      value={opponentAr}
                      onChange={(e) => setOpponentAr(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('date')}</label>
                    <input
                      type="datetime-local"
                      value={date.slice(0, 16)}
                      onChange={(e) => setDate(new Date(e.target.value).toISOString())}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
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
                </div>

                {status === 'Completed' && (
                  <>
                    <h4 className="font-bold text-[10px] uppercase text-emerald-500 tracking-wider mb-2 pt-2 border-t border-border">Scoreboard Logs</h4>
                    
                    <div className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded-lg border border-border/50">
                      <div className="space-y-1">
                        <label className="font-bold text-muted-foreground">Our Final Sets Score</label>
                        <input
                          type="number"
                          value={ourScore}
                          onChange={(e) => setOurScore(Number(e.target.value))}
                          min={0}
                          max={3}
                          className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-muted-foreground">Opponent Final Sets Score</label>
                        <input
                          type="number"
                          value={opponentScore}
                          onChange={(e) => setOpponentScore(Number(e.target.value))}
                          min={0}
                          max={3}
                          className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-bold text-muted-foreground">Set-by-Set Scores (Our vs Opponent)</label>
                      <div className="grid grid-cols-5 gap-2.5">
                        <div className="space-y-1">
                          <span className="text-[9px] text-muted-foreground font-bold">Set 1</span>
                          <div className="flex gap-1">
                            <input type="number" placeholder="Us" value={set1Our} onChange={(e) => setSet1Our(Number(e.target.value))} className="w-full h-9 bg-muted/40 border border-border text-center" />
                            <input type="number" placeholder="Them" value={set1Opp} onChange={(e) => setSet1Opp(Number(e.target.value))} className="w-full h-9 bg-muted/40 border border-border text-center" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-muted-foreground font-bold">Set 2</span>
                          <div className="flex gap-1">
                            <input type="number" placeholder="Us" value={set2Our} onChange={(e) => setSet2Our(Number(e.target.value))} className="w-full h-9 bg-muted/40 border border-border text-center" />
                            <input type="number" placeholder="Them" value={set2Opp} onChange={(e) => setSet2Opp(Number(e.target.value))} className="w-full h-9 bg-muted/40 border border-border text-center" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-muted-foreground font-bold">Set 3</span>
                          <div className="flex gap-1">
                            <input type="number" placeholder="Us" value={set3Our} onChange={(e) => setSet3Our(Number(e.target.value))} className="w-full h-9 bg-muted/40 border border-border text-center" />
                            <input type="number" placeholder="Them" value={set3Opp} onChange={(e) => setSet3Opp(Number(e.target.value))} className="w-full h-9 bg-muted/40 border border-border text-center" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-muted-foreground font-bold">Set 4</span>
                          <div className="flex gap-1">
                            <input type="number" placeholder="Us" value={set4Our} onChange={(e) => setSet4Our(Number(e.target.value))} className="w-full h-9 bg-muted/40 border border-border text-center" />
                            <input type="number" placeholder="Them" value={set4Opp} onChange={(e) => setSet4Opp(Number(e.target.value))} className="w-full h-9 bg-muted/40 border border-border text-center" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-muted-foreground font-bold">Set 5</span>
                          <div className="flex gap-1">
                            <input type="number" placeholder="Us" value={set5Our} onChange={(e) => setSet5Our(Number(e.target.value))} className="w-full h-9 bg-muted/40 border border-border text-center" />
                            <input type="number" placeholder="Them" value={set5Opp} onChange={(e) => setSet5Opp(Number(e.target.value))} className="w-full h-9 bg-muted/40 border border-border text-center" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

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
