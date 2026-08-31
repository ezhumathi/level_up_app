import React from 'react';
import { Flame, Plus, Volume2, VolumeX } from 'lucide-react';
import { TabType, UserStats } from '../types';
import bhuvaneshRealPhoto from '../assets/images/bhuvanesh_real_upload.jpg';

interface TopAppBarProps {
  userStats: UserStats;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenNewMission: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerSurge: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  userStats,
  currentTab,
  onSelectTab,
  onOpenNewMission,
  soundEnabled,
  onToggleSound,
  onTriggerSurge,
}) => {
  return (
    <header className="bg-[#10131c]/80 backdrop-blur-xl w-full top-0 sticky z-50 border-b border-white/10 shadow-[0_0_20px_rgba(46,123,255,0.12)] flex justify-between items-center px-4 md:px-8 py-3 h-[72px]">
      {/* User Brand & Avatar */}
      <div 
        onClick={() => onSelectTab('profile')}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        {/* Perfect Circle Avatar with Exterior Status Beacon */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#558dff] shadow-[0_0_15px_rgba(85,141,255,0.45)] bg-[#141824] aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img
              src={userStats.avatarUrl || userStats.userPhotoUrl || bhuvaneshRealPhoto}
              alt={userStats.name || 'User'}
              className="w-full h-full object-cover block"
              style={{ objectPosition: '50% 12%' }}
            />
          </div>
          {/* Active Status Beacon - Exterior so it does not distort circle */}
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4edea3] ring-2 ring-[#10131c] shadow-[0_0_8px_#4edea3]" />
        </div>

        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#b0c6ff] uppercase group-hover:text-white transition-colors">
            {userStats.name}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#8c90a0]">
              LVL {userStats.level} • {userStats.rankTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Center Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-[#181b24]/60 p-1.5 rounded-xl border border-white/5">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold tracking-wider transition-all duration-200 ${
            currentTab === 'home'
              ? 'bg-[#558dff] text-white shadow-[0_0_15px_rgba(85,141,255,0.4)]'
              : 'text-[#8c90a0] hover:text-white hover:bg-white/5'
          }`}
        >
          HOME
        </button>
        <button
          onClick={() => onSelectTab('habits')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold tracking-wider transition-all duration-200 ${
            currentTab === 'habits'
              ? 'bg-[#558dff] text-white shadow-[0_0_15px_rgba(85,141,255,0.4)]'
              : 'text-[#8c90a0] hover:text-white hover:bg-white/5'
          }`}
        >
          ROUTINES
        </button>
        <button
          onClick={() => onSelectTab('ai')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold tracking-wider transition-all duration-200 ${
            currentTab === 'ai'
              ? 'bg-[#558dff] text-white shadow-[0_0_15px_rgba(85,141,255,0.4)]'
              : 'text-[#8c90a0] hover:text-white hover:bg-white/5'
          }`}
        >
          BHUVA AI
        </button>
        <button
          onClick={() => onSelectTab('progress')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold tracking-wider transition-all duration-200 ${
            currentTab === 'progress'
              ? 'bg-[#558dff] text-white shadow-[0_0_15px_rgba(85,141,255,0.4)]'
              : 'text-[#8c90a0] hover:text-white hover:bg-white/5'
          }`}
        >
          PROGRESS
        </button>
        <button
          onClick={() => onSelectTab('profile')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold tracking-wider transition-all duration-200 ${
            currentTab === 'profile'
              ? 'bg-[#558dff] text-white shadow-[0_0_15px_rgba(85,141,255,0.4)]'
              : 'text-[#8c90a0] hover:text-white hover:bg-white/5'
          }`}
        >
          PROFILE
        </button>
      </nav>

      {/* Right HUD Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Add Quest button */}
        <button
          onClick={onOpenNewMission}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#272a33] hover:bg-[#31353e] text-xs font-mono text-[#b0c6ff] border border-white/10 hover:border-[#558dff]/40 transition-all shadow-sm"
          title="Create New Mission"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NEW QUEST</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="w-9 h-9 rounded-lg bg-[#181b24] border border-white/5 flex items-center justify-center text-[#8c90a0] hover:text-white hover:border-white/20 transition-all"
          title={soundEnabled ? 'Mute Audio Effects' : 'Unmute Audio Effects'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#4edea3]" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Fire Streak Counter */}
        <div
          onClick={onTriggerSurge}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/30 text-orange-400 font-mono text-xs font-bold cursor-pointer hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] group"
          title="Daily Streak Surge"
        >
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse group-hover:scale-110 transition-transform" />
          <span>{userStats.currentStreak} DAYS</span>
        </div>
      </div>
    </header>
  );
};
