import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://ezhumathi:ezhu2309@cluster0.gwrsbwk.mongodb.net/Bhuvan?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;
let connectionError: string | null = null;

// Schemas & Models
const UserStatsSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default_user', unique: true },
    name: { type: String, default: 'BHUVANESH' },
    dateStr: { type: String, default: 'SUNDAY, 30 AUGUST 2026' },
    quote: { type: String, default: '"Small daily disciplines, repeated with consistency, create unstoppable excellence."' },
    author: { type: String, default: 'Bhuvanesh Creed' },
    todayScore: { type: Number, default: 0 },
    maxScore: { type: Number, default: 100 },
    completedMissions: { type: Number, default: 0 },
    totalMissions: { type: Number, default: 8 },
    currentStreak: { type: Number, default: 1 },
    bestStreak: { type: Number, default: 1 },
    totalDaysTracked: { type: Number, default: 1 },
    averageScore: { type: Number, default: 0 },
    currentXp: { type: Number, default: 0 },
    nextLevelXp: { type: Number, default: 500 },
    level: { type: Number, default: 1 },
    rankTitle: { type: String, default: 'DISCIPLINE RECRUIT' },
    avatarUrl: { type: String, default: '/bhuvanesh.jpg' },
    userPhotoUrl: { type: String, default: '/bhuvanesh_full.jpg' },
  },
  { timestamps: true }
);

const MissionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, default: 'default_user' },
    category: {
      type: String,
      enum: ['morning', 'fitness', 'mindset', 'evening', 'custom'],
      default: 'morning',
    },
    title: { type: String, required: true },
    xp: { type: Number, default: 25 },
    completed: { type: Boolean, default: false },
    timeStr: { type: String },
    iconName: { type: String, default: 'sparkles' },
    progressCurrent: { type: Number },
    progressMax: { type: Number },
    unit: { type: String },
  },
  { timestamps: true }
);

const FitnessGaugeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, default: 'default_user' },
    name: { type: String, required: true },
    current: { type: Number, default: 0 },
    target: { type: Number, default: 100 },
    unit: { type: String, default: 'reps' },
    isTimer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PersonalRecordSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, default: 'default_user' },
    name: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, default: 'clock' },
    dateAchieved: { type: String, default: 'Aug 30, 2026' },
    previousBest: { type: String },
  },
  { timestamps: true }
);

const RoutineItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, default: 'default_user' },
    title: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    category: {
      type: String,
      enum: ['morning', 'evening', 'afternoon'],
      default: 'morning',
    },
    description: { type: String },
  },
  { timestamps: true }
);

const AchievementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, default: 'default_user' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'award' },
    unlocked: { type: Boolean, default: false },
    unlockedAt: { type: String },
    category: { type: String, default: 'general' },
    progress: { type: Number },
    maxProgress: { type: Number },
  },
  { timestamps: true }
);

const HeatmapDaySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    userId: { type: String, default: 'default_user' },
    count: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    missionsCount: { type: Number, default: 0 },
    dayOfWeek: { type: Number, default: 0 },
  },
  { timestamps: true }
);
HeatmapDaySchema.index({ date: 1, userId: 1 }, { unique: true });

// DailyProgress: stores per-day habit states for a user
const DailyProgressSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    userId: { type: String, default: 'default_user' },
    // items can reference missions, routines, gauges by id and hold completed state
    items: [
      {
        id: { type: String, required: true },
        type: { type: String, enum: ['mission', 'routine', 'gauge'], required: true },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
      },
    ],
    completionPercentage: { type: Number, default: 0 },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);
DailyProgressSchema.index({ date: 1, userId: 1 }, { unique: true });

const ChatMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, default: 'default_user' },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserStatsModel = mongoose.model('UserStats', UserStatsSchema);
export const MissionModel = mongoose.model('Mission', MissionSchema);
export const FitnessGaugeModel = mongoose.model('FitnessGauge', FitnessGaugeSchema);
export const PersonalRecordModel = mongoose.model('PersonalRecord', PersonalRecordSchema);
export const RoutineItemModel = mongoose.model('RoutineItem', RoutineItemSchema);
export const AchievementModel = mongoose.model('Achievement', AchievementSchema);
export const HeatmapDayModel = mongoose.model('HeatmapDay', HeatmapDaySchema);
export const DailyProgressModel = mongoose.model('DailyProgress', DailyProgressSchema);
export const ChatMessageModel = mongoose.model('ChatMessage', ChatMessageSchema);

export async function connectMongoDB(): Promise<{ success: boolean; message: string }> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return { success: true, message: 'MongoDB already connected' };
  }

  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    connectionError = null;
    console.log('✅ Connected to MongoDB Atlas successfully: Bhuvan database');
    return { success: true, message: 'Connected to MongoDB Atlas (Bhuvan)' };
  } catch (error: any) {
    isConnected = false;
    connectionError = error?.message || 'Unknown MongoDB connection error';
    console.error('❌ MongoDB Connection Error:', connectionError);
    return { success: false, message: connectionError };
  }
}

export function getMongoStatus() {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    databaseName: mongoose.connection.name || 'Bhuvan',
    host: mongoose.connection.host || 'cluster0.gwrsbwk.mongodb.net',
    error: connectionError,
  };
}
