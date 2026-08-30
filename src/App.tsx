import React, { useState, useEffect, useCallback } from 'react';
import {
  TabType,
  UserStats,
  Mission,
  FitnessGauge,
  PersonalRecord,
  RoutineItem,
  Achievement,
  HeatmapDay,
} from './types';
import {
  INITIAL_USER_STATS,
  INITIAL_MISSIONS,
  INITIAL_FITNESS_GAUGES,
  INITIAL_PERSONAL_RECORDS,
  INITIAL_MORNING_ROUTINE,
  INITIAL_EVENING_ROUTINE,
  INITIAL_ACHIEVEMENTS,
  generate365DaysHeatmap,
} from './data/mockData';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeTab } from './components/HomeTab';
import { HabitsTab } from './components/HabitsTab';
import { AiTab } from './components/AiTab';
import { ProgressTab } from './components/ProgressTab';
import { ProfileTab } from './components/ProfileTab';
import { MissionModal } from './components/MissionModal';
import { LevelUpCelebration } from './components/LevelUpCelebration';
import { soundFx } from './utils/audio';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Real-time Database & Sync State
  const [mongoConnected, setMongoConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Core App State
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('aura_user_stats');
      return saved ? JSON.parse(saved) : INITIAL_USER_STATS;
    } catch {
      return INITIAL_USER_STATS;
    }
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem('aura_missions');
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });

  const [fitnessGauges, setFitnessGauges] = useState<FitnessGauge[]>(() => {
    try {
      const saved = localStorage.getItem('aura_fitness_gauges');
      return saved ? JSON.parse(saved) : INITIAL_FITNESS_GAUGES;
    } catch {
      return INITIAL_FITNESS_GAUGES;
    }
  });

  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(() => {
    try {
      const saved = localStorage.getItem('aura_prs');
      return saved ? JSON.parse(saved) : INITIAL_PERSONAL_RECORDS;
    } catch {
      return INITIAL_PERSONAL_RECORDS;
    }
  });

  const [morningRoutine, setMorningRoutine] = useState<RoutineItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_morning_routine');
      return saved ? JSON.parse(saved) : INITIAL_MORNING_ROUTINE;
    } catch {
      return INITIAL_MORNING_ROUTINE;
    }
  });

  const [eveningRoutine, setEveningRoutine] = useState<RoutineItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_evening_routine');
      return saved ? JSON.parse(saved) : INITIAL_EVENING_ROUTINE;
    } catch {
      return INITIAL_EVENING_ROUTINE;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('aura_achievements');
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [heatmapDays] = useState<HeatmapDay[]>(() => generate365DaysHeatmap());

  // UI Modals & Settings
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync to local cache for instant offline fallback
  useEffect(() => {
    localStorage.setItem('aura_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('aura_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('aura_fitness_gauges', JSON.stringify(fitnessGauges));
  }, [fitnessGauges]);

  useEffect(() => {
    localStorage.setItem('aura_prs', JSON.stringify(personalRecords));
  }, [personalRecords]);

  useEffect(() => {
    localStorage.setItem('aura_morning_routine', JSON.stringify(morningRoutine));
  }, [morningRoutine]);

  useEffect(() => {
    localStorage.setItem('aura_evening_routine', JSON.stringify(eveningRoutine));
  }, [eveningRoutine]);

  // Initial Load from MongoDB
  const loadDataFromMongo = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [dbStatus, data] = await Promise.all([
        api.getDbStatus(),
        api.fetchAppData(),
      ]);

      setMongoConnected(dbStatus.status === 'connected');

      if (data) {
        if (data.userStats && Object.keys(data.userStats).length > 0) {
          setUserStats((prev) => ({ ...prev, ...data.userStats }));
        }
        if (Array.isArray(data.missions) && data.missions.length > 0) {
          setMissions(data.missions);
        }
        if (Array.isArray(data.fitnessGauges) && data.fitnessGauges.length > 0) {
          setFitnessGauges(data.fitnessGauges);
        }
        if (Array.isArray(data.personalRecords) && data.personalRecords.length > 0) {
          setPersonalRecords(data.personalRecords);
        }
        if (Array.isArray(data.morningRoutine) && data.morningRoutine.length > 0) {
          setMorningRoutine(data.morningRoutine);
        }
        if (Array.isArray(data.eveningRoutine) && data.eveningRoutine.length > 0) {
          setEveningRoutine(data.eveningRoutine);
        }
        if (Array.isArray(data.achievements) && data.achievements.length > 0) {
          setAchievements(data.achievements);
        }
      }
    } catch (err) {
      console.warn('Real-time sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadDataFromMongo();

    // Background Real-Time sync every 15 seconds
    const interval = setInterval(() => {
      loadDataFromMongo();
    }, 15000);

    return () => clearInterval(interval);
  }, [loadDataFromMongo]);

  // Recalculate and update score when toggling a mission
  const handleToggleMission = async (id: string) => {
    let targetMission: Mission | undefined;
    let nextCompleted = false;

    setMissions((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          nextCompleted = !m.completed;
          targetMission = m;
          const xpGain = nextCompleted ? m.xp : -m.xp;
          updateXp(xpGain);
          return { ...m, completed: nextCompleted };
        }
        return m;
      });

      const completedCount = updated.filter((m) => m.completed).length;
      const totalCount = updated.length;
      const score = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      const nextStats = {
        todayScore: Math.min(100, score),
        completedMissions: completedCount,
        totalMissions: totalCount,
      };

      setUserStats((s) => ({ ...s, ...nextStats }));

      // Persist score & stats to MongoDB
      api.updateUserStats(nextStats);

      return updated;
    });

    // Persist mission state in MongoDB
    if (targetMission) {
      await api.updateMission(id, { completed: nextCompleted });
    }
  };

  const updateXp = (gain: number) => {
    setUserStats((prev) => {
      let newXp = Math.max(0, prev.currentXp + gain);
      let level = prev.level;
      let nextLevelXp = prev.nextLevelXp;

      if (newXp >= nextLevelXp) {
        level += 1;
        newXp = newXp - nextLevelXp;
        nextLevelXp = Math.round(nextLevelXp * 1.25);
        setIsCelebrationOpen(true);
      }

      const updated = {
        ...prev,
        currentXp: newXp,
        level,
        nextLevelXp,
      };

      // Persist XP to MongoDB
      api.updateUserStats({ currentXp: newXp, level, nextLevelXp });

      return updated;
    });
  };

  const handleAddMission = async (newMission: Omit<Mission, 'id' | 'completed'>) => {
    soundFx.playComplete();
    const created: Mission = {
      ...newMission,
      id: `m-${Date.now()}`,
      completed: false,
    };
    setMissions((prev) => [created, ...prev]);
    setUserStats((s) => ({ ...s, totalMissions: s.totalMissions + 1 }));

    // Persist in MongoDB
    await api.saveMission(created);
  };

  const handleUpdateFitnessGauge = async (id: string, newVal: number) => {
    setFitnessGauges((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return { ...g, current: newVal };
        }
        return g;
      })
    );

    // Persist in MongoDB
    await api.updateFitnessGauge(id, newVal);
  };

  const handleUpdatePR = async (id: string, newVal: string) => {
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    setPersonalRecords((prev) =>
      prev.map((pr) => {
        if (pr.id === id) {
          return {
            ...pr,
            value: newVal,
            dateAchieved: dateStr,
          };
        }
        return pr;
      })
    );

    // Persist in MongoDB
    await api.updatePersonalRecord(id, newVal, dateStr);
  };

  const handleToggleMorningRoutine = async (id: string) => {
    let nextStatus: 'pending' | 'in_progress' | 'completed' = 'pending';
    setMorningRoutine((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          nextStatus =
            item.status === 'pending'
              ? 'in_progress'
              : item.status === 'in_progress'
              ? 'completed'
              : 'pending';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );

    // Persist in MongoDB
    await api.updateRoutineItem(id, nextStatus);
  };

  const handleToggleEveningRoutine = async (id: string) => {
    let nextStatus: 'pending' | 'in_progress' | 'completed' = 'pending';
    setEveningRoutine((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          nextStatus =
            item.status === 'pending'
              ? 'in_progress'
              : item.status === 'in_progress'
              ? 'completed'
              : 'pending';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );

    // Persist in MongoDB
    await api.updateRoutineItem(id, nextStatus);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setEnabled(next);
  };

  const handleResetMissions = async () => {
    setMissions((prev) => prev.map((m) => ({ ...m, completed: false })));
    setMorningRoutine((prev) => prev.map((m) => ({ ...m, status: 'pending' })));
    setEveningRoutine((prev) => prev.map((m) => ({ ...m, status: 'pending' })));
    setUserStats((s) => ({
      ...s,
      todayScore: 0,
      completedMissions: 0,
    }));

    // Persist reset in MongoDB
    await api.resetDayProtocol();
  };

  const handleTriggerSurge = () => {
    setIsCelebrationOpen(true);
  };

  const handleForceSync = () => {
    soundFx.playClick();
    loadDataFromMongo();
  };

  const handleUpdateProfileStats = (newStats: Partial<UserStats>) => {
    setUserStats((prev) => ({ ...prev, ...newStats }));
    api.updateUserStats(newStats);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-[#e0e2ee] flex flex-col font-sans selection:bg-[#558dff] selection:text-white">
      {/* Sticky Top Cyber App Bar */}
      <TopAppBar
        userStats={userStats}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewMission={() => setIsMissionModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onTriggerSurge={handleTriggerSurge}
      />

      {/* Main Screen Content View */}
      <main className="flex-1 w-full flex flex-col">
        {currentTab === 'home' && (
          <HomeTab
            userStats={userStats}
            missions={missions}
            onToggleMission={handleToggleMission}
            onOpenNewMission={() => setIsMissionModalOpen(true)}
            onTriggerSurge={handleTriggerSurge}
          />
        )}

        {currentTab === 'habits' && (
          <HabitsTab
            fitnessGauges={fitnessGauges}
            onUpdateFitnessGauge={handleUpdateFitnessGauge}
            personalRecords={personalRecords}
            onUpdatePR={handleUpdatePR}
            morningRoutine={morningRoutine}
            onToggleMorningRoutine={handleToggleMorningRoutine}
            eveningRoutine={eveningRoutine}
            onToggleEveningRoutine={handleToggleEveningRoutine}
          />
        )}

        {currentTab === 'ai' && (
          <AiTab userStats={userStats} missions={missions} />
        )}

        {currentTab === 'progress' && (
          <ProgressTab
            userStats={userStats}
            heatmapDays={heatmapDays}
            achievements={achievements}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab
            userStats={userStats}
            onUpdateStats={handleUpdateProfileStats}
            onResetMissions={handleResetMissions}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onTriggerSurge={handleTriggerSurge}
            mongoConnected={mongoConnected}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Modal: Create Protocol Mission */}
      <MissionModal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        onSave={handleAddMission}
      />

      {/* Modal: Level Up Celebration */}
      <LevelUpCelebration
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        userStats={userStats}
      />
    </div>
  );
}
