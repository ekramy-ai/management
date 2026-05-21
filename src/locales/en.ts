export const en = {
  // Common
  appName: "VolleyClub Pro",
  appSubtitle: "Enterprise Club Management",
  search: "Search...",
  filters: "Filters",
  actions: "Actions",
  add: "Add New",
  edit: "Edit",
  delete: "Delete",
  save: "Save",
  cancel: "Cancel",
  all: "All",
  none: "None",
  loading: "Loading...",
  noData: "No data available",
  status: "Status",
  date: "Date",
  location: "Location",
  details: "Details",
  general: "General",
  success: "Success",
  warning: "Warning",
  info: "Information",
  error: "Error",
  gender: "Gender",
  ageGroup: "Age Group",

  // Roles & Positions
  role: "Role",
  admin: "Administrator",
  headCoach: "Head Coach",
  assistantCoach: "Assistant Coach",
  physiotherapist: "Physiotherapist",
  manager: "Manager",

  position: "Position",
  setter: "Setter",
  outsideHitter: "Outside Hitter",
  oppositeHitter: "Opposite Hitter",
  middleBlocker: "Middle Blocker",
  libero: "Libero",
  defensiveSpecialist: "Defensive Specialist",

  active: "Active",
  injured: "Injured",
  inactive: "Inactive",
  onLeave: "On Leave",

  present: "Present",
  excused: "Excused",
  absent: "Absent",

  // Navigation
  dashboard: "Dashboard",
  teams: "Teams",
  players: "Players",
  staff: "Staff",
  attendance: "Attendance",
  training: "Training",
  matches: "Matches",
  reports: "Reports & Analytics",
  notifications: "Notifications",
  settings: "Settings",

  // Dashboard Page
  kpiActivePlayers: "Active Players",
  kpiUpcomingMatches: "Upcoming Matches",
  kpiAttendanceRate: "Avg Attendance",
  kpiWinRatio: "Win Ratio",
  vsLastMonth: "vs last month",
  winStreak: "Win streak: 2 games",
  activityLog: "Recent Activity Log",
  attendanceTrend: "Training Attendance Trend",
  winLossBreakdown: "Win / Loss Breakdown",
  quickActions: "Quick Management Actions",
  scheduleTraining: "Schedule Practice",
  recordMatch: "Log Match Score",
  checkInPlayers: "Run Attendance Check-in",
  addPlayerShortcut: "Register New Player",

  // Teams Page
  teamName: "Team Name",
  headCoachLabel: "Head Coach",
  rosterCount: "Roster Size",
  createTeam: "Create Team",
  editTeam: "Edit Team",
  teamDetails: "Team Details",
  coachNotAssigned: "No coach assigned",
  aboutTeam: "About the Team",

  // Players Page
  playerName: "Player Name",
  jersey: "Jersey #",
  height: "Height",
  weight: "Weight",
  birthDate: "Birth Date",
  nationality: "Nationality",
  performanceRadar: "Performance Analysis",
  statsKills: "Kills",
  statsBlocks: "Blocks",
  statsAces: "Aces",
  statsDigs: "Digs",
  statsAssists: "Assists",
  statsMatches: "Matches Played",
  createPlayer: "Register Player",
  editPlayer: "Edit Player Profile",
  personalDetails: "Personal Details",
  statistics: "Statistics",

  // Staff Page
  staffName: "Staff Name",
  specialization: "Specialization",
  contactInfo: "Contact Info",
  createStaff: "Add Staff Member",
  editStaff: "Edit Staff Profile",

  // Attendance Page
  selectSession: "Select Session to Log",
  recordAttendance: "Submit Attendance Checklist",
  attendanceOverview: "Attendance Summary",
  attendanceRate: "Attendance Rate",
  remarks: "Remarks / Notes",

  // Training Page
  sessionTitle: "Session Title",
  focusArea: "Focus Area",
  duration: "Duration (min)",
  scheduleSession: "Schedule Training Session",
  editSession: "Edit Training Session",

  // Matches Page
  opponent: "Opponent Team",
  score: "Final Score",
  matchStatus: "Match Status",
  setScoresLabel: "Set Scores",
  rotationBoard: "Rotation Board (6-Player System)",
  rotationPosition: "Pos",
  rotationHelper: "Assign players to volleyball court positions (1 to 6) to plan rotations.",
  createMatch: "Schedule Match",
  editMatch: "Edit Match Details",
  courtView: "Court Positions Map",

  // Reports Page
  clubPerformanceReport: "Club Performance Report",
  attendanceRateByTeam: "Attendance Rate by Team",
  playerStatsRankings: "Top Performers Rankings",
  downloadCSV: "Export CSV Report",
  downloadPDF: "Export PDF Summary",
  generateReport: "Generate Analysis",

  // Notifications Page
  notificationCenter: "Notification Center",
  markAllRead: "Mark All Read",
  noNotifications: "You're all caught up!",

  // Settings Page
  clubInformation: "Club Information",
  clubName: "Club Name",
  stadiumName: "Home Court / Stadium Name",
  primaryColor: "Primary Color Theme",
  systemPreferences: "System Preferences",
  defaultLanguage: "Default Language",
  defaultTheme: "Default UI Theme",
  dark: "Dark Theme",
  light: "Light Theme",
  saveSettings: "Apply Configuration",
  resetDatabase: "Reset Mock Data to Default"
};

export type TranslationKey = keyof typeof en;
export type Dictionary = typeof en;
export type LocalizationLanguage = "en" | "ar";
export const translations = { en };
export default en;
