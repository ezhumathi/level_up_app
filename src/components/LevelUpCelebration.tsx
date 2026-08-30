import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, X, Shield, Sparkles } from 'lucide-react';
import { UserStats } from '../types';
import { soundFx } from '../utils/audio';

interface LevelUpCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  isOpen,
  onClose,
  userStats,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundFx.playLevelUp();

      // Cyber confetti explosion
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#558dff', '#4edea3', '#d0bcff', '#ffffff'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#558dff', '#4edea3', '#d0bcff', '#ffffff'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div className="bg-[#181b24] border-2 border-[#558dff] w-full max-w-md rounded-3xl p-8 shadow-[0_0_60px_rgba(85,141,255,0.4)] text-center relative overflow-hidden">
        {/* Background glow orb */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#558dff]/20 blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8c90a0] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-[#571bc1] to-[#558dff] flex items-center justify-center shadow-[0_0_30px_rgba(85,141,255,0.6)] transform rotate-3 hover:rotate-0 transition-transform">
            <Award className="w-12 h-12 text-white" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-[#4edea3] text-black font-mono text-[10px] font-black tracking-widest shadow-md">
            SURGE
          </span>
        </div>

        <h2 className="font-mono text-xs font-bold tracking-[0.3em] text-[#d0bcff] uppercase mb-1">
          DISCIPLINE SURGE ACTIVATED
        </h2>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          LEVEL {userStats.level} UNLOCKED
        </h1>
        <p className="text-sm text-[#c2c6d7] max-w-xs mx-auto mb-6">
          Title Acquired: <span className="text-[#4edea3] font-bold">{userStats.rankTitle}</span>
        </p>

        {/* XP stats pill */}
        <div className="bg-[#10131c] rounded-2xl p-4 border border-white/10 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#8c90a0]">PROGRESSION XP</span>
            <span className="text-[#4edea3] font-bold">+{userStats.currentXp} XP</span>
          </div>
          <div className="w-full bg-[#272a33] h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#558dff] to-[#4edea3] rounded-full shadow-[0_0_10px_#4edea3]"
              style={{ width: `${(userStats.currentXp / userStats.nextLevelXp) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-[#8c90a0]">
            <span>STREAK: {userStats.currentStreak} DAYS</span>
            <span>NEXT LVL: {userStats.nextLevelXp} XP</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#558dff] to-[#407eff] text-white font-mono text-xs font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(85,141,255,0.5)] hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          CONTINUE CONQUEST
        </button>
      </div>
    </div>
  );
};
