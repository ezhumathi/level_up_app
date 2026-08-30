import React from 'react';
import {
  Check,
  Droplet,
  Activity,
  BookOpen,
  Brain,
  Sparkles,
  Flame,
  CheckSquare,
  AlarmClock,
  Dumbbell,
  HeartPulse,
  PenTool,
  Plus,
  Zap,
} from 'lucide-react';
import { Mission, UserStats } from '../types';
import { ProgressCore3D } from './ProgressCore3D';
import { CosmicShaderBackground } from './CosmicShaderBackground';
import { soundFx } from '../utils/audio';

interface HomeTabProps {
  userStats: UserStats;
  missions: Mission[];
  onToggleMission: (id: string) => void;
  onOpenNewMission: () => void;
  onTriggerSurge: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  userStats,
  missions,
  onToggleMission,
  onOpenNewMission,
  onTriggerSurge,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'alarm':
        return <AlarmClock className="w-5 h-5" />;
      case 'droplet':
        return <Droplet className="w-5 h-5" />;
      case 'activity':
        return <Activity className="w-5 h-5" />;
      case 'dumbbell':
        return <Dumbbell className="w-5 h-5" />;
      case 'book-open':
        return <BookOpen className="w-5 h-5" />;
      case 'brain':
        return <Brain className="w-5 h-5" />;
      case 'heart-pulse':
        return <HeartPulse className="w-5 h-5" />;
      case 'pen-tool':
        return <PenTool className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const morningMissions = missions.filter((m) => m.category === 'morning');
  const fitnessMissions = missions.filter((m) => m.category === 'fitness');
  const mindsetMissions = missions.filter((m) => m.category === 'mindset');
  const otherMissions = missions.filter((m) => m.category === 'evening' || m.category === 'custom');

  const handleMissionClick = (id: string, currentlyCompleted: boolean) => {
    if (!currentlyCompleted) {
      soundFx.playComplete();
    } else {
      soundFx.playClick();
    }
    onToggleMission(id);
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* Hero Section with Live WebGL Shader */}
      <section className="w-full relative min-h-[460px] md:min-h-[520px] flex items-center justify-center p-4 md:p-6 overflow-hidden">
        {/* Background Cosmic Shader Canvas */}
        <CosmicShaderBackground className="absolute inset-0 w-full h-full z-0 opacity-65" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl w-full pt-4">
          {/* Greeting Header */}
          <div className="mb-4 md:mb-6 flex flex-col items-center gap-1.5 w-full">
            <h2 className="font-mono text-xs text-[#d0bcff] uppercase tracking-[0.25em] opacity-90">
              {userStats.dateStr}
            </h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#b0c6ff] tracking-tight drop-shadow-[0_0_20px_rgba(85,141,255,0.25)]">
              GOOD MORNING, {userStats.name}
            </h1>
            <p className="text-sm md:text-base text-[#c2c6d7] italic max-w-lg mt-1">
              {userStats.quote}
            </p>
          </div>

          {/* Central 3D Interactive Score Core */}
          <ProgressCore3D
            score={userStats.todayScore}
            maxScore={userStats.maxScore}
            onCoreClick={onTriggerSurge}
          />

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-3 w-full max-w-md mt-4">
            <div className="flex-1 min-w-[140px] bg-[#1c1f28]/70 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col items-center hover:border-[#558dff]/40 transition-colors">
              <span className="flex items-center gap-1 text-xs text-[#d0bcff] mb-0.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase tracking-wider">Protocol</span>
              </span>
              <span className="font-mono text-xs font-bold text-white">
                {missions.filter((m) => m.completed).length} / {missions.length} MISSIONS
              </span>
            </div>

            <div
              onClick={onTriggerSurge}
              className="flex-1 min-w-[140px] bg-[#1c1f28]/70 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col items-center hover:border-orange-500/50 transition-colors cursor-pointer group"
            >
              <span className="flex items-center gap-1 text-xs text-orange-400 mb-0.5">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span className="font-mono text-[10px] uppercase tracking-wider">Discipline</span>
              </span>
              <span className="font-mono text-xs font-bold text-white group-hover:text-orange-300 transition-colors">
                {userStats.currentStreak} DAY STREAK
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Missions Grid Section */}
      <section className="w-full max-w-4xl px-4 md:px-6 py-8 flex flex-col gap-8 pb-16">
        {/* Morning Protocol Section */}
        <div className="flex flex-col gap-3.5 w-full">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#558dff] shadow-[0_0_8px_#558dff]" />
              <h3 className="font-mono text-sm font-bold tracking-wider text-white uppercase">
                MORNING PROTOCOL
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#8c90a0]">
              {morningMissions.filter((m) => m.completed).length}/{morningMissions.length} DONE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {morningMissions.map((mission) => (
              <div
                key={mission.id}
                onClick={() => handleMissionClick(mission.id, mission.completed)}
                className={`p-4 rounded-xl flex items-center justify-between relative overflow-hidden transition-all duration-200 cursor-pointer select-none group ${
                  mission.completed
                    ? 'bg-[#181b24]/50 border border-[#4edea3]/30 shadow-[inset_0_0_20px_rgba(78,222,163,0.06)]'
                    : 'hud-glass-interactive'
                }`}
              >
                {mission.completed && (
                  <div className="absolute inset-0 bg-[#4edea3]/5 pointer-events-none" />
                )}

                <div className="flex items-center gap-3.5 z-10">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      mission.completed
                        ? 'bg-[#4edea3]/20 text-[#4edea3] shadow-[0_0_15px_rgba(78,222,163,0.3)]'
                        : 'bg-[#272a33] text-[#8c90a0] group-hover:text-[#558dff] group-hover:bg-[#558dff]/10'
                    }`}
                  >
                    {mission.completed ? <Check className="w-5 h-5 stroke-[2.5]" /> : getIcon(mission.iconName)}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        mission.completed
                          ? 'line-through text-[#8c90a0] opacity-80'
                          : 'text-white group-hover:text-[#b0c6ff]'
                      }`}
                    >
                      {mission.title}
                    </span>
                    <span
                      className={`font-mono text-[10px] tracking-wider mt-0.5 ${
                        mission.completed ? 'text-[#4edea3]' : 'text-[#8c90a0]'
                      }`}
                    >
                      {mission.completed ? 'MISSION COMPLETE' : mission.timeStr || 'PENDING'}
                    </span>
                  </div>
                </div>

                <span
                  className={`font-mono text-xs font-bold z-10 transition-colors ${
                    mission.completed ? 'text-[#4edea3] opacity-80' : 'text-[#558dff]'
                  }`}
                >
                  +{mission.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fitness Section */}
        <div className="flex flex-col gap-3.5 w-full">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d0bcff] shadow-[0_0_8px_#d0bcff]" />
              <h3 className="font-mono text-sm font-bold tracking-wider text-white uppercase">
                FITNESS
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#8c90a0]">
              {fitnessMissions.filter((m) => m.completed).length}/{fitnessMissions.length} DONE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {fitnessMissions.map((mission) => (
              <div
                key={mission.id}
                onClick={() => handleMissionClick(mission.id, mission.completed)}
                className={`p-4 rounded-xl flex items-center justify-between relative overflow-hidden transition-all duration-200 cursor-pointer select-none group ${
                  mission.completed
                    ? 'bg-[#181b24]/50 border border-[#4edea3]/30 shadow-[inset_0_0_20px_rgba(78,222,163,0.06)]'
                    : 'hud-glass-interactive'
                }`}
              >
                {mission.completed && (
                  <div className="absolute inset-0 bg-[#4edea3]/5 pointer-events-none" />
                )}

                <div className="flex items-center gap-3.5 z-10">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      mission.completed
                        ? 'bg-[#4edea3]/20 text-[#4edea3] shadow-[0_0_15px_rgba(78,222,163,0.3)]'
                        : 'bg-[#272a33] text-[#8c90a0] group-hover:text-[#558dff] group-hover:bg-[#558dff]/10'
                    }`}
                  >
                    {mission.completed ? <Check className="w-5 h-5 stroke-[2.5]" /> : getIcon(mission.iconName)}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        mission.completed
                          ? 'line-through text-[#8c90a0] opacity-80'
                          : 'text-white group-hover:text-[#b0c6ff]'
                      }`}
                    >
                      {mission.title}
                    </span>
                    <span
                      className={`font-mono text-[10px] tracking-wider mt-0.5 ${
                        mission.completed ? 'text-[#4edea3]' : 'text-[#8c90a0]'
                      }`}
                    >
                      {mission.completed ? 'MISSION COMPLETE' : mission.timeStr || 'TARGET'}
                    </span>
                  </div>
                </div>

                <span
                  className={`font-mono text-xs font-bold z-10 transition-colors ${
                    mission.completed ? 'text-[#4edea3] opacity-80' : 'text-[#558dff]'
                  }`}
                >
                  +{mission.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mindset Section */}
        <div className="flex flex-col gap-3.5 w-full">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_#4edea3]" />
              <h3 className="font-mono text-sm font-bold tracking-wider text-white uppercase">
                MINDSET
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#8c90a0]">
              {mindsetMissions.filter((m) => m.completed).length}/{mindsetMissions.length} DONE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {mindsetMissions.map((mission) => (
              <div
                key={mission.id}
                onClick={() => handleMissionClick(mission.id, mission.completed)}
                className={`p-4 rounded-xl flex items-center justify-between relative overflow-hidden transition-all duration-200 cursor-pointer select-none group ${
                  mission.completed
                    ? 'bg-[#181b24]/50 border border-[#4edea3]/30 shadow-[inset_0_0_20px_rgba(78,222,163,0.06)]'
                    : 'hud-glass-interactive'
                }`}
              >
                {mission.completed && (
                  <div className="absolute inset-0 bg-[#4edea3]/5 pointer-events-none" />
                )}

                <div className="flex items-center gap-3.5 z-10">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      mission.completed
                        ? 'bg-[#4edea3]/20 text-[#4edea3] shadow-[0_0_15px_rgba(78,222,163,0.3)]'
                        : 'bg-[#272a33] text-[#8c90a0] group-hover:text-[#558dff] group-hover:bg-[#558dff]/10'
                    }`}
                  >
                    {mission.completed ? <Check className="w-5 h-5 stroke-[2.5]" /> : getIcon(mission.iconName)}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        mission.completed
                          ? 'line-through text-[#8c90a0] opacity-80'
                          : 'text-white group-hover:text-[#b0c6ff]'
                      }`}
                    >
                      {mission.title}
                    </span>
                    <span
                      className={`font-mono text-[10px] tracking-wider mt-0.5 ${
                        mission.completed ? 'text-[#4edea3]' : 'text-[#8c90a0]'
                      }`}
                    >
                      {mission.completed ? 'MISSION COMPLETE' : mission.timeStr || 'TARGET'}
                    </span>
                  </div>
                </div>

                <span
                  className={`font-mono text-xs font-bold z-10 transition-colors ${
                    mission.completed ? 'text-[#4edea3] opacity-80' : 'text-[#558dff]'
                  }`}
                >
                  +{mission.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Evening & Custom Quests */}
        {otherMissions.length > 0 && (
          <div className="flex flex-col gap-3.5 w-full">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <h3 className="font-mono text-sm font-bold tracking-wider text-white uppercase">
                  EVENING & CUSTOM QUESTS
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {otherMissions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => handleMissionClick(mission.id, mission.completed)}
                  className={`p-4 rounded-xl flex items-center justify-between relative overflow-hidden transition-all duration-200 cursor-pointer select-none group ${
                    mission.completed
                      ? 'bg-[#181b24]/50 border border-[#4edea3]/30'
                      : 'hud-glass-interactive'
                  }`}
                >
                  <div className="flex items-center gap-3.5 z-10">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        mission.completed
                          ? 'bg-[#4edea3]/20 text-[#4edea3]'
                          : 'bg-[#272a33] text-[#8c90a0] group-hover:text-[#558dff]'
                      }`}
                    >
                      {mission.completed ? <Check className="w-5 h-5" /> : getIcon(mission.iconName)}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold ${mission.completed ? 'line-through text-[#8c90a0]' : 'text-white'}`}>
                        {mission.title}
                      </span>
                      <span className="font-mono text-[10px] text-[#8c90a0]">
                        {mission.completed ? 'MISSION COMPLETE' : mission.timeStr || 'SCHEDULED'}
                      </span>
                    </div>
                  </div>
                  <span className={`font-mono text-xs font-bold ${mission.completed ? 'text-[#4edea3]' : 'text-[#558dff]'}`}>
                    +{mission.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deploy New Quest Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onOpenNewMission}
            className="px-6 py-3 rounded-xl bg-[#1c1f28] hover:bg-[#272a33] border border-white/10 hover:border-[#558dff]/50 font-mono text-xs font-semibold text-[#b0c6ff] flex items-center gap-2 transition-all shadow-md group"
          >
            <Plus className="w-4 h-4 text-[#558dff] group-hover:scale-110 transition-transform" />
            DEPLOY CUSTOM PROTOCOL MISSION
          </button>
        </div>
      </section>
    </div>
  );
};
