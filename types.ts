
export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  email: string;
  onboarded: boolean;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: MoodValue | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  entry_date: string;
  name: string;
  category: 'Work' | 'Health' | 'Social' | 'Hobby' | 'Other';
  start_time: string;
  end_time: string;
  note: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  entry_date: string;
  title: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  created_at: string;
}

export interface AppState {
  user: User | null;
  entries: JournalEntry[];
  activities: Activity[];
  tasks: Task[];
  loading: boolean;
  theme: 'light' | 'dark';
}
