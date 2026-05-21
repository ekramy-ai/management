'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../locales/useTranslation';
import { useClubStore } from '../../store/clubStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Trash2, Edit2, ShieldAlert, X, Search, Activity, 
  ChevronRight, ArrowUpDown, Shield, Info, BarChart2
} from 'lucide-react';
import { Player, PlayerPosition, PlayerStatus } from '../../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function PlayersModule() {
  const { t, language } = useTranslation();
  const { players, teams, addPlayer, updatePlayer, deletePlayer } = useClubStore();

  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Modal forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Form Fields
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [teamId, setTeamId] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState(1);
  const [position, setPosition] = useState<PlayerPosition>('Outside Hitter');
  const [status, setStatus] = useState<PlayerStatus>('Active');
  const [height, setHeight] = useState(195);
  const [weight, setWeight] = useState(90);
  const [birthDate, setBirthDate] = useState('1998-01-01');
  const [nationalityEn, setNationalityEn] = useState('');
  const [nationalityAr, setNationalityAr] = useState('');
  
  // Stats Form Fields
  const [kills, setKills] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [aces, setAces] = useState(0);
  const [digs, setDigs] = useState(0);
  const [assists, setAssists] = useState(0);
  const [matchesPlayed, setMatchesPlayed] = useState(0);

  const openAddModal = () => {
    setEditingPlayer(null);
    setNameEn('');
    setNameAr('');
    setTeamId(teams[0]?.id || '');
    setJerseyNumber(1);
    setPosition('Outside Hitter');
    setStatus('Active');
    setHeight(195);
    setWeight(90);
    setBirthDate('1998-01-01');
    setNationalityEn('United States');
    setNationalityAr('الولايات المتحدة');
    setKills(0);
    setBlocks(0);
    setAces(0);
    setDigs(0);
    setAssists(0);
    setMatchesPlayed(0);
    setIsModalOpen(true);
  };

  const openEditModal = (player: Player, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting the player
    setEditingPlayer(player);
    setNameEn(player.nameEn);
    setNameAr(player.nameAr);
    setTeamId(player.teamId || '');
    setJerseyNumber(player.jerseyNumber);
    setPosition(player.position);
    setStatus(player.status);
    setHeight(player.height);
    setWeight(player.weight);
    setBirthDate(player.birthDate);
    setNationalityEn(player.nationalityEn);
    setNationalityAr(player.nationalityAr);
    setKills(player.stats.kills);
    setBlocks(player.stats.blocks);
    setAces(player.stats.aces);
    setDigs(player.stats.digs);
    setAssists(player.stats.assists);
    setMatchesPlayed(player.stats.matchesPlayed);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !nameAr) return;

    const payload = {
      nameEn,
      nameAr,
      teamId: teamId || undefined,
      jerseyNumber: Number(jerseyNumber),
      position,
      status,
      height: Number(height),
      weight: Number(weight),
      birthDate,
      nationalityEn,
      nationalityAr,
      stats: {
        kills: Number(kills),
        blocks: Number(blocks),
        aces: Number(aces),
        digs: Number(digs),
        assists: Number(assists),
        matchesPlayed: Number(matchesPlayed)
      }
    };

    if (editingPlayer) {
      updatePlayer(editingPlayer.id, payload);
      // Synchronize selection if currently viewing this player
      if (selectedPlayer?.id === editingPlayer.id) {
        setSelectedPlayer({ ...selectedPlayer, ...payload, stats: { ...payload.stats } });
      }
    } else {
      addPlayer(payload);
    }

    setIsModalOpen(false);
  };

  // Filtered List
  const filteredPlayers = players.filter(p => {
    const matchesSearch = 
      p.nameEn.toLowerCase().includes(search.toLowerCase()) || 
      p.nameAr.includes(search) || 
      String(p.jerseyNumber) === search;
    const matchesTeam = teamFilter === 'all' || p.teamId === teamFilter;
    const matchesPosition = positionFilter === 'all' || p.position === positionFilter;
    return matchesSearch && matchesTeam && matchesPosition;
  });

  const getTeamName = (pTeamId?: string) => {
    const team = teams.find(t => t.id === pTeamId);
    if (!team) return t('none');
    return language === 'ar' ? team.nameAr : team.nameEn;
  };

  const radarData = selectedPlayer ? [
    { subject: t('statsKills'), value: Math.min(100, (selectedPlayer.stats.kills / (selectedPlayer.stats.matchesPlayed || 1)) * 5) },
    { subject: t('statsBlocks'), value: Math.min(100, (selectedPlayer.stats.blocks / (selectedPlayer.stats.matchesPlayed || 1)) * 20) },
    { subject: t('statsAces'), value: Math.min(100, (selectedPlayer.stats.aces / (selectedPlayer.stats.matchesPlayed || 1)) * 30) },
    { subject: t('statsDigs'), value: Math.min(100, (selectedPlayer.stats.digs / (selectedPlayer.stats.matchesPlayed || 1)) * 8) },
    { subject: t('statsAssists'), value: Math.min(100, (selectedPlayer.stats.assists / (selectedPlayer.stats.matchesPlayed || 1)) * 4) }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Top Console */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-start">
        <div>
          <h2 className="text-lg font-black text-foreground">{t('players')}</h2>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'أرشيف بطاقات وإحصائيات لاعبي النادي.' : 'Roster profile database and statistics.'}</p>
        </div>
        <button
          onClick={openAddModal}
          className="h-10 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add')}</span>
        </button>
      </div>

      {/* Filters & Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Main List Table */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* Controls Bar */}
          <div className="p-4 rounded-xl glass-card flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute start-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`${t('playerName')}, ${t('jersey')}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 ps-9 pe-3 text-xs bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
              />
            </div>
            
            <div className="grid grid-cols-2 md:flex gap-3">
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="h-10 px-3 text-xs bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
              >
                <option value="all">{language === 'ar' ? 'كل الفرق' : 'All Teams'}</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{language === 'ar' ? t.nameAr : t.nameEn}</option>
                ))}
              </select>

              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="h-10 px-3 text-xs bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
              >
                <option value="all">{language === 'ar' ? 'كل المراكز' : 'All Positions'}</option>
                <option value="Setter">{t('setter')}</option>
                <option value="Outside Hitter">{t('outsideHitter')}</option>
                <option value="Opposite Hitter">{t('oppositeHitter')}</option>
                <option value="Middle Blocker">{t('middleBlocker')}</option>
                <option value="Libero">{t('libero')}</option>
                <option value="Defensive Specialist">{t('defensiveSpecialist')}</option>
              </select>
            </div>
          </div>

          {/* Directory Table */}
          <div className="rounded-xl glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold h-10 select-none">
                    <th className="px-4 text-start font-bold">{t('jersey')}</th>
                    <th className="px-4 text-start font-bold">{t('playerName')}</th>
                    <th className="px-4 text-start font-bold">{t('teams')}</th>
                    <th className="px-4 text-start font-bold">{t('position')}</th>
                    <th className="px-4 text-start font-bold">{t('status')}</th>
                    <th className="px-4 text-end font-bold">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        {t('noData')}
                      </td>
                    </tr>
                  ) : (
                    filteredPlayers.map((player) => (
                      <tr
                        key={player.id}
                        onClick={() => setSelectedPlayer(player)}
                        className={`hover:bg-muted/30 transition-colors duration-150 h-12 cursor-pointer ${
                          selectedPlayer?.id === player.id ? 'bg-brand-500/5' : ''
                        }`}
                      >
                        <td className="px-4 font-mono font-bold text-brand-500 text-start">
                          #{player.jerseyNumber}
                        </td>
                        <td className="px-4 text-start">
                          <div className="font-bold text-foreground">
                            {language === 'ar' ? player.nameAr : player.nameEn}
                          </div>
                        </td>
                        <td className="px-4 text-start text-muted-foreground font-medium">
                          {getTeamName(player.teamId)}
                        </td>
                        <td className="px-4 text-start">
                          <span className="px-2 py-0.5 rounded-full bg-muted border border-border font-medium text-[10px] text-foreground/80">
                            {t(player.position.charAt(0).toLowerCase() + player.position.slice(1) as any)}
                          </span>
                        </td>
                        <td className="px-4 text-start">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            player.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                            player.status === 'Injured' ? 'bg-red-500/10 text-red-500' :
                            'bg-amber-500/10 text-amber-500'
                          }`}>
                            {t(player.status.charAt(0).toLowerCase() + player.status.slice(1) as any)}
                          </span>
                        </td>
                        <td className="px-4 text-end" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={(e) => openEditModal(player, e)}
                              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deletePlayer(player.id)}
                              className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed Insights Sidebar */}
        <div className="xl:col-span-1">
          {selectedPlayer ? (
            <motion.div
              layoutId="player-details"
              className="p-5 rounded-2xl glass-card text-start space-y-5"
            >
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-500 font-mono">
                    #{selectedPlayer.jerseyNumber} • {t(selectedPlayer.position.charAt(0).toLowerCase() + selectedPlayer.position.slice(1) as any)}
                  </span>
                  <h3 className="text-sm font-black text-foreground">
                    {language === 'ar' ? selectedPlayer.nameAr : selectedPlayer.nameEn}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Radar Graph */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <BarChart2 className="w-3.5 h-3.5 text-brand-500" />
                  <span>{t('performanceRadar')}</span>
                </h4>
                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="rgba(128,128,128,0.1)" />
                      <PolarAngleAxis dataKey="subject" stroke="#888" fontSize={9} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888" fontSize={8} />
                      <Radar name="Stats" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Roster parameters */}
              <div className="space-y-2.5 border-t border-border pt-4 text-xs">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  <span>{t('personalDetails')}</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground text-[10px]">{t('height')}</span>
                    <p className="font-bold text-foreground">{selectedPlayer.height} cm</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground text-[10px]">{t('weight')}</span>
                    <p className="font-bold text-foreground">{selectedPlayer.weight} kg</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground text-[10px]">{t('birthDate')}</span>
                    <p className="font-bold text-foreground">{selectedPlayer.birthDate}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground text-[10px]">{t('nationality')}</span>
                    <p className="font-bold text-foreground">
                      {language === 'ar' ? selectedPlayer.nationalityAr : selectedPlayer.nationalityEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Raw Counts */}
              <div className="space-y-2 border-t border-border pt-4 text-xs">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('statistics')}</span>
                </h4>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-muted/30 border border-border/50 rounded-lg">
                    <span className="text-muted-foreground text-[9px] block truncate">{t('statsMatches')}</span>
                    <span className="font-bold text-foreground text-sm font-mono">{selectedPlayer.stats.matchesPlayed}</span>
                  </div>
                  <div className="p-2 bg-muted/30 border border-border/50 rounded-lg">
                    <span className="text-muted-foreground text-[9px] block truncate">{t('statsKills')}</span>
                    <span className="font-bold text-foreground text-sm font-mono">{selectedPlayer.stats.kills}</span>
                  </div>
                  <div className="p-2 bg-muted/30 border border-border/50 rounded-lg">
                    <span className="text-muted-foreground text-[9px] block truncate">{t('statsBlocks')}</span>
                    <span className="font-bold text-foreground text-sm font-mono">{selectedPlayer.stats.blocks}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-8 rounded-2xl glass-card text-center text-muted-foreground text-xs h-64 flex flex-col items-center justify-center">
              <Users className="w-8 h-8 opacity-20 mb-2" />
              <span>{language === 'ar' ? 'حدد لاعباً من الجدول لاستعراض تحليل إحصائياته الفنية والبدنية.' : 'Select a player from the directory to review technical performance and biometrics.'}</span>
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
              className="relative w-full max-w-2xl p-6 bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto z-10 text-start"
            >
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h3 className="font-bold text-sm text-foreground">
                  {editingPlayer ? t('editPlayer') : t('createPlayer')}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
                <h4 className="font-bold text-[10px] uppercase text-brand-500 tracking-wider mb-2">{t('personalDetails')}</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Player Name (EN)</label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">اسم اللاعب (AR)</label>
                    <input
                      type="text"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('teams')}</label>
                    <select
                      value={teamId}
                      onChange={(e) => setTeamId(e.target.value)}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    >
                      <option value="">{t('none')}</option>
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{language === 'ar' ? t.nameAr : t.nameEn}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('jersey')}</label>
                    <input
                      type="number"
                      value={jerseyNumber}
                      onChange={(e) => setJerseyNumber(Number(e.target.value))}
                      required
                      min={1}
                      max={99}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('position')}</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value as PlayerPosition)}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    >
                      <option value="Setter">Setter</option>
                      <option value="Outside Hitter">Outside Hitter</option>
                      <option value="Opposite Hitter">Opposite Hitter</option>
                      <option value="Middle Blocker">Middle Blocker</option>
                      <option value="Libero">Libero</option>
                      <option value="Defensive Specialist">Defensive Specialist</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('height')} (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('weight')} (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-muted-foreground">{t('birthDate')}</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Nationality (EN)</label>
                    <input
                      type="text"
                      value={nationalityEn}
                      onChange={(e) => setNationalityEn(e.target.value)}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">الجنسية (AR)</label>
                    <input
                      type="text"
                      value={nationalityAr}
                      onChange={(e) => setNationalityAr(e.target.value)}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">{t('status')}</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as PlayerStatus)}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border focus:outline-none focus:border-brand-500 text-foreground"
                    >
                      <option value="Active">Active</option>
                      <option value="Injured">Injured</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                {/* STATS BLOCK */}
                <h4 className="font-bold text-[10px] uppercase text-emerald-500 tracking-wider mb-2 pt-2 border-t border-border">{t('statistics')}</h4>
                
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[10px] text-muted-foreground">{t('statsMatches')}</label>
                    <input
                      type="number"
                      value={matchesPlayed}
                      onChange={(e) => setMatchesPlayed(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[10px] text-muted-foreground">{t('statsKills')}</label>
                    <input
                      type="number"
                      value={kills}
                      onChange={(e) => setKills(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[10px] text-muted-foreground">{t('statsBlocks')}</label>
                    <input
                      type="number"
                      value={blocks}
                      onChange={(e) => setBlocks(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[10px] text-muted-foreground">{t('statsAces')}</label>
                    <input
                      type="number"
                      value={aces}
                      onChange={(e) => setAces(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[10px] text-muted-foreground">{t('statsDigs')}</label>
                    <input
                      type="number"
                      value={digs}
                      onChange={(e) => setDigs(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[10px] text-muted-foreground">{t('statsAssists')}</label>
                    <input
                      type="number"
                      value={assists}
                      onChange={(e) => setAssists(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-muted/40 rounded-lg border border-border"
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
