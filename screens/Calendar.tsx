
import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import { dbService } from '../services/db';
import { useApp } from '../App';
import { JournalEntry } from '../types';
import { useNavigate } from 'react-router-dom';

const Calendar: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (user) loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    const data = await dbService.getEntries(user.id);
    setEntries(data);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-2xl font-lexend font-bold text-slate-800 dark:text-slate-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm text-slate-500 active:scale-90 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm text-slate-500 active:scale-90 transition-transform"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const entry = entries.find(e => e.date === dateStr);
          const isSelected = isSameDay(day, new Date());
          const isThisMonth = isSameMonth(day, monthStart);

          return (
            <div
              key={i}
              onClick={() => navigate(`/journal/${dateStr}`)}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all active:scale-90
                ${!isThisMonth ? 'text-slate-200 dark:text-slate-800' : 'text-slate-800 dark:text-slate-200'}
                ${isSelected ? 'bg-indigo-600 text-white shadow-lg' : entry ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800'}
              `}
            >
              <span className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>{format(day, 'd')}</span>
              {entry?.mood && (
                <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-400'}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout title="Calendar">
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        {renderHeader()}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
          {renderDays()}
          {renderCells()}
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">Recent Reflections</h3>
          <div className="space-y-3">
            {entries.slice(-3).reverse().map(e => (
              <div 
                key={e.id}
                onClick={() => navigate(`/journal/${e.date}`)}
                className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase">{format(parseISO(e.date), 'MMM')}</span>
                  <span className="text-lg font-lexend font-bold leading-none">{format(parseISO(e.date), 'dd')}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{e.title || "Untitled Entry"}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">{e.content || "Deep in thought..."}</p>
                </div>
                <div className="text-xl">
                  {e.mood === 5 ? '🤩' : e.mood === 4 ? '😊' : e.mood === 3 ? '😐' : e.mood === 2 ? '😕' : e.mood === 1 ? '😢' : '📝'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
