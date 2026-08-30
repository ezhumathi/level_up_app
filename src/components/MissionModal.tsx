import React, { useState } from 'react';
import { X, Sparkles, Plus, Clock, Award } from 'lucide-react';
import { Mission } from '../types';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mission: Omit<Mission, 'id' | 'completed'>) => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'morning' | 'fitness' | 'mindset' | 'evening' | 'custom'>('morning');
  const [xp, setXp] = useState<number>(30);
  const [timeStr, setTimeStr] = useState('06:00 AM');
  const [iconName, setIconName] = useState('activity');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      category,
      xp: Number(xp) || 25,
      timeStr: timeStr.trim() || undefined,
      iconName: iconName || 'sparkles',
    });

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#181b24] border border-[#558dff]/30 w-full max-w-md rounded-2xl p-6 shadow-[0_0_40px_rgba(85,141,255,0.2)] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8c90a0] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#558dff]/20 flex items-center justify-center text-[#558dff]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold tracking-wider text-[#b0c6ff] uppercase">
              NEW PROTOCOL MISSION
            </h3>
            <p className="text-xs text-[#8c90a0]">Add a daily discipline quest</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#c2c6d7] mb-1.5 uppercase tracking-wider">
              Mission Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 10 Min Ice Bath Protocol"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#10131c] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#424654] focus:outline-none focus:border-[#558dff] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#c2c6d7] mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#10131c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#558dff]"
              >
                <option value="morning">Morning Protocol</option>
                <option value="fitness">Fitness & Body</option>
                <option value="mindset">Mindset & Focus</option>
                <option value="evening">Evening Routine</option>
                <option value="custom">Custom Quest</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#c2c6d7] mb-1.5 uppercase tracking-wider">
                Target Time
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="06:30 AM"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="w-full bg-[#10131c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#558dff]"
                />
                <Clock className="w-3.5 h-3.5 absolute right-3 top-3 text-[#8c90a0]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[#c2c6d7] mb-1.5 uppercase tracking-wider">
                XP Reward
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={xp}
                  onChange={(e) => setXp(Number(e.target.value))}
                  className="w-full bg-[#10131c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#4edea3] font-mono font-bold focus:outline-none focus:border-[#558dff]"
                />
                <Award className="w-3.5 h-3.5 absolute right-3 top-3 text-[#4edea3]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#c2c6d7] mb-1.5 uppercase tracking-wider">
                Icon
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full bg-[#10131c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#558dff]"
              >
                <option value="activity">Activity</option>
                <option value="alarm">Alarm</option>
                <option value="droplet">Hydration</option>
                <option value="dumbbell">Dumbbell</option>
                <option value="book-open">Reading</option>
                <option value="brain">Brain / Deep Work</option>
                <option value="sparkles">Sparkles</option>
                <option value="heart-pulse">Health</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-[#8c90a0] hover:text-white hover:bg-white/5 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#558dff] hover:bg-[#407eff] text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(85,141,255,0.4)] flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              DEPLOY QUEST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
