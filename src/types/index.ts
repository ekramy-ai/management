export type Role = 'Admin' | 'Head Coach' | 'Assistant Coach' | 'Physiotherapist' | 'Manager';
export type PlayerPosition = 'Setter' | 'Outside Hitter' | 'Opposite Hitter' | 'Middle Blocker' | 'Libero' | 'Defensive Specialist';
export type PlayerStatus = 'Active' | 'Injured' | 'Inactive' | 'On Leave';
export type MatchStatus = 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
export type AttendanceStatus = 'Present' | 'Excused' | 'Absent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  nameEn: string;
  nameAr: string;
  ageGroup: string; // e.g., "U19", "First Team"
  gender: 'Men' | 'Women' | 'Mixed';
  headCoachId?: string; // Links to Staff
  descriptionEn?: string;
  descriptionAr?: string;
  colorHex?: string;
  createdAt: string;
}

export interface Player {
  id: string;
  teamId?: string; // Links to Team
  nameEn: string;
  nameAr: string;
  jerseyNumber: number;
  position: PlayerPosition;
  status: PlayerStatus;
  height: number; // in cm
  weight: number; // in kg
  birthDate: string;
  nationalityEn: string;
  nationalityAr: string;
  avatarUrl?: string;
  stats: {
    matchesPlayed: number;
    kills: number;
    blocks: number;
    aces: number;
    digs: number;
    assists: number;
  };
  notesEn?: string;
  notesAr?: string;
}

export interface Staff {
  id: string;
  nameEn: string;
  nameAr: string;
  role: Role;
  specializationEn?: string;
  specializationAr?: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface SetScore {
  home: number;
  away: number;
}

export interface Match {
  id: string;
  teamId: string; // Our internal Team
  opponentEn: string;
  opponentAr: string;
  date: string;
  locationEn: string;
  locationAr: string;
  status: MatchStatus;
  ourScore: number;
  opponentScore: number;
  setScores: SetScore[]; // e.g., [{home: 25, away: 22}, {home: 21, away: 25}]
  rotation?: string[]; // Array of 6 player IDs representing positions 1 to 6
  notesEn?: string;
  notesAr?: string;
}

export interface TrainingSession {
  id: string;
  teamId: string; // Links to Team
  titleEn: string;
  titleAr: string;
  date: string;
  time: string;
  durationMinutes: number;
  locationEn: string;
  locationAr: string;
  focusAreaEn: string;
  focusAreaAr: string; // e.g. Reception, Blocking, Rotation
  descriptionEn?: string;
  descriptionAr?: string;
}

export interface AttendanceRecord {
  id: string; // sessionType-sessionId-playerId
  sessionId: string; // Links to TrainingSession or Match
  sessionType: 'Training' | 'Match';
  playerId: string; // Links to Player
  status: AttendanceStatus;
  checkInTime?: string;
  noteEn?: string;
  noteAr?: string;
}

export interface SystemNotification {
  id: string;
  titleEn: string;
  titleAr: string;
  messageEn: string;
  messageAr: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
}
