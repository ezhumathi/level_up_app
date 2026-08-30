import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Check, Plus, Minus } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface WorkoutTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'plank' | 'pushups' | 'squats';
  currentValue: number;
  targetValue: number;
  onUpdate: (val: number) => void;
}

export const WorkoutTimerModal: React.FC<WorkoutTimerModalProps> = ({
  isOpen,
  onClose,
  type,
  currentValue,
  targetValue,
  onUpdate,
}) => {
  const [seconds, setSeconds] = useState(type === 'plank' ? currentValue : 0);
  const [isActive, setIsActive] = useState(false);
  const [reps, setReps] = useState(type !== 'plank' ? currentValue : 0);

  useEffect(() => {
    if (isOpen) {
      if (type === 'plank') {
        setSeconds(currentValue);
      } else {
        setReps(currentValue);
      }
      setIsActive(false);
    }
  }, [isOpen, type, currentValue]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && type === 'plank') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, type]);

  if (!isOpen) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    soundFx.playComplete();
    if (type === 'plank') {
      onUpdate(seconds);
    } else {
      onUpdate(reps);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#181b24] border border-[#558dff]/30 w-full max-w-sm rounded-2xl p-6 shadow-[0_0_40px_rgba(85,141,255,0.25)] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8c90a0] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-mono text-sm font-bold tracking-widest text-[#b0c6ff] uppercase mb-1">
          {type === 'plank' ? 'PLANK PROTOCOL STOPWATCH' : `${type.toUpperCase()} LOGGER`}
        </h3>
        <p className="text-xs text-[#8c90a0] mb-6">
          Target: {type === 'plank' ? formatTime(targetValue) : `${targetValue} reps`}
        </p>

        {type === 'plank' ? (
          <div className="my-6 flex flex-col items-center">
            <div className="w-44 h-44 rounded-full border-4 border-[#4edea3]/40 flex flex-col items-center justify-center bg-[#10131c] shadow-[inset_0_0_30px_rgba(78,222,163,0.2)]">
              <span className="font-mono text-4xl font-extrabold text-white tracking-wider">
                {formatTime(seconds)}
              </span>
              <span className="text-[10px] font-mono text-[#4edea3] mt-1 tracking-widest uppercase">
                {isActive ? 'ACTIVE COUNT' : 'PAUSED'}
              </span>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsActive(!isActive);
                }}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-amber-500 hover:bg-amber-600 text-black'
                    : 'bg-[#558dff] hover:bg-[#407eff] text-white shadow-[0_0_15px_rgba(85,141,255,0.4)]'
                }`}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isActive ? 'PAUSE' : 'START'}
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsActive(false);
                  setSeconds(0);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#272a33] text-[#8c90a0] hover:text-white font-mono text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                RESET
              </button>
            </div>
          </div>
        ) : (
          <div className="my-6 flex flex-col items-center">
            <div className="w-44 h-44 rounded-full border-4 border-[#558dff]/40 flex flex-col items-center justify-center bg-[#10131c] shadow-[inset_0_0_30px_rgba(85,141,255,0.2)]">
              <span className="font-mono text-5xl font-black text-white">
                {reps}
              </span>
              <span className="text-[10px] font-mono text-[#b0c6ff] mt-1 tracking-widest uppercase">
                / {targetValue} REPS
              </span>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setReps((r) => Math.max(0, r - 5));
                }}
                className="w-10 h-10 rounded-xl bg-[#272a33] hover:bg-[#31353e] flex items-center justify-center text-[#8c90a0] hover:text-white font-mono text-sm"
              >
                -5
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setReps((r) => Math.max(0, r - 1));
                }}
                className="w-10 h-10 rounded-xl bg-[#272a33] hover:bg-[#31353e] flex items-center justify-center text-[#8c90a0] hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setReps((r) => r + 1);
                }}
                className="w-10 h-10 rounded-xl bg-[#558dff] hover:bg-[#407eff] flex items-center justify-center text-white shadow-[0_0_10px_rgba(85,141,255,0.4)]"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setReps((r) => r + 5);
                }}
                className="w-10 h-10 rounded-xl bg-[#272a33] hover:bg-[#31353e] flex items-center justify-center text-[#4edea3] hover:text-white font-mono text-sm font-bold"
              >
                +5
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setReps((r) => r + 25);
                }}
                className="px-2.5 h-10 rounded-xl bg-[#272a33] hover:bg-[#31353e] flex items-center justify-center text-[#4edea3] hover:text-white font-mono text-xs font-bold"
              >
                +25
              </button>
            </div>
          </div>
        )}

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-[#8c90a0] hover:text-white"
          >
            DISCARD
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-[#4edea3] hover:bg-[#3ec48e] text-xs font-mono font-bold text-[#002113] flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(78,222,163,0.4)]"
          >
            <Check className="w-4 h-4" />
            RECORD PROGRESS
          </button>
        </div>
      </div>
    </div>
  );
};
