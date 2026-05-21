import { create } from 'zustand';
import { 
  Team, Player, Staff, Match, TrainingSession, 
  AttendanceRecord, SystemNotification, AttendanceStatus, 
  PlayerPosition, PlayerStatus, Role, MatchStatus 
} from '../types';

interface ClubState {
  teams: Team[];
  players: Player[];
  staff: Staff[];
  matches: Match[];
  trainingSessions: TrainingSession[];
  attendance: AttendanceRecord[];
  notifications: SystemNotification[];

  // Team CRUD
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  // Player CRUD
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  // Staff CRUD
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Match CRUD
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;

  // Training CRUD
  addTrainingSession: (session: Omit<TrainingSession, 'id'>) => void;
  updateTrainingSession: (id: string, session: Partial<TrainingSession>) => void;
  deleteTrainingSession: (id: string) => void;

  // Attendance Actions
  setPlayerAttendance: (sessionId: string, sessionType: 'Training' | 'Match', playerId: string, status: AttendanceStatus) => void;
  bulkSetAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;

  // Notification Actions
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

// Initial Mock Data
const initialTeams: Team[] = [
  {
    id: 't-1',
    nameEn: 'Men\'s First Team',
    nameAr: 'الفريق الأول رجال',
    ageGroup: 'Senior',
    gender: 'Men',
    headCoachId: 's-1',
    descriptionEn: 'Elite division squad competing in the Super League.',
    descriptionAr: 'الفريق الرئيسي الذي ينافس في الدوري الممتاز.',
    colorHex: '#3b82f6',
    createdAt: '2025-01-10T12:00:00Z',
  },
  {
    id: 't-2',
    nameEn: 'U19 Elite Boys',
    nameAr: 'فئة الشباب تحت 19 سنة',
    ageGroup: 'U19',
    gender: 'Men',
    headCoachId: 's-2',
    descriptionEn: 'Youth development squad focusing on tactical training.',
    descriptionAr: 'فريق التطوير الفني للشباب للمنافسة الوطنية.',
    colorHex: '#10b981',
    createdAt: '2025-02-15T12:00:00Z',
  },
  {
    id: 't-3',
    nameEn: 'Women\'s First Team',
    nameAr: 'الفريق الأول سيدات',
    ageGroup: 'Senior',
    gender: 'Women',
    headCoachId: 's-3',
    descriptionEn: 'Professional women\'s team striving for national champions.',
    descriptionAr: 'الفريق النسائي الأول للمنافسة في الدوري الممتاز.',
    colorHex: '#ec4899',
    createdAt: '2025-01-12T12:00:00Z',
  }
];

const initialStaff: Staff[] = [
  {
    id: 's-1',
    nameEn: 'Carlos Alberto',
    nameAr: 'كارلوس ألبرتو',
    role: 'Head Coach',
    specializationEn: 'Tactics & Team Rotation',
    specializationAr: 'التكتيكات وتدوير اللاعبين',
    email: 'carlos.coach@volleyclub.com',
    phone: '+1 555-0123',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 's-2',
    nameEn: 'Ahmed Mansoor',
    nameAr: 'أحمد منصور',
    role: 'Assistant Coach',
    specializationEn: 'Defensive Skills & Serves',
    specializationAr: 'المهارات الدفاعية والإرسال',
    email: 'ahmed.m@volleyclub.com',
    phone: '+966 50 123 4567',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 's-3',
    nameEn: 'Sarah Jenkins',
    nameAr: 'سارة جينكينز',
    role: 'Head Coach',
    specializationEn: 'Women\'s Volleyball Systems',
    specializationAr: 'أنظمة لعب طائرة السيدات',
    email: 'sarah.j@volleyclub.com',
    phone: '+1 555-9876',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 's-4',
    nameEn: 'Dr. Khalid Al-Otaibi',
    nameAr: 'د. خالد العتيبي',
    role: 'Physiotherapist',
    specializationEn: 'Sports Medicine & Recovery',
    specializationAr: 'الطب الرياضي والاستشفاء',
    email: 'khalid.pt@volleyclub.com',
    phone: '+966 55 987 6543',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face',
  }
];

const initialPlayers: Player[] = [
  // Men's First Team (t-1)
  {
    id: 'p-1',
    teamId: 't-1',
    nameEn: 'Matthew Anderson',
    nameAr: 'ماتيو أندرسون',
    jerseyNumber: 1,
    position: 'Outside Hitter',
    status: 'Active',
    height: 202,
    weight: 98,
    birthDate: '1995-04-18',
    nationalityEn: 'United States',
    nationalityAr: 'الولايات المتحدة',
    stats: { matchesPlayed: 24, kills: 382, blocks: 45, aces: 38, digs: 120, assists: 15 },
    notesEn: 'Team captain and primary attacker. Key player in rotation.',
    notesAr: 'قائد الفريق والمهاجم الرئيسي. لاعب أساسي في الدوران.',
  },
  {
    id: 'p-2',
    teamId: 't-1',
    nameEn: 'Yuki Ishikawa',
    nameAr: 'يوكي إيشيكاوا',
    jerseyNumber: 14,
    position: 'Outside Hitter',
    status: 'Active',
    height: 191,
    weight: 84,
    birthDate: '1997-12-11',
    nationalityEn: 'Japan',
    nationalityAr: 'اليابان',
    stats: { matchesPlayed: 24, kills: 320, blocks: 32, aces: 42, digs: 210, assists: 22 },
    notesEn: 'Excellent reception capability and jump serve precision.',
    notesAr: 'قدرة استقبال ممتازة ودقة عالية في الإرسال الساحق.',
  },
  {
    id: 'p-3',
    teamId: 't-1',
    nameEn: 'Simone Giannelli',
    nameAr: 'سيموني جيانيلي',
    jerseyNumber: 6,
    position: 'Setter',
    status: 'Active',
    height: 200,
    weight: 92,
    birthDate: '1996-08-09',
    nationalityEn: 'Italy',
    nationalityAr: 'إيطاليا',
    stats: { matchesPlayed: 22, kills: 52, blocks: 58, aces: 18, digs: 154, assists: 982 },
    notesEn: 'World-class playmaker. High blocking range at the net.',
    notesAr: 'صانع ألعاب من طراز عالمي. حائط صد مرتفع ومميز.',
  },
  {
    id: 'p-4',
    teamId: 't-1',
    nameEn: 'Lucas Saatkamp',
    nameAr: 'لوكاس ساتكامب',
    jerseyNumber: 16,
    position: 'Middle Blocker',
    status: 'Active',
    height: 209,
    weight: 101,
    birthDate: '1993-03-06',
    nationalityEn: 'Brazil',
    nationalityAr: 'البرازيل',
    stats: { matchesPlayed: 24, kills: 180, blocks: 88, aces: 25, digs: 48, assists: 8 },
    notesEn: 'Quick attacks from position 3. Dominant net blocker.',
    notesAr: 'هجمات سريعة من المركز 3. مسيطر في حوائط الصد الشبكية.',
  },
  {
    id: 'p-5',
    teamId: 't-1',
    nameEn: 'Jenya Grebennikov',
    nameAr: 'جينيا غريبينيكوف',
    jerseyNumber: 2,
    position: 'Libero',
    status: 'Active',
    height: 188,
    weight: 85,
    birthDate: '1990-08-13',
    nationalityEn: 'France',
    nationalityAr: 'فرنسا',
    stats: { matchesPlayed: 24, kills: 0, blocks: 0, aces: 0, digs: 340, assists: 95 },
    notesEn: 'Phenomenal defensive reactions. Controls court coverage.',
    notesAr: 'ردود فعل دفاعية خرافية. يتحكم بتغطية الملعب كاملاً.',
  },
  {
    id: 'p-6',
    teamId: 't-1',
    nameEn: 'Jean Patry',
    nameAr: 'جان باتري',
    jerseyNumber: 4,
    position: 'Opposite Hitter',
    status: 'Injured',
    height: 207,
    weight: 94,
    birthDate: '1996-12-27',
    nationalityEn: 'France',
    nationalityAr: 'فرنسا',
    stats: { matchesPlayed: 12, kills: 198, blocks: 24, aces: 12, digs: 60, assists: 4 },
    notesEn: 'Recovering from minor ankle sprain. Undergoing daily physical therapy.',
    notesAr: 'يتعافى من التواء بسيط في الكاحل. يخضع لعلاج طبيعي يومي.',
  },

  // Women's First Team (t-3)
  {
    id: 'p-7',
    teamId: 't-3',
    nameEn: 'Paola Egonu',
    nameAr: 'باولا إيغونو',
    jerseyNumber: 18,
    position: 'Opposite Hitter',
    status: 'Active',
    height: 193,
    weight: 79,
    birthDate: '1998-12-18',
    nationalityEn: 'Italy',
    nationalityAr: 'إيطاليا',
    stats: { matchesPlayed: 20, kills: 420, blocks: 36, aces: 45, digs: 110, assists: 12 },
    notesEn: 'Unrivaled jump spike height. Highest scorer of the squad.',
    notesAr: 'ارتفاع ساحق لا يضاهى. الهدافة الأعلى في التشكيلة.',
  },
  {
    id: 'p-8',
    teamId: 't-3',
    nameEn: 'Maja Ognjenović',
    nameAr: 'مايا أوغنينوفيتش',
    jerseyNumber: 10,
    position: 'Setter',
    status: 'Active',
    height: 183,
    weight: 68,
    birthDate: '1984-05-17',
    nationalityEn: 'Serbia',
    nationalityAr: 'صربيا',
    stats: { matchesPlayed: 20, kills: 38, blocks: 42, aces: 15, digs: 130, assists: 865 },
    notesEn: 'Highly experienced setter with precise tactical distribution.',
    notesAr: 'معدة خبيرة جداً ولديها دقة توزيع تكتيكي ممتازة.',
  },
  {
    id: 'p-9',
    teamId: 't-3',
    nameEn: 'Gabriela Guimarães',
    nameAr: 'غابرييلا غيماريش',
    jerseyNumber: 10,
    position: 'Outside Hitter',
    status: 'Active',
    height: 180,
    weight: 65,
    birthDate: '1994-05-19',
    nationalityEn: 'Brazil',
    nationalityAr: 'البرازيل',
    stats: { matchesPlayed: 20, kills: 275, blocks: 28, aces: 22, digs: 245, assists: 31 },
    notesEn: 'Outstanding court captain. Exceptional digger and receiver.',
    notesAr: 'قائدة ملعب رائعة. مدافعة ومستقبلة استثنائية.',
  }
];

const initialMatches: Match[] = [
  {
    id: 'm-1',
    teamId: 't-1',
    opponentEn: 'Al Hilal VC',
    opponentAr: 'نادي الهلال للكرة الطائرة',
    date: '2026-05-15T18:00:00Z',
    locationEn: 'Al-Jalawi Sports Arena, Riyadh',
    locationAr: 'صالة الجلاوي الرياضية، الرياض',
    status: 'Completed',
    ourScore: 3,
    opponentScore: 1,
    setScores: [
      { home: 25, away: 20 },
      { home: 25, away: 22 },
      { home: 22, away: 25 },
      { home: 25, away: 18 }
    ],
    rotation: ['p-3', 'p-1', 'p-4', 'p-6', 'p-2', 'p-5'],
    notesEn: 'Solid match, excellent defensive play from Yuki Ishikawa.',
    notesAr: 'مباراة قوية، وأداء دفاعي متميز من اللاعب يوكي إيشيكاوا.',
  },
  {
    id: 'm-2',
    teamId: 't-1',
    opponentEn: 'Al Ahly SC',
    opponentAr: 'النادي الأهلي المصري',
    date: '2026-05-20T19:30:00Z',
    locationEn: 'Zayed Sports Hall, Abu Dhabi',
    locationAr: 'صالة زايد الرياضية، أبوظبي',
    status: 'Completed',
    ourScore: 3,
    opponentScore: 2,
    setScores: [
      { home: 23, away: 25 },
      { home: 25, away: 21 },
      { home: 25, away: 23 },
      { home: 20, away: 25 },
      { home: 15, away: 12 }
    ],
    rotation: ['p-3', 'p-1', 'p-4', 'p-6', 'p-2', 'p-5'],
    notesEn: 'Thrilling five-setter. Superb block performance by Lucas Saatkamp.',
    notesAr: 'مباراة مثيرة من خمسة أشواط. أداء جدار صد خارق من لوكاس.',
  },
  {
    id: 'm-3',
    teamId: 't-1',
    opponentEn: 'Ittihad Club',
    opponentAr: 'نادي الاتحاد',
    date: '2026-05-25T17:00:00Z',
    locationEn: 'Volley Dome Arena, Jeddah',
    locationAr: 'صالة الفولي دوم، جدة',
    status: 'Scheduled',
    ourScore: 0,
    opponentScore: 0,
    setScores: [],
    rotation: ['p-3', 'p-1', 'p-4', 'p-1', 'p-2', 'p-5'], // Placeholder
    notesEn: 'Key derby match. High focus on reception drills in prior training.',
    notesAr: 'مباراة ديربي حاسمة. تركيز عالي على تدريبات الاستقبال.',
  },
  {
    id: 'm-4',
    teamId: 't-3',
    opponentEn: 'Zamalek SC',
    opponentAr: 'نادي الزمالك',
    date: '2026-05-18T16:00:00Z',
    locationEn: 'Cairo International Hall',
    locationAr: 'صالة استاد القاهرة الدولي',
    status: 'Completed',
    ourScore: 3,
    opponentScore: 0,
    setScores: [
      { home: 25, away: 18 },
      { home: 25, away: 15 },
      { home: 25, away: 20 }
    ],
    rotation: ['p-8', 'p-9', 'p-7', 'p-8', 'p-9', 'p-7'],
    notesEn: 'Clean sweep, Paola Egonu scored 28 direct kills.',
    notesAr: 'فوز ساحق ونظيف، باولا إيغونو سجلت 28 نقطة هجومية مباشرة.',
  },
  {
    id: 'm-5',
    teamId: 't-3',
    opponentEn: 'VakıfBank SK',
    opponentAr: 'نادي فاكيف بنك التركي',
    date: '2026-05-28T20:00:00Z',
    locationEn: 'Volley Arena, Istanbul',
    locationAr: 'صالة الكرة الطائرة، إسطنبول',
    status: 'Scheduled',
    ourScore: 0,
    opponentScore: 0,
    setScores: [],
    notesEn: 'Champions league clash. Team flying to Istanbul on Monday.',
    notesAr: 'مواجهة دوري أبطال أوروبا. يسافر الفريق إلى إسطنبول يوم الاثنين.',
  }
];

const initialTrainingSessions: TrainingSession[] = [
  {
    id: 'tr-1',
    teamId: 't-1',
    titleEn: 'Defensive Positioning & Back-row Attacks',
    titleAr: 'التمركز الدفاعي والهجوم من المنطقة الخلفية',
    date: '2026-05-19',
    time: '09:00',
    durationMinutes: 120,
    locationEn: 'Main Court - Club Hall',
    locationAr: 'الملعب الرئيسي - صالة النادي',
    focusAreaEn: 'Defense & Digging',
    focusAreaAr: 'الدفاع والاستقبال',
    descriptionEn: 'Drills on covering lines and setting up pipe attacks.',
    descriptionAr: 'تدريبات تغطية الخطوط والتجهيز للهجوم السريع البايب.',
  },
  {
    id: 'tr-2',
    teamId: 't-1',
    titleEn: 'Jump Serve Targets & Reception Lines',
    titleAr: 'أهداف الإرسال الساحق وخطوط الاستقبال',
    date: '2026-05-21',
    time: '10:00',
    durationMinutes: 90,
    locationEn: 'Court B - Practice Hall',
    locationAr: 'ملعب ب - صالة التدريب',
    focusAreaEn: 'Serving & Passing',
    focusAreaAr: 'الإرسال والتمرير',
    descriptionEn: 'Target areas practice for servers, block configuration for passes.',
    descriptionAr: 'التدريب على استهداف نقاط معينة وتشكيل حائط الصد للتمرير.',
  },
  {
    id: 'tr-3',
    teamId: 't-3',
    titleEn: 'Net Block Clashes & Set Rotations',
    titleAr: 'الصد على الشبكة ودوران حائط الصد',
    date: '2026-05-22',
    time: '15:30',
    durationMinutes: 120,
    locationEn: 'Main Court - Club Hall',
    locationAr: 'الملعب الرئيسي - صالة النادي',
    focusAreaEn: 'Blocking',
    focusAreaAr: 'حائط الصد',
    descriptionEn: 'Quick shifting exercises for middle blockers.',
    descriptionAr: 'تمارين الانتقال السريع للاعب الوسط الصاد.',
  }
];

const initialAttendance: AttendanceRecord[] = [
  // Session 1: tr-1 (Training on May 19)
  { id: 'tr-1-p-1', sessionId: 'tr-1', sessionType: 'Training', playerId: 'p-1', status: 'Present' },
  { id: 'tr-1-p-2', sessionId: 'tr-1', sessionType: 'Training', playerId: 'p-2', status: 'Present' },
  { id: 'tr-1-p-3', sessionId: 'tr-1', sessionType: 'Training', playerId: 'p-3', status: 'Present' },
  { id: 'tr-1-p-4', sessionId: 'tr-1', sessionType: 'Training', playerId: 'p-4', status: 'Present' },
  { id: 'tr-1-p-5', sessionId: 'tr-1', sessionType: 'Training', playerId: 'p-5', status: 'Present' },
  { id: 'tr-1-p-6', sessionId: 'tr-1', sessionType: 'Training', playerId: 'p-6', status: 'Excused', noteEn: 'Injury recovery', noteAr: 'الاستشفاء من الإصابة' },
  
  // Session 2: tr-2 (Training on May 21)
  { id: 'tr-2-p-1', sessionId: 'tr-2', sessionType: 'Training', playerId: 'p-1', status: 'Present' },
  { id: 'tr-2-p-2', sessionId: 'tr-2', sessionType: 'Training', playerId: 'p-2', status: 'Present' },
  { id: 'tr-2-p-3', sessionId: 'tr-2', sessionType: 'Training', playerId: 'p-3', status: 'Present' },
  { id: 'tr-2-p-4', sessionId: 'tr-2', sessionType: 'Training', playerId: 'p-4', status: 'Present' },
  { id: 'tr-2-p-5', sessionId: 'tr-2', sessionType: 'Training', playerId: 'p-5', status: 'Absent', noteEn: 'Overslept', noteAr: 'تأخر في النوم' },
  { id: 'tr-2-p-6', sessionId: 'tr-2', sessionType: 'Training', playerId: 'p-6', status: 'Excused' }
];

const initialNotifications: SystemNotification[] = [
  {
    id: 'n-1',
    titleEn: 'Match Result Recorded',
    titleAr: 'تم تسجيل نتيجة مباراة',
    messageEn: 'Men\'s First Team won 3-2 against Al Ahly SC in Zayed Hall.',
    messageAr: 'فاز الفريق الأول للرجال بنتيجة 3-2 على النادي الأهلي في صالة زايد.',
    type: 'success',
    timestamp: '2026-05-20T22:00:00Z',
    read: false,
  },
  {
    id: 'n-2',
    titleEn: 'Player Injury Update',
    titleAr: 'تحديث إصابة لاعب',
    messageEn: 'Jean Patry has shown 85% progress in ankle recovery. Therapy ongoing.',
    messageAr: 'أظهر جان باتري تقدماً بنسبة 85% في تعافي كاحله. العلاج مستمر.',
    type: 'warning',
    timestamp: '2026-05-21T08:30:00Z',
    read: false,
  },
  {
    id: 'n-3',
    titleEn: 'Upcoming Match Schedule',
    titleAr: 'مباراة قادمة في الجدول',
    messageEn: 'Derby match against Ittihad Club scheduled for May 25 in Jeddah.',
    messageAr: 'مباراة الديربي ضد نادي الاتحاد مجدولة في 25 مايو في جدة.',
    type: 'info',
    timestamp: '2026-05-21T12:00:00Z',
    read: true,
  }
];

export const useClubStore = create<ClubState>((set) => ({
  teams: initialTeams,
  players: initialPlayers,
  staff: initialStaff,
  matches: initialMatches,
  trainingSessions: initialTrainingSessions,
  attendance: initialAttendance,
  notifications: initialNotifications,

  // Teams
  addTeam: (team) => set((state) => {
    const newTeam: Team = {
      ...team,
      id: `t-${state.teams.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    return { teams: [...state.teams, newTeam] };
  }),

  updateTeam: (id, updatedTeam) => set((state) => ({
    teams: state.teams.map((t) => t.id === id ? { ...t, ...updatedTeam } : t),
  })),

  deleteTeam: (id) => set((state) => ({
    teams: state.teams.filter((t) => t.id !== id),
    players: state.players.map((p) => p.teamId === id ? { ...p, teamId: undefined } : p) // Unlink players
  })),

  // Players
  addPlayer: (player) => set((state) => {
    const newPlayer: Player = {
      ...player,
      id: `p-${state.players.length + 1}`,
    };
    return { players: [...state.players, newPlayer] };
  }),

  updatePlayer: (id, updatedPlayer) => set((state) => ({
    players: state.players.map((p) => p.id === id ? { ...p, ...updatedPlayer } : p),
  })),

  deletePlayer: (id) => set((state) => ({
    players: state.players.filter((p) => p.id !== id),
    attendance: state.attendance.filter((a) => a.playerId !== id)
  })),

  // Staff
  addStaff: (staff) => set((state) => {
    const newStaff: Staff = {
      ...staff,
      id: `s-${state.staff.length + 1}`,
    };
    return { staff: [...state.staff, newStaff] };
  }),

  updateStaff: (id, updatedStaff) => set((state) => ({
    staff: state.staff.map((s) => s.id === id ? { ...s, ...updatedStaff } : s),
  })),

  deleteStaff: (id) => set((state) => ({
    staff: state.staff.filter((s) => s.id !== id),
    teams: state.teams.map((t) => t.headCoachId === id ? { ...t, headCoachId: undefined } : t) // Unlink coaching roles
  })),

  // Matches
  addMatch: (match) => set((state) => {
    const newMatch: Match = {
      ...match,
      id: `m-${state.matches.length + 1}`,
    };
    return { matches: [...state.matches, newMatch] };
  }),

  updateMatch: (id, updatedMatch) => set((state) => ({
    matches: state.matches.map((m) => m.id === id ? { ...m, ...updatedMatch } : m),
  })),

  deleteMatch: (id) => set((state) => ({
    matches: state.matches.filter((m) => m.id !== id),
    attendance: state.attendance.filter((a) => a.sessionId !== id || a.sessionType !== 'Match')
  })),

  // Training Sessions
  addTrainingSession: (session) => set((state) => {
    const newSession: TrainingSession = {
      ...session,
      id: `tr-${state.trainingSessions.length + 1}`,
    };
    return { trainingSessions: [...state.trainingSessions, newSession] };
  }),

  updateTrainingSession: (id, updatedSession) => set((state) => ({
    trainingSessions: state.trainingSessions.map((ts) => ts.id === id ? { ...ts, ...updatedSession } : ts),
  })),

  deleteTrainingSession: (id) => set((state) => ({
    trainingSessions: state.trainingSessions.filter((ts) => ts.id !== id),
    attendance: state.attendance.filter((a) => a.sessionId !== id || a.sessionType !== 'Training')
  })),

  // Attendance
  setPlayerAttendance: (sessionId, sessionType, playerId, status) => set((state) => {
    const attendanceId = `${sessionType.toLowerCase()}-${sessionId}-${playerId}`;
    const exists = state.attendance.some((a) => a.id === attendanceId);
    let nextAttendance;

    if (exists) {
      nextAttendance = state.attendance.map((a) => 
        a.id === attendanceId ? { ...a, status } : a
      );
    } else {
      const record: AttendanceRecord = {
        id: attendanceId,
        sessionId,
        sessionType,
        playerId,
        status,
        checkInTime: new Date().toISOString()
      };
      nextAttendance = [...state.attendance, record];
    }
    return { attendance: nextAttendance };
  }),

  bulkSetAttendance: (records) => set((state) => {
    const newRecords = records.map((r) => ({
      ...r,
      id: `${r.sessionType.toLowerCase()}-${r.sessionId}-${r.playerId}`
    }));
    
    // Merge new records with old, overriding matching IDs
    const otherRecords = state.attendance.filter((a) => 
      !newRecords.some((nr) => nr.id === a.id)
    );

    return { attendance: [...otherRecords, ...newRecords] };
  }),

  // Notifications
  addNotification: (notification) => set((state) => {
    const newNotif: SystemNotification = {
      ...notification,
      id: `n-${state.notifications.length + 1}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    return { notifications: [newNotif, ...state.notifications] };
  }),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  }))
}));
