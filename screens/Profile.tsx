
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  LogOut, 
  Shield, 
  Moon, 
  Download, 
  Mail, 
  ChevronRight,
  Heart
} from 'lucide-react';
import Layout from '../components/Layout';
import { useApp } from '../App';
import { dbService } from '../services/db';

const Profile: React.FC = () => {
  const { user, setUser, theme, setTheme } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dbService.logout();
    setUser(null);
    navigate('/auth');
  };

  const exportData = () => {
    alert("Exporting journal entries to PDF...");
  };

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Layout title="Profile">
      <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
        
        {/* User Card */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 transition-colors duration-300">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl font-lexend font-bold border-4 border-indigo-50 dark:border-indigo-900/50">
            {user?.email[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-lexend font-bold text-slate-800 dark:text-slate-100">Hi, There!</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{user?.email}</p>
          </div>
        </section>

        {/* Settings Groups */}
        <div className="space-y-6">
          <section>
            <h3 className="text-xs font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] mb-4 px-2">Account Settings</h3>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-50 dark:divide-slate-800 overflow-hidden transition-colors duration-300">
              <SettingItem 
                icon={<Moon size={20} className="text-indigo-400" />} 
                label="Dark Mode" 
                toggle 
                active={theme === 'dark'}
                onToggle={toggleDarkMode}
              />
              <SettingItem icon={<Shield size={20} className="text-emerald-400" />} label="Privacy & Security" />
              <SettingItem icon={<Mail size={20} className="text-amber-400" />} label="Notifications" />
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] mb-4 px-2">Data Management</h3>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-50 dark:divide-slate-800 overflow-hidden transition-colors duration-300">
              <button onClick={exportData} className="w-full text-left">
                <SettingItem icon={<Download size={20} className="text-blue-400" />} label="Export Journal (PDF)" />
              </button>
              <SettingItem icon={<Settings size={20} className="text-slate-400 dark:text-slate-500" />} label="General Settings" />
            </div>
          </section>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 py-4 rounded-[24px] font-bold text-sm active:scale-95 transition-transform"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center pt-4 pb-8">
          <p className="text-[10px] text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
            Made with <Heart size={10} className="text-red-400 fill-red-400" /> for your wellness
          </p>
          <p className="text-[10px] text-slate-200 dark:text-slate-800 mt-1">v1.0.5 • SereneDaily</p>
        </div>
      </div>
    </Layout>
  );
};

const SettingItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  toggle?: boolean;
  active?: boolean;
  onToggle?: () => void;
}> = ({ icon, label, toggle, active, onToggle }) => (
  <div 
    onClick={toggle ? onToggle : undefined}
    className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
  >
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
    </div>
    {toggle ? (
      <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${active ? 'left-5' : 'left-1'}`} />
      </div>
    ) : (
      <ChevronRight size={18} className="text-slate-300 dark:text-slate-700" />
    )}
  </div>
);

export default Profile;
