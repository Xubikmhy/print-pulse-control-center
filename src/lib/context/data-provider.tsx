
import React, { createContext, useContext, ReactNode } from 'react';
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

  // Adding the missing methods to fix TypeScript errors
  deleteDepartment: (id: string) => void;
  deleteEmployee: (id: string) => void;
  updateTask: (id: string, data: Partial<any>) => void;
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
