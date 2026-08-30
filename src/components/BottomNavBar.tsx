import React from 'react';
import { Home, Dumbbell, Bot, BarChart3, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'HOME', icon: Home },
    { id: 'habits' as TabType, label: 'HABITS', icon: Dumbbell },
    { id: 'ai' as TabType, label: 'AI', icon: Bot },
    { id: 'progress' as TabType, label: 'PROGRESS', icon: BarChart3 },
    { id: 'profile' as TabType, label: 'PROFILE', icon: User },
  ];

  return (
    <nav className="md:hidden bg-[#141722]/90 backdrop-blur-2xl fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-4 pb-safe z-50 rounded-t-3xl border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.8)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center relative transition-all duration-300 py-2 px-3 ${
              isActive
                ? 'text-[#558dff] -translate-y-1 scale-105'
                : 'text-[#8c90a0] hover:text-[#b0c6ff]'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1 w-6 h-1 bg-[#558dff] rounded-full shadow-[0_0_10px_#558dff]" />
            )}
            <Icon
              className={`w-5 h-5 mb-1 transition-transform duration-200 ${
                isActive ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(85,141,255,0.8)]' : 'stroke-[1.75px]'
              }`}
            />
            <span
              className={`font-mono text-[10px] tracking-wider font-semibold ${
                isActive ? 'text-[#b0c6ff]' : 'text-[#8c90a0]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
