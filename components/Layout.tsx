
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  BarChart2, 
  User as UserIcon,
  Plus
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode; title?: string; showPlus?: boolean; onPlusClick?: () => void }> = ({ 
  children, 
  title, 
  showPlus, 
  onPlusClick 
}) => {
  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-slate-50 dark:bg-slate-950 relative border-x border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-lexend font-bold text-slate-800 dark:text-slate-100">
          {title || "SereneDaily"}
        </h1>
        {showPlus && (
          <button 
            onClick={onPlusClick}
            className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <Plus size={24} />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex items-center justify-between z-50">
        <NavButton to="/" icon={<LayoutDashboard size={24} />} label="Home" />
        <NavButton to="/calendar" icon={<CalendarIcon size={24} />} label="Calendar" />
        <NavButton to="/insights" icon={<BarChart2 size={24} />} label="Insights" />
        <NavButton to="/profile" icon={<UserIcon size={24} />} label="Profile" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`
    }
  >
    {icon}
    <span className="text-[10px] uppercase tracking-wider">{label}</span>
  </NavLink>
);

export default Layout;
