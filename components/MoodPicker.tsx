
import React from 'react';
import { MoodValue } from '../types';

const moods: { value: MoodValue; emoji: string; label: string }[] = [
  { value: 1, emoji: '😢', label: 'Awful' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Meh' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '🤩', label: 'Great' },
];

interface MoodPickerProps {
  value: MoodValue | null;
  onChange: (value: MoodValue) => void;
}

const MoodPicker: React.FC<MoodPickerProps> = ({ value, onChange }) => {
  return (
    <div className="flex justify-between gap-2">
      {moods.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`flex-1 flex flex-col items-center p-3 rounded-2xl border-2 transition-all active:scale-95 ${
            value === m.value 
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-400 shadow-sm' 
              : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'
          }`}
        >
          <span className="text-3xl mb-1">{m.emoji}</span>
          <span className={`text-[10px] font-medium ${value === m.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>
            {m.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MoodPicker;
