import React, { useState } from 'react';
import {
  Activity,
  Trophy,
  Sun,
  Moon,
  Check,
  CircleDot,
  Circle,
  Clock,
  Dumbbell,
  Plus,
  Flame,
  Sparkles,
} from 'lucide-react';
import { FitnessGauge, PersonalRecord, RoutineItem } from '../types';
import { WorkoutTimerModal } from './WorkoutTimerModal';
import { soundFx } from '../utils/audio';

interface HabitsTabProps {
  fitnessGauges: FitnessGauge[];
  onUpdateFitnessGauge: (id: string, newVal: number) => void;
  personalRecords: PersonalRecord[];
  onUpdatePR: (id: string, newVal: string) => void;
  morningRoutine: RoutineItem[];
  onToggleMorningRoutine: (id: string) => void;
  eveningRoutine: RoutineItem[];
  onToggleEveningRoutine: (id: string) => void;
}

export const HabitsTab: React.FC<HabitsTabProps> = ({
  fitnessGauges,
  onUpdateFitnessGauge,
  personalRecords,
  onUpdatePR,
  morningRoutine,
  onToggleMorningRoutine,
  eveningRoutine,
  onToggleEveningRoutine,
}) => {
  const [activeModal, setActiveModal] = useState<{
    open: boolean;
    type: 'plank' | 'pushups' | 'squats';
    gaugeId: string;
    current: number;
    target: number;
  } | null>(null);

  const [editingPR, setEditingPR] = useState<PersonalRecord | null>(null);
  const [prInput, setPrInput] = useState('');

  const openWorkoutModal = (gauge: FitnessGauge) => {
    soundFx.playClick();
    let type: 'plank' | 'pushups' | 'squats' = 'pushups';
    if (gauge.name.toLowerCase().includes('plank')) type = 'plank';
    else if (gauge.name.toLowerCase().includes('squat')) type = 'squats';

    setActiveModal({
      open: true,
      type,
      gaugeId: gauge.id,
      current: gauge.current,
      target: gauge.target,
    });
  };

  const handleSaveModal = (val: number) => {
    if (activeModal) {
      onUpdateFitnessGauge(activeModal.gaugeId, val);
      setActiveModal(null);
    }
  };

  const handleSavePR = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPR && prInput.trim()) {
      soundFx.playComplete();
      onUpdatePR(editingPR.id, prInput.trim());
      setEditingPR(null);
      setPrInput('');
    }
  };

  return (
    <div className="w-full max-w-4xl px-4 md:px-6 py-8 mx-auto flex flex-col gap-10 pb-24">
      {/* Header Section */}
      <div className="flex flex-col gap-1.5 border-b border-white/10 pb-6">
        <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#b0c6ff] uppercase">
          FITNESS & ROUTINES
        </span>
        <p className="text-sm md:text-base text-[#c2c6d7] max-w-2xl">
          Daily physical conditioning and structured protocols for peak biological performance.
        </p>
      </div>

      {/* Section 1: Daily Fitness Missions */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-[#4edea3]">
          <Activity className="w-5 h-5 stroke-[2.5]" />
          <h2 className="font-mono text-base font-bold tracking-wider text-white uppercase">
            Daily Fitness Missions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fitnessGauges.map((gauge) => {
            const percent = Math.min(100, Math.round((gauge.current / gauge.target) * 100));
            const isCompleted = percent >= 100;
            const radius = 34;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (percent / 100) * circumference;

            return (
              <div
                key={gauge.id}
                onClick={() => openWorkoutModal(gauge)}
                className="bg-[#1c1f28]/70 backdrop-blur-md border border-white/10 hover:border-[#4edea3]/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(0,0,0,0.3)] group relative overflow-hidden"
              >
                {/* Background glow when done */}
                {isCompleted && (
                  <div className="absolute inset-0 bg-[#4edea3]/5 pointer-events-none" />
                )}

                {/* Circular Progress Indicator */}
                <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="5"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      fill="transparent"
                      stroke={isCompleted ? '#4edea3' : '#558dff'}
                      strokeWidth="5.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                      style={{
                        filter: isCompleted
                          ? 'drop-shadow(0 0 8px rgba(78, 222, 163, 0.7))'
                          : 'drop-shadow(0 0 8px rgba(85, 141, 255, 0.5))',
                      }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isCompleted ? (
                      <Check className="w-8 h-8 text-[#4edea3] stroke-[3]" />
                    ) : (
                      <span className="font-mono text-xl font-extrabold text-white">
                        {percent}%
                      </span>
                    )}
                  </div>
                </div>

                <span className="font-mono text-xs font-bold tracking-widest text-[#c2c6d7] uppercase group-hover:text-white transition-colors">
                  {gauge.name}
                </span>

                <span
                  className={`font-mono text-[10px] tracking-wider mt-1 font-semibold ${
                    isCompleted ? 'text-[#4edea3]' : 'text-[#8c90a0]'
                  }`}
                >
                  {isCompleted
                    ? 'DONE'
                    : gauge.isTimer
                    ? `${Math.floor(gauge.current / 60)}m / ${Math.floor(gauge.target / 60)}m`
                    : `${gauge.current} / ${gauge.target} REPS`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Personal Records */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#d0bcff]">
            <Trophy className="w-5 h-5" />
            <h2 className="font-mono text-base font-bold tracking-wider text-white uppercase">
              Personal Records
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8c90a0]">ALL-TIME STATS</span>
        </div>

        <div className="bg-[#1c1f28]/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative overflow-hidden">
          {personalRecords.map((pr) => (
            <div
              key={pr.id}
              onClick={() => {
                soundFx.playClick();
                setEditingPR(pr);
                setPrInput(pr.value);
              }}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#10131c]/60 border border-white/5 hover:border-[#d0bcff]/40 cursor-pointer transition-all group"
            >
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#8c90a0] tracking-widest uppercase mb-1">
                  {pr.name}
                </span>
                <span className="font-mono text-2xl font-black text-white group-hover:text-[#d0bcff] transition-colors">
                  {pr.value}
                </span>
                <span className="text-[10px] text-[#8c90a0] mt-0.5">
                  Set on {pr.dateAchieved}
                </span>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#272a33] flex items-center justify-center text-[#d0bcff] group-hover:bg-[#571bc1]/30 transition-colors">
                {pr.icon === 'clock' ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <Dumbbell className="w-5 h-5" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit PR Modal */}
      {editingPR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#181b24] border border-[#d0bcff]/30 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <h3 className="font-mono text-sm font-bold text-[#d0bcff] uppercase tracking-wider mb-2">
              UPDATE {editingPR.name}
            </h3>
            <p className="text-xs text-[#8c90a0] mb-4">
              Current Record: <span className="text-white font-mono">{editingPR.value}</span>
            </p>
            <form onSubmit={handleSavePR} className="space-y-4">
              <input
                type="text"
                required
                value={prInput}
                onChange={(e) => setPrInput(e.target.value)}
                placeholder="e.g. 110 or 6:45"
                className="w-full bg-[#10131c] border border-white/10 rounded-xl px-4 py-2.5 text-base font-mono text-white focus:outline-none focus:border-[#d0bcff]"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPR(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-[#8c90a0]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#d0bcff] text-[#23005c] font-mono text-xs font-bold"
                >
                  SAVE RECORD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section 3: Morning Routine */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-amber-400">
          <Sun className="w-5 h-5" />
          <h2 className="font-mono text-base font-bold tracking-wider text-white uppercase">
            Morning Routine
          </h2>
        </div>

        <div className="bg-[#1c1f28]/70 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 shadow-md flex flex-col gap-3">
          {morningRoutine.map((item) => {
            const isDone = item.status === 'completed';
            const inProgress = item.status === 'in_progress';

            return (
              <div
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  onToggleMorningRoutine(item.id);
                }}
                className={`p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-all select-none ${
                  isDone
                    ? 'bg-[#10131c]/70 border border-[#4edea3]/30 text-white'
                    : inProgress
                    ? 'bg-[#10131c]/90 border border-[#558dff]/50 text-white shadow-[0_0_15px_rgba(85,141,255,0.15)]'
                    : 'bg-[#10131c]/40 border border-white/5 text-[#8c90a0] hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-[#4edea3]/20 text-[#4edea3]'
                        : inProgress
                        ? 'bg-[#558dff]/20 text-[#558dff]'
                        : 'bg-[#272a33] text-[#8c90a0]'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : inProgress ? (
                      <CircleDot className="w-4 h-4 animate-spin text-[#558dff]" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className={`text-sm font-semibold ${isDone ? 'line-through opacity-80' : 'text-white'}`}>
                      {item.title}
                    </span>
                    <span
                      className={`font-mono text-[10px] tracking-wider ${
                        inProgress ? 'text-[#558dff] font-bold' : 'text-[#8c90a0]'
                      }`}
                    >
                      {item.time} {inProgress && '— In Progress'}
                    </span>
                  </div>
                </div>

                <span
                  className={`font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isDone
                      ? 'bg-[#4edea3]/10 text-[#4edea3]'
                      : inProgress
                      ? 'bg-[#558dff]/10 text-[#558dff]'
                      : 'bg-[#272a33] text-[#8c90a0]'
                  }`}
                >
                  {isDone ? 'COMPLETED' : inProgress ? 'ACTIVE' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Evening Routine */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Moon className="w-5 h-5" />
          <h2 className="font-mono text-base font-bold tracking-wider text-white uppercase">
            Evening Routine
          </h2>
        </div>

        <div className="bg-[#1c1f28]/70 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 shadow-md flex flex-col gap-3">
          {eveningRoutine.map((item) => {
            const isDone = item.status === 'completed';
            const inProgress = item.status === 'in_progress';

            return (
              <div
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  onToggleEveningRoutine(item.id);
                }}
                className={`p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-all select-none ${
                  isDone
                    ? 'bg-[#10131c]/70 border border-[#4edea3]/30 text-white'
                    : inProgress
                    ? 'bg-[#10131c]/90 border border-[#558dff]/50 text-white'
                    : 'bg-[#10131c]/40 border border-white/5 text-[#8c90a0] hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-[#4edea3]/20 text-[#4edea3]'
                        : inProgress
                        ? 'bg-[#558dff]/20 text-[#558dff]'
                        : 'bg-[#272a33] text-[#8c90a0]'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : inProgress ? (
                      <CircleDot className="w-4 h-4 animate-spin text-[#558dff]" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className={`text-sm font-semibold ${isDone ? 'line-through opacity-80' : 'text-white'}`}>
                      {item.title}
                    </span>
                    <span
                      className={`font-mono text-[10px] tracking-wider ${
                        inProgress ? 'text-[#558dff] font-bold' : 'text-[#8c90a0]'
                      }`}
                    >
                      {item.time} {inProgress && '— In Progress'}
                    </span>
                  </div>
                </div>

                <span
                  className={`font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isDone
                      ? 'bg-[#4edea3]/10 text-[#4edea3]'
                      : inProgress
                      ? 'bg-[#558dff]/10 text-[#558dff]'
                      : 'bg-[#272a33] text-[#8c90a0]'
                  }`}
                >
                  {isDone ? 'COMPLETED' : inProgress ? 'ACTIVE' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Workout Timer / Counter Modal */}
      {activeModal && (
        <WorkoutTimerModal
          isOpen={activeModal.open}
          onClose={() => setActiveModal(null)}
          type={activeModal.type}
          currentValue={activeModal.current}
          targetValue={activeModal.target}
          onUpdate={handleSaveModal}
        />
      )}
    </div>
  );
};
