import { Mission, RoutineItem, FitnessGauge, PersonalRecord, UserStats, Achievement, HeatmapDay } from '../types';

export const INITIAL_USER_STATS: UserStats = {
  name: 'BHUVANESH',
  dateStr: 'SUNDAY, 30 AUGUST 2026',
  quote: '"Small daily disciplines, repeated with consistency, create unstoppable excellence."',
  todayScore: 0,
  maxScore: 100,
  completedMissions: 0,
  totalMissions: 8,
  currentStreak: 1,
  bestStreak: 1,
  totalDaysTracked: 1,
  averageScore: 0,
  currentXp: 0,
  nextLevelXp: 500,
  level: 1,
  rankTitle: 'DISCIPLINE RECRUIT',
  avatarUrl: '/bhuvanesh.jpg',
  userPhotoUrl: '/bhuvanesh_full.jpg',
};

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm-1',
    category: 'morning',
    title: '05:00 — Wake Up',
    timeStr: '05:00 AM',
    xp: 50,
    completed: false,
    iconName: 'alarm',
  },
  {
    id: 'm-2',
    category: 'morning',
    title: 'Hydrate (1L Water)',
    timeStr: '05:15 AM',
    xp: 20,
    completed: false,
    iconName: 'droplet',
  },
  {
    id: 'm-3',
    category: 'morning',
    title: 'Cold Shower Protocol',
    timeStr: '05:30 AM',
    xp: 30,
    completed: false,
    iconName: 'sparkles',
  },
  {
    id: 'm-4',
    category: 'fitness',
    title: '5km Zone 2 Run',
    timeStr: '06:00 AM',
    xp: 100,
    completed: false,
    iconName: 'activity',
    progressCurrent: 0,
    progressMax: 5.0,
    unit: 'km',
  },
  {
    id: 'm-5',
    category: 'fitness',
    title: '100 Daily Pushups',
    timeStr: '07:30 AM',
    xp: 75,
    completed: false,
    iconName: 'dumbbell',
    progressCurrent: 0,
    progressMax: 100,
    unit: 'reps',
  },
  {
    id: 'm-6',
    category: 'mindset',
    title: 'Read 20 Pages',
    timeStr: '08:15 AM',
    xp: 30,
    completed: false,
    iconName: 'book-open',
  },
  {
    id: 'm-7',
    category: 'mindset',
    title: 'Deep Work Session (90m)',
    timeStr: '10:00 AM',
    xp: 80,
    completed: false,
    iconName: 'brain',
  },
  {
    id: 'm-8',
    category: 'evening',
    title: 'Evening Mobility & Yoga',
    timeStr: '18:00 PM',
    xp: 40,
    completed: false,
    iconName: 'heart-pulse',
  },
  {
    id: 'm-9',
    category: 'evening',
    title: 'Gratitude & Daily Review',
    timeStr: '21:00 PM',
    xp: 25,
    completed: false,
    iconName: 'pen-tool',
  },
];

export const INITIAL_FITNESS_GAUGES: FitnessGauge[] = [
  {
    id: 'fg-1',
    name: '100 PUSHUPS',
    current: 0,
    target: 100,
    unit: 'reps',
  },
  {
    id: 'fg-2',
    name: '50 SQUATS',
    current: 0,
    target: 50,
    unit: 'reps',
  },
  {
    id: 'fg-3',
    name: '5 MIN PLANK',
    current: 0,
    target: 300,
    unit: 'sec',
    isTimer: true,
  },
];

export const INITIAL_PERSONAL_RECORDS: PersonalRecord[] = [
  {
    id: 'pr-1',
    name: 'BEST PLANK',
    value: '0:00',
    icon: 'clock',
    dateAchieved: 'Starting Today',
    previousBest: '-',
  },
  {
    id: 'pr-2',
    name: 'BEST PUSHUPS',
    value: '0',
    icon: 'dumbbell',
    dateAchieved: 'Starting Today',
    previousBest: '-',
  },
  {
    id: 'pr-3',
    name: 'FASTEST 5KM',
    value: '0:00',
    icon: 'activity',
    dateAchieved: 'Starting Today',
    previousBest: '-',
  },
];

export const INITIAL_MORNING_ROUTINE: RoutineItem[] = [
  {
    id: 'mr-1',
    title: 'Wake Up',
    time: '05:00 AM',
    status: 'pending',
    category: 'morning',
  },
  {
    id: 'mr-2',
    title: 'Bathing',
    time: '05:15 AM',
    status: 'pending',
    category: 'morning',
  },
  {
    id: 'mr-3',
    title: 'Yoga',
    time: '05:45 AM',
    status: 'pending',
    category: 'morning',
  },
  {
    id: 'mr-4',
    title: 'Reading',
    time: '06:30 AM',
    status: 'pending',
    category: 'morning',
  },
];

export const INITIAL_EVENING_ROUTINE: RoutineItem[] = [
  {
    id: 'er-1',
    title: 'Evening Play',
    time: '17:00 PM',
    status: 'pending',
    category: 'evening',
  },
  {
    id: 'er-2',
    title: 'Dinner',
    time: '19:30 PM',
    status: 'pending',
    category: 'evening',
  },
  {
    id: 'er-3',
    title: 'Grooming',
    time: '20:30 PM',
    status: 'pending',
    category: 'evening',
  },
  {
    id: 'er-4',
    title: 'Gratitude',
    time: '21:00 PM',
    status: 'pending',
    category: 'evening',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'EARLY RISER',
    description: 'Wake up before 05:30 AM for 10 consecutive days',
    icon: 'sun',
    unlocked: false,
    category: 'streak',
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'ach-2',
    title: '7 DAY STREAK',
    description: 'Maintain 100% mission discipline for 7 days straight',
    icon: 'flame',
    unlocked: false,
    category: 'streak',
    progress: 1,
    maxProgress: 7,
  },
  {
    id: 'ach-3',
    title: 'DISCIPLINE KING',
    description: 'Complete all daily protocol missions 30 days in a row',
    icon: 'crown',
    unlocked: false,
    category: 'general',
    progress: 0,
    maxProgress: 30,
  },
  {
    id: 'ach-4',
    title: 'FLOW STATE',
    description: 'Log over 100 hours of deep work time without interruption',
    icon: 'zap',
    unlocked: false,
    category: 'mindset',
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'ach-5',
    title: 'IRON MIND',
    description: 'Complete 50 morning cold showers and 50 meditation sessions',
    icon: 'shield-check',
    unlocked: false,
    category: 'mindset',
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'ach-6',
    title: 'DEFENDER',
    description: 'Never miss a scheduled workout in 60 calendar days',
    icon: 'shield',
    unlocked: false,
    category: 'fitness',
    progress: 0,
    maxProgress: 60,
  },
];

export function generate365DaysHeatmap(): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Day 1: Today starts active, prior days clean baseline
    let count = 0;
    let score = 0;
    let missions = 0;

    if (i === 0) {
      count = 1;
      score = 0;
      missions = 0;
    }

    days.push({
      date: dateStr,
      count,
      score,
      missionsCount: missions,
      dayOfWeek: d.getDay(),
    });
  }
  
  return days;
}

export const WEEKLY_SCORES = [
  { day: 'MON', score: 0, missions: 0 },
  { day: 'TUE', score: 0, missions: 0 },
  { day: 'WED', score: 0, missions: 0 },
  { day: 'THU', score: 0, missions: 0 },
  { day: 'FRI', score: 0, missions: 0 },
  { day: 'SAT', score: 0, missions: 0 },
  { day: 'SUN', score: 0, missions: 0 },
];
