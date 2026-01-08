
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { dbService, supabase } from './services/db';
import { User } from './types';

// Screens
import Dashboard from './screens/Dashboard';
import JournalEditor from './screens/JournalEditor';
import Calendar from './screens/Calendar';
import Insights from './screens/Insights';
import Profile from './screens/Profile';
import Auth from './screens/Auth';
import Onboarding from './screens/Onboarding';

// Context
interface AppContextType {
  user: User | null;
  loading: boolean;
  theme: 'light' | 'dark';
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  syncUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('serene_theme') as 'light' | 'dark') || 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('serene_theme', newTheme);
  };

  const syncUser = async () => {
    setLoading(true);
    const currentUser = await dbService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  useEffect(() => {
    syncUser();

    // Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          onboarded: true
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AppContext.Provider value={{ user, loading, theme, setUser, setTheme, syncUser }}>
      {children}
    </AppContext.Provider>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useApp();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-pulse text-indigo-400 font-lexend text-xl">SereneDaily...</div>
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/journal/:date" element={<PrivateRoute><JournalEditor /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
          <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
