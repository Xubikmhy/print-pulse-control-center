
import React from 'react';
import { useApp } from '@/lib/context/app-context';
import { formatDate, timeAgo } from '@/lib/utils';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  ListPlus,
  UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DashboardCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}> = ({ title, value, icon, color, trend }) => {
  return (
    <div className="bg-white dark:bg-app-gray-800 rounded-xl shadow-apple-sm p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-app-gray-600 dark:text-app-gray-400 text-sm font-medium">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-app-gray-900 dark:text-white mt-1">
            {value}
          </h3>
          
          {trend !== undefined && (
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className={`h-3.5 w-3.5 ${trend >= 0 ? 'text-app-green' : 'text-app-red'} mr-1`} />
              <span className={trend >= 0 ? 'text-app-green' : 'text-app-red'}>
                {Math.abs(trend)}% {trend >= 0 ? 'increase' : 'decrease'}
              </span>
              <span className="text-app-gray-500 dark:text-app-gray-400 ml-1">vs last week</span>
            </div>
          )}
        </div>
        
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{
  message: string;
  time: string;
  type: 'task' | 'log' | 'employee' | 'advance';
}> = ({ message, time, type }) => {
  let color = '';
  
  switch (type) {
    case 'task':
      color = 'border-app-blue';
      break;
    case 'log':
      color = 'border-app-green';
      break;
    case 'employee':
      color = 'border-app-purple';
      break;
    case 'advance':
      color = 'border-app-orange';
      break;
  }
  
  return (
    <div className={`border-l-2 ${color} pl-3 py-2`}>
      <p className="text-app-gray-800 dark:text-app-gray-200">{message}</p>
      <p className="text-app-gray-500 dark:text-app-gray-400 text-xs">
        {timeAgo(time)}
      </p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { dashboardSummary, employees, tasks } = useApp();
  
  // Get the three nearest deadlines
  const upcomingTasks = [...tasks]
    .filter(task => task.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-app-gray-900 dark:text-white">
          Dashboard
        </h1>
        
        <div className="flex gap-2">
          <Button
            asChild
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-app-blue text-white hover:bg-opacity-90 transition-colors text-sm flex-1 sm:flex-auto"
          >
            <Link to="/employees/new">
              <UserPlus className="h-4 w-4" />
              <span>New Employee</span>
            </Link>
          </Button>
          <Button
            asChild
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-app-green text-white hover:bg-opacity-90 transition-colors text-sm flex-1 sm:flex-auto"
          >
            <Link to="/tasks/new">
              <ListPlus className="h-4 w-4" />
              <span>New Task</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DashboardCard 
          title="Total Employees" 
          value={dashboardSummary.totalEmployees} 
          icon={<Users className="h-5 w-5 text-white" />} 
          color="bg-app-blue"
          trend={5}
        />
        <DashboardCard 
          title="Active Today" 
          value={dashboardSummary.activeToday} 
          icon={<Clock className="h-5 w-5 text-white" />} 
          color="bg-app-green"
        />
        <DashboardCard 
          title="Tasks Completed" 
          value={dashboardSummary.tasksCompleted} 
          icon={<CheckCircle className="h-5 w-5 text-white" />} 
          color="bg-app-orange"
          trend={12}
        />
        <DashboardCard 
          title="Tasks Pending" 
          value={dashboardSummary.tasksPending} 
          icon={<AlertCircle className="h-5 w-5 text-white" />} 
          color="bg-app-red"
          trend={-8}
        />
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming deadlines */}
        <div className="bg-white dark:bg-app-gray-800 rounded-xl shadow-apple-sm p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-app-gray-900 dark:text-white">
              Upcoming Deadlines
            </h2>
            <Link 
              to="/tasks" 
              className="text-app-blue dark:text-app-blue hover:underline text-sm flex items-center"
            >
              View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => {
                const employee = employees.find(e => e.id === task.employeeId);
                
                return (
                  <div 
                    key={task.id} 
                    className="border border-app-gray-200 dark:border-app-gray-700 rounded-lg p-3 hover:bg-app-gray-50 dark:hover:bg-app-gray-800 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-app-gray-900 dark:text-white">
                          {task.title}
                        </h3>
                        <p className="text-sm text-app-gray-500 dark:text-app-gray-400">
                          Assigned to: {employee?.name || 'Unassigned'}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-app-orange bg-opacity-20 text-app-orange">
                          Due: {formatDate(task.dueDate)}
                        </div>
                        <p className="text-sm text-app-gray-500 dark:text-app-gray-400 mt-1">
                          {task.status}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-app-gray-500 dark:text-app-gray-400 text-center py-4">
                No upcoming tasks
              </p>
            )}
          </div>
        </div>
        
        {/* Recent activity */}
        <div className="bg-white dark:bg-app-gray-800 rounded-xl shadow-apple-sm p-4">
          <h2 className="text-lg font-semibold text-app-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          
          <div className="space-y-2">
            {dashboardSummary.recentActivity.map((activity, index) => (
              <ActivityItem
                key={index}
                message={activity.message}
                time={activity.timestamp}
                type={activity.type}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Summary chart */}
      <div className="bg-white dark:bg-app-gray-800 rounded-xl shadow-apple-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-app-gray-900 dark:text-white">
            Hours Worked This Week
          </h2>
          <Link 
            to="/reports" 
            className="text-app-blue dark:text-app-blue hover:underline text-sm flex items-center"
          >
            Detailed Reports <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
        
        <div className="h-48 sm:h-60 flex items-center justify-center">
          <p className="text-app-gray-500 dark:text-app-gray-400">
            Chart will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
