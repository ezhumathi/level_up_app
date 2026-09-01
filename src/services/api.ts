import { UserStats, Mission, FitnessGauge, PersonalRecord, RoutineItem, Achievement, ChatMessage } from '../types';

export interface FullAppData {
  userStats: UserStats;
  missions: Mission[];
  fitnessGauges: FitnessGauge[];
  personalRecords: PersonalRecord[];
  morningRoutine: RoutineItem[];
  eveningRoutine: RoutineItem[];
  achievements: Achievement[];
  chatMessages: ChatMessage[];
  mongoConnected: boolean;
}

export interface DbStatus {
  status: 'connected' | 'disconnected' | 'connecting';
  database: string;
  host: string;
  error?: string | null;
}

export const api = {
  async getDbStatus(): Promise<DbStatus> {
    try {
      const res = await fetch('/api/db-status');
      if (!res.ok) throw new Error('Status fetch failed');
      return await res.json();
    } catch {
      return {
        status: 'disconnected',
        database: 'Bhuvan',
        host: 'cluster0.gwrsbwk.mongodb.net',
        error: 'Network offline or server starting',
      };
    }
  },

  async fetchAppData(): Promise<FullAppData | null> {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Data fetch failed');
      return await res.json();
    } catch (err) {
      console.warn('Could not fetch from MongoDB, using local fallback:', err);
      return null;
    }
  },

  async saveMission(mission: Omit<Mission, 'id'> | Mission): Promise<Mission | null> {
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mission),
      });
      if (!res.ok) throw new Error('Save mission failed');
      return await res.json();
    } catch (err) {
      console.error('MongoDB save mission error:', err);
      return null;
    }
  },

  async updateMission(id: string, updates: Partial<Mission>): Promise<Mission | null> {
    try {
      const res = await fetch(`/api/missions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Update mission failed');
      return await res.json();
    } catch (err) {
      console.error('MongoDB update mission error:', err);
      return null;
    }
  },

  async deleteMission(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/missions/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.error('MongoDB delete mission error:', err);
      return false;
    }
  },

  async updateUserStats(stats: Partial<UserStats>): Promise<UserStats | null> {
    try {
      const res = await fetch('/api/user-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      });
      if (!res.ok) throw new Error('Update stats failed');
      return await res.json();
    } catch (err) {
      console.error('MongoDB update stats error:', err);
      return null;
    }
  },

  async updateFitnessGauge(id: string, current: number): Promise<FitnessGauge | null> {
    try {
      const res = await fetch(`/api/fitness-gauges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current }),
      });
      if (!res.ok) throw new Error('Update fitness gauge failed');
      return await res.json();
    } catch (err) {
      console.error('MongoDB update fitness gauge error:', err);
      return null;
    }
  },

  async uploadPhoto(photoDataUrl: string, type: 'avatar' | 'userPhoto' | 'both' = 'both'): Promise<UserStats | null> {
    try {
      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoDataUrl, type }),
      });
      if (!res.ok) throw new Error('Upload photo failed');
      const data = await res.json();
      return data.userStats;
    } catch (err) {
      console.error('MongoDB upload photo error:', err);
      return null;
    }
  },

  async updatePersonalRecord(id: string, value: string, dateAchieved: string): Promise<PersonalRecord | null> {
    try {
      const res = await fetch(`/api/personal-records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, dateAchieved }),
      });
      if (!res.ok) throw new Error('Update PR failed');
      return await res.json();
    } catch (err) {
      console.error('MongoDB update PR error:', err);
      return null;
    }
  },

  async updateRoutineItem(id: string, status: 'pending' | 'in_progress' | 'completed'): Promise<RoutineItem | null> {
    try {
      const res = await fetch(`/api/routines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update routine failed');
      return await res.json();
    } catch (err) {
      console.error('MongoDB update routine error:', err);
      return null;
    }
  },

  async resetDayProtocol(): Promise<boolean> {
    try {
      const res = await fetch('/api/routines/reset-day', {
        method: 'POST',
      });
      return res.ok;
    } catch (err) {
      console.error('MongoDB reset day error:', err);
      return false;
    }
  },

  async sendChatMessage(
    message: string,
    context: any
  ): Promise<{ reply: string; message?: any } | null> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });
      if (!res.ok) throw new Error('Chat request failed');
      return await res.json();
    } catch (err) {
      console.error('Chat error:', err);
      return null;
    }
  },

  // Daily progress APIs
  async getDailyProgress(date: string): Promise<any | null> {
    try {
      const res = await fetch(`/api/daily-progress/${date}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('getDailyProgress error:', err);
      return null;
    }
  },

  async saveDailyProgress(payload: { date: string; items: any[] }): Promise<any | null> {
    try {
      const res = await fetch('/api/daily-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save daily progress failed');
      return await res.json();
    } catch (err) {
      console.error('saveDailyProgress error:', err);
      return null;
    }
  },

  async fetchDailyRange(start: string, end: string): Promise<any[] | null> {
    try {
      const res = await fetch(`/api/daily-progress?start=${start}&end=${end}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error('fetchDailyRange error:', err);
      return null;
    }
  },
};
