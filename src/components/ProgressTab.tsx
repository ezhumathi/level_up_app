import React, { useState } from 'react';
import {
  TrendingUp,
  Flame,
  Award,
  Sun,
  Zap,
  Shield,
  ShieldCheck,
  Crown,
  ChevronDown,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Achievement, HeatmapDay, UserStats } from '../types';
import { WEEKLY_SCORES } from '../data/mockData';
import { soundFx } from '../utils/audio';

interface ProgressTabProps {
  userStats: UserStats;
  heatmapDays: HeatmapDay[];
  achievements: Achievement[];
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  userStats,
  heatmapDays,
  achievements,
}) => {
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [timeframe, setTimeframe] = useState<'This Week' | 'Last Week' | 'Monthly Average'>('This Week');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Group heatmap days by weeks (52 columns of 7 days)
  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];

  heatmapDays.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === heatmapDays.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getHeatmapColor = (count: number) => {
    switch (count) {
      case 4:
        return 'bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.5)]'; // High
      case 3:
        return 'bg-[#29b679]';
      case 2:
        return 'bg-[#186a48]';
      case 1:
        return 'bg-[#00472e]';
      default:
        return 'bg-[#181b24] border border-white/5';
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="w-6 h-6" />;
      case 'flame':
        return <Flame className="w-6 h-6 fill-current" />;
      case 'crown':
        return <Crown className="w-6 h-6" />;
      case 'zap':
        return <Zap className="w-6 h-6" />;
      case 'shield-check':
        return <ShieldCheck className="w-6 h-6" />;
      case 'shield':
        return <Shield className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  // Weekly Graph coordinates
  const maxChartScore = 100;
  const chartHeight = 160;
  const chartWidth = 500;
  const points = WEEKLY_SCORES.map((item, idx) => {
    const x = 30 + idx * ((chartWidth - 60) / (WEEKLY_SCORES.length - 1));
    const y = chartHeight - (item.score / maxChartScore) * (chartHeight - 40) - 20;
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className="w-full max-w-4xl px-4 md:px-6 py-8 mx-auto flex flex-col gap-8 pb-24">
      {/* 4 Stat Cards Grid matching Image 5.png */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Days Tracked */}
        <div className="bg-[#1c1f28]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-white/20 transition-colors shadow-lg">
          <span className="font-mono text-[11px] font-semibold text-[#8c90a0] tracking-widest uppercase">
            TOTAL DAYS TRACKED
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              {userStats.totalDaysTracked}
            </span>
            <TrendingUp className="w-5 h-5 text-[#558dff]" />
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-[#1c1f28]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-orange-500/40 transition-colors shadow-lg">
          <span className="font-mono text-[11px] font-semibold text-[#8c90a0] tracking-widest uppercase">
            CURRENT STREAK
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#558dff]">
              {userStats.currentStreak}
            </span>
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-pulse" />
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-[#1c1f28]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-purple-500/40 transition-colors shadow-lg">
          <span className="font-mono text-[11px] font-semibold text-[#8c90a0] tracking-widest uppercase">
            BEST STREAK
          </span>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              {userStats.bestStreak}
            </span>
            <Award className="w-5 h-5 text-[#d0bcff]" />
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-[#1c1f28]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#4edea3]/40 transition-colors shadow-lg">
          <span className="font-mono text-[11px] font-semibold text-[#8c90a0] tracking-widest uppercase">
            AVERAGE SCORE
          </span>
          <div className="flex items-baseline gap-1 mt-4">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4edea3] drop-shadow-[0_0_12px_rgba(78,222,163,0.4)]">
              {userStats.averageScore}
            </span>
            <span className="font-mono text-sm sm:text-base text-[#8c90a0]">/ 100</span>
          </div>
        </div>
      </div>

      {/* 365 Days of Marks Heatmap matching Image 5.png */}
      <div className="bg-[#1c1f28]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold tracking-widest text-[#c2c6d7] uppercase">
            365 DAYS OF MARKS
          </span>

          {/* Less to More Legend */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#8c90a0] uppercase tracking-wider">LESS</span>
            <div className="flex gap-1 items-center">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#181b24] border border-white/10" />
              <span className="w-2.5 h-2.5 rounded-sm bg-[#00472e]" />
              <span className="w-2.5 h-2.5 rounded-sm bg-[#186a48]" />
              <span className="w-2.5 h-2.5 rounded-sm bg-[#29b679]" />
              <span className="w-2.5 h-2.5 rounded-sm bg-[#4edea3]" />
            </div>
            <span className="font-mono text-[10px] text-[#8c90a0] uppercase tracking-wider">MORE</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-3 pt-2">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between text-[10px] font-mono text-[#8c90a0] py-1 select-none">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Grid of Weeks */}
          <div className="flex-1 overflow-x-auto pb-2">
            <div className="flex gap-1.5 min-w-[580px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedDay(day);
                      }}
                      className={`w-3 h-3 rounded-xs cursor-pointer transition-transform hover:scale-125 ${getHeatmapColor(
                        day.count
                      )}`}
                      title={`${day.date}: ${day.score}/100 Score (${day.missionsCount} Missions)`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Day Details Inspection */}
        {selectedDay && (
          <div className="mt-2 p-3 rounded-xl bg-[#10131c] border border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-[#b0c6ff]">DATE: {selectedDay.date}</span>
            <span className="text-[#4edea3] font-bold">SCORE: {selectedDay.score} / 100</span>
            <span className="text-white">{selectedDay.missionsCount} MISSIONS LOGGED</span>
          </div>
        )}
      </div>

      {/* Weekly Discipline Score Graph matching Image 5.png */}
      <div className="bg-[#1c1f28]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold tracking-widest text-[#c2c6d7] uppercase">
            WEEKLY DISCIPLINE SCORE
          </span>

          {/* Timeframe Dropdown */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="bg-[#10131c] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-[#c2c6d7] focus:outline-none focus:border-[#558dff] cursor-pointer"
            >
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
              <option value="Monthly Average">Monthly Average</option>
            </select>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full relative h-[180px] pt-4">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#558dff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#558dff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle Horizontal grid lines */}
            <line x1="20" y1="40" x2={chartWidth - 20} y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="20" y1="80" x2={chartWidth - 20} y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="20" y1="120" x2={chartWidth - 20} y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

            {/* Filled Area */}
            <path d={areaD} fill="url(#scoreAreaGrad)" />

            {/* Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#558dff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {points.map((pt, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className="fill-white stroke-[#558dff] stroke-2 group-hover:scale-125 transition-transform"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  className="fill-[#b0c6ff] font-mono text-[10px] font-bold"
                >
                  {pt.score}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Days of Week X-Axis */}
        <div className="flex justify-between px-4 text-xs font-mono text-[#8c90a0] uppercase border-t border-white/5 pt-2">
          {WEEKLY_SCORES.map((w, i) => (
            <span key={i} className="hover:text-white transition-colors cursor-pointer">
              {w.day}
            </span>
          ))}
        </div>
      </div>

      {/* Achievements Section matching Image 5.png */}
      <div className="bg-[#1c1f28]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-6 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold tracking-widest text-[#c2c6d7] uppercase">
            ACHIEVEMENTS
          </span>
          <span className="font-mono text-xs font-bold text-[#b0c6ff]">
            {achievements.filter((a) => a.unlocked).length}/{achievements.length} UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {achievements.map((ach) => {
            const isUnlocked = ach.unlocked;

            return (
              <div
                key={ach.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedAchievement(ach);
                }}
                className={`p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group relative ${
                  isUnlocked
                    ? 'bg-[#181b24] border border-[#558dff]/40 shadow-[0_0_20px_rgba(85,141,255,0.15)] hover:scale-105'
                    : 'bg-[#10131c]/60 border border-white/5 opacity-50 hover:opacity-80'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    isUnlocked
                      ? 'bg-[#558dff]/20 text-[#558dff] shadow-[0_0_12px_rgba(85,141,255,0.4)]'
                      : 'bg-[#272a33] text-[#8c90a0]'
                  }`}
                >
                  {getAchievementIcon(ach.icon)}
                </div>

                <span
                  className={`font-mono text-[10px] font-bold tracking-wider uppercase leading-tight ${
                    isUnlocked ? 'text-white' : 'text-[#8c90a0]'
                  }`}
                >
                  {ach.title}
                </span>

                {isUnlocked && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] absolute top-2 right-2 shadow-[0_0_6px_#4edea3]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#181b24] border border-[#558dff]/30 w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#558dff]/20 text-[#558dff] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(85,141,255,0.4)]">
              {getAchievementIcon(selectedAchievement.icon)}
            </div>
            <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider mb-1">
              {selectedAchievement.title}
            </h3>
            <p className="text-xs text-[#c2c6d7] mb-4">
              {selectedAchievement.description}
            </p>

            {selectedAchievement.progress !== undefined && selectedAchievement.maxProgress && (
              <div className="mb-4">
                <div className="flex justify-between text-[11px] font-mono text-[#8c90a0] mb-1">
                  <span>PROGRESS</span>
                  <span className="text-[#4edea3]">
                    {selectedAchievement.progress} / {selectedAchievement.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-[#10131c] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4edea3] rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedAchievement.progress / selectedAchievement.maxProgress) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <span
              className={`inline-block font-mono text-[10px] px-3 py-1 rounded-full uppercase tracking-wider mb-5 ${
                selectedAchievement.unlocked
                  ? 'bg-[#4edea3]/20 text-[#4edea3] font-bold'
                  : 'bg-[#272a33] text-[#8c90a0]'
              }`}
            >
              {selectedAchievement.unlocked ? `UNLOCKED (${selectedAchievement.unlockedAt})` : 'IN PROGRESS'}
            </span>

            <button
              onClick={() => setSelectedAchievement(null)}
              className="w-full py-2.5 rounded-xl bg-[#558dff] text-white font-mono text-xs font-bold uppercase shadow-md"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
