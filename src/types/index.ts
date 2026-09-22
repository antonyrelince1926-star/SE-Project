export type Role = 'USER' | 'ADMIN';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Severe';
export type BurnoutLevel = 'Optimal' | 'Mild Fatigue' | 'Elevated Risk' | 'Critical Burnout';
export type SleepQuality = 'Poor' | 'Fair' | 'Good' | 'Optimal';

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailDigest: 'daily' | 'weekly' | 'none';
  soundEnabled: boolean;
  dailyGoalReminderTime: string;
  screenTimeBudget?: number;
  socialMediaBudget?: number;
  sleepTarget?: number;
  emailAlerts?: boolean;
  dailyReminder?: boolean;
  dopamineSpikeAlert?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  streak?: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string;
  settings: UserSettings;
}

export interface HabitScores {
  wellBeingScore: number; // 0 - 100
  dopamineScore: number; // 0 - 100
  riskLevel: RiskLevel;
  burnoutLevel: BurnoutLevel;
  sleepQuality: SleepQuality;
  focusScore: number; // 0 - 100
  dopamineTrend: 'rising' | 'balanced' | 'depleted';
  stimulationIndex: number; // 0 - 100
}

export interface DailyEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  screenTimeHours: number;
  socialMediaHours: number;
  gamingHours: number;
  studyHours: number;
  workHours: number;
  sleepHours: number;
  exerciseMinutes: number;
  meditationMinutes: number;
  waterIntakeLiters: number;
  mood: number; // 1 to 5
  notes?: string;
  triggers?: string[];
  scores: HabitScores;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: 'screen_time' | 'social_media' | 'sleep' | 'exercise' | 'meditation' | 'water' | 'focus';
  targetValue: number;
  currentValue: number;
  unit: string;
  period: 'daily' | 'weekly';
  isCompleted: boolean;
  streak: number;
  deadline?: string;
}

export interface Recommendation {
  id: string;
  userId?: string;
  title: string;
  description: string;
  actionableStep: string;
  category: 'dopamine_reset' | 'sleep_hygiene' | 'focus_boost' | 'screen_reduction' | 'mindfulness';
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  estimatedMinutes: number;
  isCompleted?: boolean;
  isDismissed?: boolean;
  source: 'ai_engine' | 'knowledge_base';
  createdAt: string;
}

export interface EducationalTip {
  id: string;
  title: string;
  category: 'Neuroscience' | 'Dopamine' | 'Focus & Flow' | 'Circadian Biology' | 'Digital Detox';
  readTime: string;
  summary: string;
  content: string;
  scientificReference: string;
  tags: string[];
  likes: number;
  isBookmarked?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'dopamine' | 'mindfulness' | 'mastery';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'achievement' | 'milestone' | 'recommendation' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  userEmail: string;
  timestamp: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalEntriesRecorded: number;
  avgPlatformDopamine: number;
  avgPlatformWellBeing: number;
  avgScreenTimeHours: number;
  highRiskPercentage: number;
  apiRequestsToday: number;
}
