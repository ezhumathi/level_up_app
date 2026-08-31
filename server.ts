import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  connectMongoDB,
  getMongoStatus,
  UserStatsModel,
  MissionModel,
  FitnessGaugeModel,
  PersonalRecordModel,
  RoutineItemModel,
  AchievementModel,
  ChatMessageModel,
  HeatmapDayModel,
  DailyProgressModel,
} from './server/db';
import { seedInitialDataIfEmpty } from './server/seed';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Initialize MongoDB connection
connectMongoDB().then((res) => {
  if (res && (res as any).success) {
    seedInitialDataIfEmpty();
  } else {
    console.warn('MongoDB not connected at startup; running in degraded local mode for development.');
  }
});

// Helper to check live connection before DB operations
function mongoAvailable() {
  try {
    const s = getMongoStatus();
    return s && s.isConnected;
  } catch {
    return false;
  }
}

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health & Database Status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/db-status', async (req, res) => {
  const status = getMongoStatus();
  res.json({
    status: status.isConnected ? 'connected' : 'disconnected',
    database: status.databaseName,
    host: status.host,
    error: status.error,
  });
});

// 2. Fetch Full Application State from MongoDB
app.get('/api/data', async (req, res) => {
  try {
    // Ensure DB is connected
    await connectMongoDB();

    let userStats = await UserStatsModel.findOne({ userId: 'default_user' }).lean();
    if (!userStats) {
      await seedInitialDataIfEmpty();
      userStats = await UserStatsModel.findOne({ userId: 'default_user' }).lean();
    }

    const missions = await MissionModel.find({ userId: 'default_user' }).sort({ createdAt: 1 }).lean();
    const fitnessGauges = await FitnessGaugeModel.find({ userId: 'default_user' }).sort({ createdAt: 1 }).lean();
    const personalRecords = await PersonalRecordModel.find({ userId: 'default_user' }).sort({ createdAt: 1 }).lean();
    const routines = await RoutineItemModel.find({ userId: 'default_user' }).sort({ createdAt: 1 }).lean();
    const achievements = await AchievementModel.find({ userId: 'default_user' }).sort({ createdAt: 1 }).lean();
    const chatMessages = await ChatMessageModel.find({ userId: 'default_user' }).sort({ createdAt: 1 }).lean();

    const morningRoutine = routines.filter((r) => r.category === 'morning');
    const eveningRoutine = routines.filter((r) => r.category === 'evening');

    // Load heatmap days for quick progress overview
    const heatmapDays = await HeatmapDayModel.find({ userId: 'default_user' }).sort({ date: 1 }).lean();

    res.json({
      userStats: userStats || {},
      missions: missions || [],
      fitnessGauges: fitnessGauges || [],
      personalRecords: personalRecords || [],
      morningRoutine: morningRoutine || [],
      eveningRoutine: eveningRoutine || [],
      achievements: achievements || [],
      chatMessages: chatMessages || [],
      heatmapDays: heatmapDays || [],
      mongoConnected: true,
    });
  } catch (error: any) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ error: error.message || 'Database error' });
  }
});

// 3. Missions CRUD (MongoDB)
app.post('/api/missions', async (req, res) => {
  try {
    const missionData = req.body;
    const newMission = await MissionModel.create({
      ...missionData,
      userId: 'default_user',
      id: missionData.id || `m-${Date.now()}`,
    });

    // Update total missions count in UserStats
    const totalCount = await MissionModel.countDocuments({ userId: 'default_user' });
    const completedCount = await MissionModel.countDocuments({ userId: 'default_user', completed: true });
    await UserStatsModel.findOneAndUpdate(
      { userId: 'default_user' },
      { totalMissions: totalCount, completedMissions: completedCount }
    );

    res.json(newMission);
  } catch (error: any) {
    console.error('Error creating mission:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/missions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await MissionModel.findOneAndUpdate(
      { id, userId: 'default_user' },
      { $set: updateData },
      { new: true }
    );

    // Recalculate stats
    const totalCount = await MissionModel.countDocuments({ userId: 'default_user' });
    const completedCount = await MissionModel.countDocuments({ userId: 'default_user', completed: true });
    const todayScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    await UserStatsModel.findOneAndUpdate(
      { userId: 'default_user' },
      {
        totalMissions: totalCount,
        completedMissions: completedCount,
        todayScore,
      }
    );

    res.json(updated);
  } catch (error: any) {
    console.error('Error updating mission:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/missions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await MissionModel.findOneAndDelete({ id, userId: 'default_user' });

    const totalCount = await MissionModel.countDocuments({ userId: 'default_user' });
    const completedCount = await MissionModel.countDocuments({ userId: 'default_user', completed: true });
    await UserStatsModel.findOneAndUpdate(
      { userId: 'default_user' },
      { totalMissions: totalCount, completedMissions: completedCount }
    );

    res.json({ success: true, id });
  } catch (error: any) {
    console.error('Error deleting mission:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. User Stats Updates (MongoDB)
app.put('/api/user-stats', async (req, res) => {
  try {
    const updateData = req.body;
    const updated = await UserStatsModel.findOneAndUpdate(
      { userId: 'default_user' },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating user stats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload-photo', async (req, res) => {
  try {
    const { photoDataUrl, type } = req.body;
    if (!photoDataUrl) {
      return res.status(400).json({ error: 'No photo provided' });
    }

    const updateObj: Record<string, string> = {};
    if (type === 'avatar') {
      updateObj.avatarUrl = photoDataUrl;
    } else if (type === 'userPhoto') {
      updateObj.userPhotoUrl = photoDataUrl;
    } else {
      updateObj.avatarUrl = photoDataUrl;
      updateObj.userPhotoUrl = photoDataUrl;
    }

    const updated = await UserStatsModel.findOneAndUpdate(
      { userId: 'default_user' },
      { $set: updateObj },
      { new: true, upsert: true }
    );
    res.json({ success: true, userStats: updated });
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Fitness Gauges (MongoDB)
app.put('/api/fitness-gauges/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await FitnessGaugeModel.findOneAndUpdate(
      { id, userId: 'default_user' },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating fitness gauge:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Personal Records (MongoDB)
app.put('/api/personal-records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await PersonalRecordModel.findOneAndUpdate(
      { id, userId: 'default_user' },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating PR:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/personal-records', async (req, res) => {
  try {
    const prData = req.body;
    const newPr = await PersonalRecordModel.create({
      ...prData,
      userId: 'default_user',
      id: prData.id || `pr-${Date.now()}`,
    });
    res.json(newPr);
  } catch (error: any) {
    console.error('Error creating PR:', error);
    res.status(500).json({ error: error.message });
  }
});

// 7. Routines CRUD (MongoDB)
app.put('/api/routines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await RoutineItemModel.findOneAndUpdate(
      { id, userId: 'default_user' },
      { $set: updateData },
      { new: true }
    );
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating routine item:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/routines', async (req, res) => {
  try {
    const item = req.body;
    const created = await RoutineItemModel.create({
      ...item,
      userId: 'default_user',
      id: item.id || `rt-${Date.now()}`,
    });
    res.json(created);
  } catch (error: any) {
    console.error('Error creating routine item:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/routines/reset-day', async (req, res) => {
  try {
    // Reset all routines to pending except morning first item
    await RoutineItemModel.updateMany(
      { userId: 'default_user' },
      { $set: { status: 'pending' } }
    );
    // Reset missions completed to false
    await MissionModel.updateMany(
      { userId: 'default_user' },
      { $set: { completed: false } }
    );
    // Reset fitness gauges current value
    await FitnessGaugeModel.updateMany(
      { userId: 'default_user' },
      { $set: { current: 0 } }
    );
    // Update score
    await UserStatsModel.findOneAndUpdate(
      { userId: 'default_user' },
      { completedMissions: 0, todayScore: 0 }
    );

    res.json({ success: true, message: 'Daily protocol reset for new day' });
  } catch (error: any) {
    console.error('Error resetting daily routine:', error);
    res.status(500).json({ error: error.message });
  }
});

// DAILY PROGRESS API: per-day habit tracking and automatic locking of previous days
function getTodayDateStr() {
  // Use UTC YYYY-MM-DD for consistency; adjust later for timezone service if needed
  return new Date().toISOString().slice(0, 10);
}

async function lockPreviousDaysIfNeeded() {
  try {
    if (!mongoAvailable()) {
      // skip when MongoDB is not available to avoid buffering/timeouts
      return;
    }

    const today = getTodayDateStr();
    await DailyProgressModel.updateMany(
      { userId: 'default_user', date: { $lt: today }, locked: false },
      { $set: { locked: true } }
    );
  } catch (err) {
    console.error('Error locking previous days:', err);
  }
}

// Run once at startup and periodically (every 15 minutes) to catch timezone/day changes
lockPreviousDaysIfNeeded();
let lastChecked = getTodayDateStr();
setInterval(async () => {
  try {
    const today = getTodayDateStr();
    if (today !== lastChecked) {
      // Day changed on server clock — lock older docs
      await lockPreviousDaysIfNeeded();
      lastChecked = today;
      console.log('Daily rollover detected, previous days locked where applicable.');
    }
  } catch (err) {
    console.error('Periodic daily check error:', err);
  }
}, 15 * 60 * 1000);

// Get daily progress (query param ?date=YYYY-MM-DD optional)
app.get('/api/daily-progress', async (req, res) => {
  try {
    const date = (req.query.date as string) || getTodayDateStr();
    const doc = await DailyProgressModel.findOne({ userId: 'default_user', date }).lean();
    if (!doc) {
      return res.json({ date, userId: 'default_user', habits: [], completionPercentage: 0, locked: false });
    }
    res.json(doc);
  } catch (error: any) {
    console.error('Error fetching daily progress:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get daily progress by path param
app.get('/api/daily-progress/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const doc = await DailyProgressModel.findOne({ userId: 'default_user', date }).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (error: any) {
    console.error('Error fetching daily progress by date:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create or update daily progress (upsert). Prevent edits to locked past days.
app.post('/api/daily-progress', async (req, res) => {
  try {
    const { date, habits, completionPercentage } = req.body;
    if (!date) return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });
    const today = getTodayDateStr();

    const existing = await DailyProgressModel.findOne({ userId: 'default_user', date });
    if (existing && existing.locked && date !== today) {
      return res.status(403).json({ error: 'Day is locked and read-only' });
    }

    const upsertObj: any = {
      date,
      userId: 'default_user',
      habits: habits || [],
      completionPercentage: typeof completionPercentage === 'number' ? completionPercentage : 0,
      locked: date !== today, // lock if not today
    };

    const updated = await DailyProgressModel.findOneAndUpdate(
      { userId: 'default_user', date },
      { $set: upsertObj },
      { new: true, upsert: true }
    );

    // Also update HeatmapDay summary for quick heatmap reads
    try {
      // derive a simple intensity count for heatmap (0-4) from percentage
      const pct = upsertObj.completionPercentage || 0;
      let intensity = 0;
      if (pct >= 80) intensity = 4;
      else if (pct >= 60) intensity = 3;
      else if (pct >= 40) intensity = 2;
      else if (pct >= 20) intensity = 1;

      await HeatmapDayModel.findOneAndUpdate(
        { userId: 'default_user', date },
        {
          $set: {
            userId: 'default_user',
            date,
            score: upsertObj.completionPercentage || 0,
            missionsCount: upsertObj.habits ? upsertObj.habits.length : 0,
            dayOfWeek: new Date(date).getDay(),
            count: intensity,
          },
        },
        { upsert: true, new: true }
      );
    } catch (heatErr) {
      console.error('Failed to update heatmap day from daily progress:', heatErr);
    }

    res.json(updated);
  } catch (error: any) {
    console.error('Error upserting daily progress:', error);
    res.status(500).json({ error: error.message });
  }
});

// 8. Achievements (MongoDB)
app.put('/api/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await AchievementModel.findOneAndUpdate(
      { id, userId: 'default_user' },
      { $set: updateData },
      { new: true }
    );
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ error: error.message });
  }
});

// 9. Chat / AI Coach with MongoDB storage
app.get('/api/chat', async (req, res) => {
  try {
    const messages = await ChatMessageModel.find({ userId: 'default_user' })
      .sort({ createdAt: 1 })
      .lean();
    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, id } = req.body;

    // 1. Save user message to MongoDB
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    await ChatMessageModel.create({
      id: id || `user-${Date.now()}`,
      userId: 'default_user',
      role: 'user',
      content: message,
      timestamp: timeStr,
    });

    const ai = getAI();
    let replyText = '';

    if (!ai) {
      replyText = `Discipline protocol synchronized with MongoDB. Call-sign ${
        context?.userName || 'BHUVANESH'
      }, keep executing with relentless focus. Your today's score is ${
        context?.score || 87
      }% and your streak is ${context?.streak || 17} days.`;
    } else {
      const systemPrompt = `You are BHUVA AI, the elite neural discipline and peak-performance coach for ${
        context?.userName || 'BHUVANESH'
      }.
Database status: Connected to MongoDB Atlas cluster 'Bhuvan'.

Live User Telemetry:
- Call-sign: ${context?.userName || 'BHUVANESH'}
- Current Discipline Score: ${context?.score || 87} / 100
- Active Daily Streak: ${context?.streak || 17} days
- Level: ${context?.level || 14} (Discipline Architect)
- Total Missions: ${context?.totalMissions || 16} (Completed: ${context?.completedMissions || 12})
- Active Routine: ${context?.activeRoutine || 'Morning Protocol'}

Coach Persona:
- Authoritative, concise, tactical, and inspiring.
- Never use corporate fluff. Speak directly to human potential and discipline.
- Give crisp, actionable recommendations with bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      replyText =
        response.text ||
        'Telemetry confirmed. Stand by for active mission execution.';
    }

    // 2. Save assistant reply to MongoDB
    const assistantMsg = await ChatMessageModel.create({
      id: `ai-${Date.now()}`,
      userId: 'default_user',
      role: 'assistant',
      content: replyText,
      timestamp: timeStr,
    });

    res.json({ reply: replyText, message: assistantMsg });
  } catch (error: any) {
    console.error('Gemini / Chat error:', error);
    res.status(500).json({
      reply:
        'Discipline telemetry recorded in MongoDB. Neural relay encountered brief delay. Keep pressing forward.',
      error: error?.message,
    });
  }
});

// Start Server and Vite Middleware
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static files (CSS, JS, images, etc)
    app.use(express.static(distPath, { 
      extensions: ['html', 'js', 'css', 'json', 'jpg', 'png']
    }));
    // Catch-all for SPA: serve index.html for all non-API routes
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
          console.error('Error serving index.html:', err);
          res.status(404).send('Not Found');
        }
      });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Aura Kinetic HUD server running at http://0.0.0.0:${PORT} with MongoDB Atlas`);
  });
}

start();
