
import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useApp } from '@/lib/context/app-context';
import { format } from 'date-fns';

interface TopBarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar, sidebarOpen }) => {
  const { companyInfo } = useApp();
  const currentDate = format(new Date(), 'EEEE, MMM d');
  
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-app-gray-900 shadow-apple-sm border-b border-app-gray-200 dark:border-app-gray-800">
      <div className="px-3 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-3 text-app-gray-500 hover:text-app-gray-700 dark:text-app-gray-400 dark:hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-app-gray-800 dark:text-white truncate">
              PrintPulse Control
            </h1>
            <p className="text-xs md:text-sm text-app-gray-600 dark:text-app-gray-400 hidden xs:block">
              {currentDate}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-app-gray-100 dark:hover:bg-app-gray-800">
            <Bell className="h-5 w-5 text-app-gray-600 dark:text-app-gray-400" />
          </button>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-app-blue flex items-center justify-center text-white">
              {companyInfo.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
