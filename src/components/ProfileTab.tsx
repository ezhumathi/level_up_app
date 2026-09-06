import React, { useState } from 'react';
import {
  User,
  Shield,
  Award,
  Zap,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Check,
  Target,
  Clock,
  Droplet,
  Dumbbell,
  Database,
} from 'lucide-react';
import { UserStats } from '../types';
import { soundFx } from '../utils/audio';
import bhuvaneshRealPhoto from '../assets/images/bhuvanesh_real_upload.jpg';

interface ProfileTabProps {
  userStats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onResetMissions: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerSurge: () => void;
  mongoConnected?: boolean;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userStats,
  onUpdateStats,
  onResetMissions,
  soundEnabled,
  onToggleSound,
  onTriggerSurge,
  mongoConnected = true,
}) => {
  const [userName, setUserName] = useState(userStats.name);
  const [quote, setQuote] = useState(userStats.quote);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playComplete();
    onUpdateStats({
      name: userName.trim().toUpperCase() || 'BHUVANESH',
      quote: quote.trim() || '"Small daily disciplines, repeated with consistency, create unstoppable excellence."',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const xpPercent = Math.min(100, Math.round((userStats.currentXp / userStats.nextLevelXp) * 100));

  return (
    <div className="w-full max-w-3xl px-4 md:px-6 py-8 mx-auto flex flex-col gap-8 pb-24">
      {/* Profile Overview & Real Identity Showcase Card */}
      <div className="bg-[#1c1f28]/85 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#558dff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Real Uploaded Photo - Natural Portrait Display */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="w-44 h-60 sm:w-52 sm:h-72 rounded-2xl overflow-hidden border-2 border-[#558dff] shadow-[0_0_30px_rgba(85,141,255,0.35)] bg-[#141824] relative flex items-center justify-center">
            <img
            src={userStats.userPhotoUrl || userStats.avatarUrl || bhuvaneshRealPhoto}
            alt={userStats.name || 'User Photo'}
              className="w-full h-full object-cover block"
              style={{ objectPosition: 'center 12%' }}
            />
            {/* Level Badge Overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center px-2.5 py-1 rounded-xl bg-[#10131c]/85 backdrop-blur-md border border-white/10">
              <span className="font-mono text-[10px] text-[#b0c6ff] font-bold uppercase">
                IDENTITY VERIFIED
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#4edea3] text-black font-mono text-[10px] font-black tracking-wider uppercase shadow-sm">
                LVL {userStats.level}
              </span>
            </div>
          </div>
        </div>

        {/* User Info & Title */}
        <div className="flex-1 text-center md:text-left flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {userStats.name}
            </h1>
            <span className="px-3 py-1 rounded-full bg-[#571bc1]/60 border border-[#d0bcff]/30 text-[#d0bcff] font-mono text-xs font-bold tracking-widest uppercase">
              {userStats.rankTitle}
            </span>
          </div>

          <p className="text-sm sm:text-base text-[#c2c6d7] italic leading-relaxed">
            {userStats.quote}
          </p>

          {/* XP Progress Bar to Next Level */}
          <div className="mt-3 space-y-2 bg-[#141824]/60 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8c90a0]">LEVEL PROGRESSION</span>
              <span className="text-[#4edea3] font-bold">
                {userStats.currentXp} / {userStats.nextLevelXp} XP ({xpPercent}%)
              </span>
            </div>
            <div className="w-full bg-[#10131c] h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#558dff] via-[#d0bcff] to-[#4edea3] rounded-full shadow-[0_0_10px_#4edea3] transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#8c90a0]">
              <span>Current: {userStats.currentStreak} Day Streak</span>
              <span>Total Score: {userStats.todayScore} / {userStats.maxScore} PTS</span>
            </div>
          </div>
        </div>
      </div>

      {/* MongoDB Database Status Banner - Strictly Permanent Storage */}
      <div className="bg-[#101915]/90 border border-[#4edea3]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(78,222,163,0.08)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#4edea3]/20 border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white uppercase">
                MONGODB ATLAS PERSISTENCE
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3] font-mono text-[9px] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                {mongoConnected ? 'LIVE CONNECTED' : 'INITIALIZING'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#8c90a0] mt-0.5">
              Cluster: cluster0.gwrsbwk.mongodb.net • Database: Bhuvan • Permanent Ledger
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="px-3 py-1.5 rounded-xl bg-[#14231b] border border-[#4edea3]/30 text-[#4edea3] text-[11px] font-mono font-medium inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>PERMANENT DATA STORAGE</span>
          </span>
        </div>
      </div>

      {/* Quick Surge Action */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onTriggerSurge}
          className="p-5 rounded-2xl bg-gradient-to-r from-[#558dff]/20 to-[#571bc1]/20 border border-[#558dff]/40 hover:border-[#558dff] flex items-center justify-between text-left transition-all duration-300 shadow-lg group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#558dff]/20 flex items-center justify-center text-[#558dff] group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-white uppercase block">
                TRIGGER LEVEL SURGE
              </span>
              <span className="text-[11px] text-[#8c90a0]">Claim daily surge + bonus XP</span>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-[#4edea3]" />
        </button>

        <button
          onClick={onToggleSound}
          className="p-5 rounded-2xl bg-[#1c1f28]/80 border border-white/10 hover:border-white/20 flex items-center justify-between text-left transition-all shadow-lg"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#272a33] flex items-center justify-center text-[#d0bcff]">
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-white uppercase block">
                AUDIO SYNTH HUD
              </span>
              <span className="text-[11px] text-[#8c90a0]">
                {soundEnabled ? 'High-tech feedback ON' : 'Muted'}
              </span>
            </div>
          </div>
          <span className={`font-mono text-xs font-bold ${soundEnabled ? 'text-[#4edea3]' : 'text-[#8c90a0]'}`}>
            {soundEnabled ? 'ACTIVE' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Profile & Protocol Customization */}
      <div className="bg-[#1c1f28]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="font-mono text-xs font-bold tracking-widest text-[#b0c6ff] uppercase">
            PROTOCOL CONFIGURATION
          </span>
          <span className="text-[10px] font-mono text-[#8c90a0]">SYSTEM SETTINGS</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#c2c6d7] mb-1.5 uppercase tracking-wider">
              Identity Call-sign
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-[#10131c] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#558dff]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#c2c6d7] mb-1.5 uppercase tracking-wider">
              Discipline Creed / Quote
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full bg-[#10131c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white italic focus:outline-none focus:border-[#558dff]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="flex items-center gap-1 text-xs font-mono text-[#4edea3]">
                <Check className="w-4 h-4" /> CONFIG UPDATED & PERSISTED IN MONGO
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#558dff] hover:bg-[#407eff] text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(85,141,255,0.4)] transition-all"
            >
              SAVE SETTINGS
            </button>
          </div>
        </form>

        {/* Reset Daily Protocol button */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs text-[#8c90a0] block uppercase">Daily Cycle Reset</span>
            <span className="text-[11px] text-[#424654]">Reset all daily mission checkboxes in MongoDB for tomorrow</span>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onResetMissions();
            }}
            className="px-4 py-2 rounded-xl bg-[#272a33] hover:bg-[#31353e] text-xs font-mono text-[#8c90a0] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET DAY
          </button>
        </div>
      </div>
    </div>
  );
};
