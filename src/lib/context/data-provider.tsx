
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { 
  useDepartments,
  useEmployees,
  useTasks,
  useWorkLogs,
  useAttendance,
  useAdvances,
  useSalaryDeductions,
  useCompanyInfo
} from '@/hooks/use-database';
import { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { setupTables, insertSampleData } from '@/lib/db/setup';

interface DataContextType {
  // Departments
  departments: ReturnType<typeof useDepartments>;
  // Employees
  employees: ReturnType<typeof useEmployees>;
  // Tasks
  tasks: ReturnType<typeof useTasks>;
  // Work Logs
  workLogs: ReturnType<typeof useWorkLogs>;
  // Attendance
  attendance: ReturnType<typeof useAttendance>;
  // Advances
  advances: ReturnType<typeof useAdvances>;
  // Salary Deductions
  salaryDeductions: ReturnType<typeof useSalaryDeductions>;
  // Company Info
  companyInfo: ReturnType<typeof useCompanyInfo>;
  // Loading state
  isLoading: boolean;
  // Database initialization
  initializeDatabase: () => Promise<void>;

  // Adding the correctly typed methods to fix TypeScript errors
  deleteDepartment: (id: string) => void;
  deleteEmployee: (id: string) => void;
  updateTask: (variables: { id: string, data: Partial<Task> }) => void;
  deleteTask: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const departments = useDepartments();
  const employees = useEmployees();
  const tasks = useTasks();
  const workLogs = useWorkLogs();
  const attendance = useAttendance();
  const advances = useAdvances();
  const salaryDeductions = useSalaryDeductions();
  const companyInfo = useCompanyInfo();
  const { toast } = useToast();
  
  // Combined loading state
  const isLoading = 
    departments.isLoading || 
    employees.isLoading || 
    tasks.isLoading || 
    workLogs.isLoading || 
    attendance.isLoading || 
    advances.isLoading || 
    salaryDeductions.isLoading || 
    companyInfo.isLoading;
  
  // Initialize database
  const initializeDatabase = async () => {
    try {
      // Set up database tables
      const tablesResult = await setupTables();
      
      if (tablesResult.some(result => !result.success)) {
        throw new Error("Failed to set up database tables");
      }
      
      // Check if we need to insert sample data
      const { data: deptCount } = await supabase
        .from('departments')
        .select('*', { count: 'exact', head: true });
      
      if (!deptCount || deptCount.length === 0) {
        // Insert sample data if database is empty
        const sampleResult = await insertSampleData();
        
        if (!sampleResult.success) {
          throw new Error("Failed to insert sample data");
        }
      }
      
      // Invalidate queries to fetch fresh data
      departments.departments.refetch();
      employees.employees.refetch();
      tasks.tasks.refetch();
      
      toast({
        title: "Database initialized",
        description: "Database tables and sample data have been set up successfully.",
      });
    } catch (error: any) {
      console.error('Error initializing database:', error);
      toast({
        title: "Database initialization failed",
        description: error.message || "An error occurred while setting up the database.",
        variant: "destructive",
      });
    }
  };
  
  // Initialize database on first load
  useEffect(() => {
    // We'll let users initialize manually from the settings page
  }, []);

  // Import missing from previous providers
  const { supabase } = require('../db/config');

  const value = {
    departments,
    employees,
    tasks,
    workLogs,
    attendance,
    advances,
    salaryDeductions,
    companyInfo,
    isLoading,
    initializeDatabase,
    // Add the missing methods
    deleteDepartment: departments.deleteDepartment,
    deleteEmployee: employees.deleteEmployee,
    updateTask: tasks.updateTask,
    deleteTask: tasks.deleteTask
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
