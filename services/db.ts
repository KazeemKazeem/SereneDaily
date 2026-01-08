
import { createClient } from '@supabase/supabase-js';
import { JournalEntry, Activity, Task, User, MoodValue } from '../types';

const SUPABASE_URL = 'https://vylgegxwfgztliwnhbtn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bGdlZ3h3Zmd6dGxpd25oYnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTEzMjYsImV4cCI6MjA3NDcyNzMyNn0.yvDcP0pMSHMmYS_2-khO-88TMLQhS5f8WraofMgjyco';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const dbService = {
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email || '',
      onboarded: true // Simplified for now
    };
  },

  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return {
      id: data.user.id,
      email: data.user.email || '',
      onboarded: true
    };
  },

  signUp: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error("Sign up failed");
    return {
      id: data.user.id,
      email: data.user.email || '',
      onboarded: true
    };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getEntries: async (userId: string): Promise<JournalEntry[]> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Supabase Error:", error);
      return [];
    }
    return data || [];
  },

  upsertEntry: async (entry: Partial<JournalEntry> & { user_id: string; date: string }): Promise<JournalEntry> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .upsert({ 
        ...entry,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,date' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getActivities: async (userId: string, date: string): Promise<Activity[]> => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', date);
    
    if (error) return [];
    return data || [];
  },

  addActivity: async (activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> => {
    const { data, error } = await supabase
      .from('activities')
      .insert([activity])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  deleteActivity: async (id: string) => {
    await supabase.from('activities').delete().eq('id', id);
  },

  getTasks: async (userId: string, date: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', date)
      .order('created_at', { ascending: true });
    
    if (error) return [];
    return data || [];
  },

  addTask: async (task: Omit<Task, 'id' | 'created_at'>): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  toggleTask: async (id: string): Promise<void> => {
    // Note: This requires getting current state first or using a RPC/raw JS logic
    // For simplicity, we fetch and update
    const { data: task } = await supabase.from('tasks').select('completed').eq('id', id).single();
    if (task) {
      await supabase.from('tasks').update({ completed: !task.completed }).eq('id', id);
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    await supabase.from('tasks').delete().eq('id', id);
  }
};
