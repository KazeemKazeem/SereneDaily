
import { JournalEntry, Activity, Task, User, MoodValue } from '../types';

const STORAGE_KEY = 'serene_daily_db_v2';

interface DBStore {
  user: User | null;
  entries: JournalEntry[];
  activities: Activity[];
  tasks: Task[];
}

const getDB = (): DBStore => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { user: null, entries: [], activities: [], tasks: [] };
    return JSON.parse(data);
  } catch (e) {
    console.error("DB Load Error", e);
    return { user: null, entries: [], activities: [], tasks: [] };
  }
};

const saveDB = (db: DBStore) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const dbService = {
  getCurrentUser: async (): Promise<User | null> => {
    return getDB().user;
  },

  login: async (email: string): Promise<User> => {
    const db = getDB();
    const user: User = { id: 'u1', email, onboarded: true };
    db.user = user;
    saveDB(db);
    return user;
  },

  logout: async () => {
    const db = getDB();
    db.user = null;
    saveDB(db);
  },

  getEntries: async (userId: string): Promise<JournalEntry[]> => {
    return getDB().entries.filter(e => e.user_id === userId);
  },

  upsertEntry: async (entry: Partial<JournalEntry> & { user_id: string; date: string }): Promise<JournalEntry> => {
    const db = getDB();
    const existingIndex = db.entries.findIndex(e => e.user_id === entry.user_id && e.date === entry.date);
    
    let updatedEntry: JournalEntry;
    if (existingIndex > -1) {
      updatedEntry = { 
        ...db.entries[existingIndex], 
        ...entry, 
        updated_at: new Date().toISOString() 
      };
      db.entries[existingIndex] = updatedEntry;
    } else {
      updatedEntry = {
        id: crypto.randomUUID(),
        title: entry.title || '',
        content: entry.content || '',
        mood: entry.mood ?? null,
        user_id: entry.user_id,
        date: entry.date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as JournalEntry;
      db.entries.push(updatedEntry);
    }
    saveDB(db);
    return updatedEntry;
  },

  getActivities: async (userId: string, date: string): Promise<Activity[]> => {
    return getDB().activities.filter(a => a.user_id === userId && a.entry_date === date);
  },

  addActivity: async (activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> => {
    const db = getDB();
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    db.activities.push(newActivity);
    saveDB(db);
    return newActivity;
  },

  deleteActivity: async (id: string) => {
    const db = getDB();
    db.activities = db.activities.filter(a => a.id !== id);
    saveDB(db);
  },

  getTasks: async (userId: string, date: string): Promise<Task[]> => {
    return getDB().tasks.filter(t => t.user_id === userId && t.entry_date === date);
  },

  addTask: async (task: Omit<Task, 'id' | 'created_at'>): Promise<Task> => {
    const db = getDB();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    db.tasks.push(newTask);
    saveDB(db);
    return newTask;
  },

  toggleTask: async (id: string): Promise<void> => {
    const db = getDB();
    const taskIndex = db.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      db.tasks[taskIndex].completed = !db.tasks[taskIndex].completed;
      saveDB(db);
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    const db = getDB();
    db.tasks = db.tasks.filter(t => t.id !== id);
    saveDB(db);
  }
};
