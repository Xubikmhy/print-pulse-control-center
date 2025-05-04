
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/lib/context/app-context';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  DollarSign,
  BarChart,
  Settings,
  X,
  Moon,
  Sun
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const { companyInfo, theme, toggleTheme } = useApp();
  
  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Employees', 
      path: '/employees', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Daily Logs', 
      path: '/logs', 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      name: 'Tasks', 
      path: '/tasks', 
      icon: <CheckSquare className="h-5 w-5" /> 
    },
    { 
      name: 'Salary', 
      path: '/salary', 
      icon: <DollarSign className="h-5 w-5" /> 
    },
    { 
      name: 'Reports', 
      path: '/reports', 
      icon: <BarChart className="h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];
  
  const isPathActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col shadow-apple-lg transition-all duration-300 bg-white dark:bg-app-gray-900 border-r border-app-gray-200 dark:border-app-gray-800",
        open ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0 lg:w-16"
      )}
    >
      {/* Close button for mobile */}
      <button 
        className="lg:hidden absolute right-3 top-3 text-app-gray-500 hover:text-app-gray-700 dark:text-app-gray-400 dark:hover:text-white"
        onClick={() => setOpen(false)}
      >
        <X className="h-5 w-5" />
      </button>
      
      {/* Company logo/name */}
      <div className="p-4 flex items-center justify-center lg:justify-start">
        {companyInfo.logo ? (
          <img 
            src={companyInfo.logo} 
            alt={companyInfo.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-app-blue flex items-center justify-center text-white font-bold text-xl">
            {companyInfo.name.charAt(0)}
          </div>
        )}
        
        {open && (
          <h1 className="ml-3 font-semibold text-app-gray-800 dark:text-white truncate">
            {companyInfo.name}
          </h1>
        )}
      </div>
      
      {/* Menu items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = isPathActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-3 rounded-lg transition-all",
                isActive 
                  ? "bg-app-blue text-white" 
                  : "text-app-gray-700 dark:text-app-gray-300 hover:bg-app-gray-100 dark:hover:bg-app-gray-800"
              )}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setOpen(false);
                }
              }}
            >
              <div className="flex items-center justify-center">
                {item.icon}
              </div>
              
              {open && (
                <span className="ml-3 font-medium">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Bottom section with theme toggle */}
      <div className="p-4 flex items-center justify-center">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-app-gray-100 dark:hover:bg-app-gray-800 transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-app-gray-700 dark:text-app-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-app-gray-700 dark:text-app-gray-300" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
