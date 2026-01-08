
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import Layout from '../components/Layout';
import { dbService } from '../services/db';
import { useApp } from '../App';
import { JournalEntry } from '../types';

const Insights: React.FC = () => {
  const { user, theme } = useApp();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  
  const isDark = theme === 'dark';

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const allEntries = await dbService.getEntries(user.id);
    setEntries(allEntries);
  };

  const getMoodChartData = () => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    return last7Days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateStr);
      return {
        name: format(day, 'EEE'),
        mood: entry?.mood || 0
      };
    });
  };

  const getCategoryData = () => {
    return [
      { name: 'Work', count: 12, color: '#6366f1' },
      { name: 'Health', count: 19, color: '#10b981' },
      { name: 'Hobby', count: 8, color: '#f59e0b' },
      { name: 'Social', count: 15, color: '#ec4899' },
    ];
  };

  const moodData = getMoodChartData();
  const categoryData = getCategoryData();

  return (
    <Layout title="Insights">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Weekly Mood Trend */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">Weekly Mood Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDark ? '#475569' : '#94a3b8', fontSize: 10 }} 
                />
                <YAxis 
                  domain={[0, 5]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDark ? '#475569' : '#94a3b8', fontSize: 10 }}
                  ticks={[1, 2, 3, 4, 5]}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#f1f5f9' : '#1e293b'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Activity Distribution */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">Activity Frequency</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: isDark ? '#475569' : '#94a3b8', fontSize: 10 }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#f1f5f9' : '#1e293b'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 8, 8]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-[32px] border border-emerald-100 dark:border-emerald-900/50">
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Consistency</p>
            <h4 className="text-3xl font-lexend font-bold text-emerald-900 dark:text-emerald-100">85%</h4>
            <p className="text-[10px] text-emerald-600/60 dark:text-emerald-400/60 mt-2">Active days this month</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-[32px] border border-indigo-100 dark:border-indigo-900/50">
            <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">Completed</p>
            <h4 className="text-3xl font-lexend font-bold text-indigo-900 dark:text-indigo-100">42</h4>
            <p className="text-[10px] text-indigo-600/60 dark:text-indigo-400/60 mt-2">Tasks finished this week</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Insights;
