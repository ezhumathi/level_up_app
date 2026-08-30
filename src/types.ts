export interface Mission {
  id: string;
  category: 'morning' | 'fitness' | 'mindset' | 'evening' | 'custom';
  title: string;
  xp: number;
  completed: boolean;
  timeStr?: string;
  iconName: string;
  progressCurrent?: number;
  progressMax?: number;
  unit?: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  time: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'morning' | 'evening' | 'afternoon';
  description?: string;
}

export interface FitnessGauge {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  isTimer?: boolean;
}

export interface PersonalRecord {
  id: string;
  name: string;
  value: string;
  icon: string;
  dateAchieved: string;
  previousBest?: string;
}

export interface UserStats {
  name: string;
  dateStr: string;
  quote: string;
  author?: string;
  todayScore: number;
  maxScore: number;
  completedMissions: number;
  totalMissions: number;
  currentStreak: number;
  bestStreak: number;
  totalDaysTracked: number;
  averageScore: number;
  currentXp: number;
  nextLevelXp: number;
  level: number;
  rankTitle: string;
  avatarUrl: string;
  userPhotoUrl: string;
}

export interface HeatmapDay {
  date: string;
  count: number; // 0 to 4 intensity level
  score: number;
  missionsCount: number;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'fitness' | 'mindset' | 'general';
  progress?: number;
  maxProgress?: number;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  quickActions?: string[];
}

export type TabType = 'home' | 'habits' | 'ai' | 'progress' | 'profile';
