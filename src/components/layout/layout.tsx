
import React from 'react';
import Sidebar from './sidebar';
import TopBar from './top-bar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="flex min-h-screen bg-app-gray-50 dark:bg-app-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 w-full">
        <TopBar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
