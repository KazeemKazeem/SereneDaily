
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MoodPicker from '../components/MoodPicker';
import { useApp } from '../App';
import { dbService } from '../services/db';
import { JournalEntry, Task, Activity, MoodValue } from '../types';
import { CheckCircle2, Circle, Clock, ChevronRight, Plus, Trash2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (user) {
      loadDayData();
    }
  }, [user]);

  const loadDayData = async () => {
    if (!user) return;
    const entry = await dbService.upsertEntry({ user_id: user.id, date: today });
    const dayTasks = await dbService.getTasks(user.id, today);
    const dayActs = await dbService.getActivities(user.id, today);
    setTodayEntry(entry);
    setTasks(dayTasks);
    setActivities(dayActs);
  };

  const handleMoodChange = async (mood: MoodValue) => {
    if (!user) return;
    const updated = await dbService.upsertEntry({ user_id: user.id, date: today, mood });
    setTodayEntry(updated);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTaskTitle.trim()) return;
    await dbService.addTask({
      user_id: user.id,
      entry_date: today,
      title: newTaskTitle,
      completed: false,
      priority: 'Medium'
    });
    setNewTaskTitle('');
    loadDayData();
  };

  const toggleTask = async (id: string) => {
    await dbService.toggleTask(id);
    loadDayData();
  };

  const deleteTask = async (id: string) => {
    await dbService.deleteTask(id);
    loadDayData();
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Date Display */}
        <section>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{format(new Date(), 'EEEE, MMMM do')}</p>
          <h2 className="text-3xl font-lexend font-bold text-slate-900 dark:text-slate-100">How's your day?</h2>
        </section>

        {/* Mood Selector */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Your Mood</h3>
          <MoodPicker value={todayEntry?.mood || null} onChange={handleMoodChange} />
        </section>

        {/* Journal Preview */}
        <section 
          onClick={() => navigate(`/journal/${today}`)}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-lexend font-semibold text-slate-800 dark:text-slate-100">Daily Journal</h3>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed italic">
            {todayEntry?.content || "No entry yet. How are you feeling today?"}
          </p>
        </section>

        {/* Task List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tasks</h3>
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </span>
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a daily focus..."
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-sm active:scale-95 transition-transform">
              <Plus size={20} />
            </button>
          </form>

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-center py-4 text-slate-400 text-sm italic">Add some goals for today.</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="group flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                    {task.completed ? (
                      <CheckCircle2 size={22} className="text-emerald-500" />
                    ) : (
                      <Circle size={22} className="text-slate-300 dark:text-slate-700" />
                    )}
                    <span className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200 font-medium'}`}>
                      {task.title}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-300 dark:text-slate-700 hover:text-red-400 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Activities Timeline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Today's Timeline</h3>
            <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">VIEW ALL</button>
          </div>
          
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="bg-slate-100/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl py-8 text-center">
                <p className="text-slate-400 text-sm">No activities logged today.</p>
              </div>
            ) : (
              activities.map(act => (
                <div key={act.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                    <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-1" />
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-slate-800 dark:text-slate-100 text-sm">{act.name}</h4>
                      <span className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700 uppercase tracking-tighter">
                        {act.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                      <Clock size={12} />
                      <span>{act.start_time} - {act.end_time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
