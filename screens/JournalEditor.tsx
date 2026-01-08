
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { dbService } from '../services/db';
import { useApp } from '../App';
import { JournalEntry, MoodValue } from '../types';
import MoodPicker from '../components/MoodPicker';

const JournalEditor: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { user } = useApp();
  
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  const displayDate = date ? format(parseISO(date), 'MMMM do, yyyy') : '';

  useEffect(() => {
    if (user && date) {
      loadEntry();
    }
  }, [user, date]);

  const loadEntry = async () => {
    if (!user || !date) return;
    const data = await dbService.upsertEntry({ user_id: user.id, date });
    setEntry(data);
    setTitle(data.title || '');
    setContent(data.content || '');
    isFirstLoad.current = false;
  };

  // Improved autosave using useEffect with a debounce timer
  useEffect(() => {
    if (isFirstLoad.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      if (!user || !date) return;
      try {
        const updated = await dbService.upsertEntry({
          user_id: user.id,
          date,
          title: title,
          content: content
        });
        setEntry(updated);
      } catch (e) {
        console.error("Save failed", e);
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [title, content, user, date]);

  const updateMood = async (mood: MoodValue) => {
    if (!user || !date) return;
    const updated = await dbService.upsertEntry({ user_id: user.id, date, mood });
    setEntry(updated);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto relative flex flex-col border-x border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in duration-500">
      <header className="px-6 py-5 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">Journal Entry</p>
          <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{displayDate}</h1>
        </div>
        <div className="w-10 flex justify-end">
          {saving ? <Loader2 size={18} className="animate-spin text-indigo-400" /> : <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />}
        </div>
      </header>

      <div className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar pb-32">
        <section className="mb-8">
           <MoodPicker value={entry?.mood || null} onChange={updateMood} />
        </section>

        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title for today..."
          className="text-2xl font-lexend font-bold bg-transparent border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 text-slate-800 dark:text-slate-100 w-full mb-4 outline-none"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your thoughts..."
          className="flex-1 bg-transparent border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed text-lg resize-none w-full outline-none min-h-[300px]"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-medium">
          <Sparkles size={14} className="text-indigo-400" />
          <span>{wordCount} words</span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-2xl text-sm font-semibold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default JournalEditor;
