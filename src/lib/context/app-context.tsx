"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  CompanyInfo, Employee, Task, WorkLog, Advance, 
  DashboardSummary, Attendance, SalaryDeduction, Department 
} from '../types';
import { generateId, isToday } from '../utils';
import { mockEmployees, mockTasks, mockLogs, mockAdvances, mockCompanyInfo } from '../mock-data';

// Define the context shape
interface AppContextType {
  // Data
  employees: Employee[];
  tasks: Task[];
  logs: WorkLog[];
  advances: Advance[];
  attendance: Attendance[];
  deductions: SalaryDeduction[];
  departments: Department[];
  companyInfo: CompanyInfo;
  dashboardSummary: DashboardSummary;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // CRUD operations
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addLog: (log: Omit<WorkLog, 'id'>) => void;
  updateLog: (id: string, log: Partial<WorkLog>) => void;
  deleteLog: (id: string) => void;
  
  addAdvance: (advance: Omit<Advance, 'id'>) => void;
  updateAdvance: (id: string, advance: Partial<Advance>) => void;
  deleteAdvance: (id: string) => void;
  
  // New functions for attendance and deductions
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  updateAttendance: (id: string, attendance: Partial<Attendance>) => void;
  deleteAttendance: (id: string) => void;
  
  addDeduction: (deduction: Omit<SalaryDeduction, 'id'>) => void;
  updateDeduction: (id: string, deduction: Partial<SalaryDeduction>) => void;
  deleteDeduction: (id: string) => void;
  
  // Department operations
  addDepartment: (name: string, description: string) => void;
  updateDepartment: (id: string, name: string, description: string) => void;
  deleteDepartment: (id: string) => void;
  
  // Calculate remaining salary after deductions
  calculateRemainingBalance: (employeeId: string, month: number, year: number) => number;
  
  // Export/Import
  exportData: () => string;
  importData: (jsonData: string) => void;
  resetData: () => void;
  
  // Company information update
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial empty state
const initialState = {
  employees: [] as Employee[],
  tasks: [] as Task[],
  logs: [] as WorkLog[],
  advances: [] as Advance[],
  attendance: [] as Attendance[],
  deductions: [] as SalaryDeduction[],
  departments: [] as Department[],
  companyInfo: {
    name: 'My Printing Press',
    address: '123 Print Street, Inkville',
    logo: null
  } as CompanyInfo
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Data states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [deductions, setDeductions] = useState<SalaryDeduction[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialState.companyInfo);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
    else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    const savedData = localStorage.getItem('printPulseData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setEmployees(parsedData.employees || []);
      setTasks(parsedData.tasks || []);
      setLogs(parsedData.logs || []);
      setAdvances(parsedData.advances || []);
      setAttendance(parsedData.attendance || []);
      setDeductions(parsedData.deductions || []);
      setDepartments(parsedData.departments || []);
      setCompanyInfo(parsedData.companyInfo || initialState.companyInfo);
    } else {
      // Use mock data for first-time users
      const defaultDepartments = [
        { id: generateId(), name: 'Printing', description: 'Main printing operations' },
        { id: generateId(), name: 'Design', description: 'Graphic design team' },
        { id: generateId(), name: 'Binding', description: 'Book and document binding' },
        { id: generateId(), name: 'Packaging', description: 'Product packaging' },
        { id: generateId(), name: 'Management', description: 'Administration and management' },
        { id: generateId(), name: 'Others', description: 'Miscellaneous departments' }
      ];
      
      setEmployees(mockEmployees);
      setTasks(mockTasks);
      setLogs(mockLogs);
      setAdvances(mockAdvances);
      setAttendance([]);
      setDeductions([]);
      setDepartments(defaultDepartments);
      setCompanyInfo(mockCompanyInfo);
      
      // Save mock data to localStorage
      saveToLocalStorage({
        employees: mockEmployees,
        tasks: mockTasks,
        logs: mockLogs,
        advances: mockAdvances,
        attendance: [],
        deductions: [],
        departments: defaultDepartments,
        companyInfo: mockCompanyInfo
      });
    }
  }, []);
  
  // Apply theme class to document
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Save data to localStorage whenever it changes
  const saveToLocalStorage = (data: Partial<typeof initialState>) => {
    const savedData = localStorage.getItem('printPulseData');
    const existingData = savedData ? JSON.parse(savedData) : {};
    
    localStorage.setItem('printPulseData', JSON.stringify({
      ...existingData,
      ...data
    }));
  };

  // Calculate dashboard summary data
  const calculateDashboardSummary = (): DashboardSummary => {
    // Count active employees today
    const activeToday = logs.filter(log => 
      isToday(log.date) && !log.endTime
    ).length;
    
    // Calculate total hours today
    const totalHoursToday = logs
      .filter(log => isToday(log.date))
      .reduce((sum, log) => sum + (log.hoursWorked || 0), 0);
      
    // Count completed vs pending tasks
    const tasksCompleted = tasks.filter(task => task.status === 'Completed').length;
    const tasksPending = tasks.filter(task => task.status !== 'Completed').length;
    
    // Recent activity (last 5 events)
    const recentActivity = [
      ...tasks.map(task => ({
        type: 'task' as const,
        message: `Task "${task.title}" was ${task.status.toLowerCase()}`,
        timestamp: task.assignedDate,
        sortDate: new Date(task.assignedDate)
      })),
      ...logs.map(log => ({
        type: 'log' as const,
        message: `${employees.find(e => e.id === log.employeeId)?.name || 'Employee'} ${log.endTime ? 'completed' : 'started'} work`,
        timestamp: log.endTime || log.startTime,
        sortDate: new Date(log.endTime || log.startTime)
      })),
      ...advances.map(adv => ({
        type: 'advance' as const,
        message: `Advance of ${adv.amount} given to ${employees.find(e => e.id === adv.employeeId)?.name || 'Employee'}`,
        timestamp: adv.date,
        sortDate: new Date(adv.date)
      })),
      ...attendance.map(att => ({
        type: 'log' as const,
        message: `${employees.find(e => e.id === att.employeeId)?.name || 'Employee'} marked as ${att.status}`,
        timestamp: att.date,
        sortDate: new Date(att.date)
      })),
      ...deductions.map(ded => ({
        type: 'advance' as const,
        message: `Deduction of ${ded.amount} applied to ${employees.find(e => e.id === ded.employeeId)?.name || 'Employee'}`,
        timestamp: ded.date,
        sortDate: new Date(ded.date)
      }))
    ].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
    .slice(0, 5);
    
    return {
      totalEmployees: employees.filter(e => e.isActive).length,
      activeToday,
      totalHoursToday,
      tasksCompleted,
      tasksPending,
      recentActivity
    };
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  // CRUD operations for employees, tasks, logs, advances, attendance and deductions
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = { ...employee, id: generateId() };
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    saveToLocalStorage({ employees: updatedEmployees });
  };
  
  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    const updatedEmployees = employees.map(employee => 
      employee.id === id ? { ...employee, ...employeeData } : employee
    );
    setEmployees(updatedEmployees);
    saveToLocalStorage({ employees: updatedEmployees });
  };
  
  const deleteEmployee = (id: string) => {
    // Soft delete - just mark as inactive
    const updatedEmployees = employees.map(employee => 
      employee.id === id ? { ...employee, isActive: false } : employee
    );
    setEmployees(updatedEmployees);
    saveToLocalStorage({ employees: updatedEmployees });
  };
  
  // CRUD operations for tasks
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: generateId() };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveToLocalStorage({ tasks: updatedTasks });
  };
  
  const updateTask = (id: string, taskData: Partial<Task>) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, ...taskData } : task
    );
    setTasks(updatedTasks);
    saveToLocalStorage({ tasks: updatedTasks });
  };
  
  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveToLocalStorage({ tasks: updatedTasks });
  };
  
  // CRUD operations for logs
  const addLog = (log: Omit<WorkLog, 'id'>) => {
    const newLog = { ...log, id: generateId() };
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    saveToLocalStorage({ logs: updatedLogs });
  };
  
  const updateLog = (id: string, logData: Partial<WorkLog>) => {
    const updatedLogs = logs.map(log => 
      log.id === id ? { ...log, ...logData } : log
    );
    setLogs(updatedLogs);
    saveToLocalStorage({ logs: updatedLogs });
  };
  
  const deleteLog = (id: string) => {
    const updatedLogs = logs.filter(log => log.id !== id);
    setLogs(updatedLogs);
    saveToLocalStorage({ logs: updatedLogs });
  };
  
  // CRUD operations for advances
  const addAdvance = (advance: Omit<Advance, 'id'>) => {
    const newAdvance = { ...advance, id: generateId() };
    const updatedAdvances = [...advances, newAdvance];
    setAdvances(updatedAdvances);
    saveToLocalStorage({ advances: updatedAdvances });
  };
  
  const updateAdvance = (id: string, advanceData: Partial<Advance>) => {
    const updatedAdvances = advances.map(advance => 
      advance.id === id ? { ...advance, ...advanceData } : advance
    );
    setAdvances(updatedAdvances);
    saveToLocalStorage({ advances: updatedAdvances });
  };
  
  const deleteAdvance = (id: string) => {
    const updatedAdvances = advances.filter(advance => advance.id !== id);
    setAdvances(updatedAdvances);
    saveToLocalStorage({ advances: updatedAdvances });
  };
  
  // CRUD operations for attendance
  const addAttendance = (attendanceData: Omit<Attendance, 'id'>) => {
    const newAttendance = { ...attendanceData, id: generateId() };
    const updatedAttendance = [...attendance, newAttendance];
    setAttendance(updatedAttendance);
    saveToLocalStorage({ attendance: updatedAttendance });
  };
  
  const updateAttendance = (id: string, attendanceData: Partial<Attendance>) => {
    const updatedAttendance = attendance.map(att => 
      att.id === id ? { ...att, ...attendanceData } : att
    );
    setAttendance(updatedAttendance);
    saveToLocalStorage({ attendance: updatedAttendance });
  };
  
  const deleteAttendance = (id: string) => {
    const updatedAttendance = attendance.filter(att => att.id !== id);
    setAttendance(updatedAttendance);
    saveToLocalStorage({ attendance: updatedAttendance });
  };
  
  // CRUD operations for salary deductions
  const addDeduction = (deduction: Omit<SalaryDeduction, 'id'>) => {
    const newDeduction = { ...deduction, id: generateId() };
    const updatedDeductions = [...deductions, newDeduction];
    setDeductions(updatedDeductions);
    saveToLocalStorage({ deductions: updatedDeductions });
  };
  
  const updateDeduction = (id: string, deductionData: Partial<SalaryDeduction>) => {
    const updatedDeductions = deductions.map(deduction => 
      deduction.id === id ? { ...deduction, ...deductionData } : deduction
    );
    setDeductions(updatedDeductions);
    saveToLocalStorage({ deductions: updatedDeductions });
  };
  
  const deleteDeduction = (id: string) => {
    const updatedDeductions = deductions.filter(deduction => deduction.id !== id);
    setDeductions(updatedDeductions);
    saveToLocalStorage({ deductions: updatedDeductions });
  };
  
  // Department operations
  const addDepartment = (name: string, description: string) => {
    const newDepartment = { 
      id: generateId(),
      name,
      description
    };
    const updatedDepartments = [...departments, newDepartment];
    setDepartments(updatedDepartments);
    saveToLocalStorage({ departments: updatedDepartments });
  };
  
  const updateDepartment = (id: string, name: string, description: string) => {
    const updatedDepartments = departments.map(dept => 
      dept.id === id ? { ...dept, name, description } : dept
    );
    setDepartments(updatedDepartments);
    saveToLocalStorage({ departments: updatedDepartments });
  };
  
  const deleteDepartment = (id: string) => {
    // Check if department is in use by any employees
    const isDepartmentInUse = employees.some(emp => 
      emp.department === departments.find(d => d.id === id)?.name
    );
    
    if (isDepartmentInUse) {
      throw new Error('Cannot delete department that is in use by employees');
    }
    
    const updatedDepartments = departments.filter(dept => dept.id !== id);
    setDepartments(updatedDepartments);
    saveToLocalStorage({ departments: updatedDepartments });
  };
  
  // Calculate remaining salary after deductions
  const calculateRemainingBalance = (employeeId: string, month: number, year: number) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return 0;
    
    // Base salary calculation
    let baseSalary = 0;
    if (employee.salaryType === 'Monthly') {
      baseSalary = employee.salaryRate;
    } else {
      // For hourly employees, calculate based on hours worked in the month
      const monthLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        return log.employeeId === employeeId && 
               logDate.getMonth() === month && 
               logDate.getFullYear() === year;
      });
      
      const totalHours = monthLogs.reduce((sum, log) => sum + (log.hoursWorked || 0), 0);
      baseSalary = totalHours * employee.salaryRate;
    }
    
    // Calculate advances that are not paid yet
    const monthAdvances = advances.filter(adv => {
      const advDate = new Date(adv.date);
      return adv.employeeId === employeeId && 
             !adv.isPaid &&
             advDate.getMonth() <= month && 
             advDate.getFullYear() <= year;
    });
    
    const totalAdvances = monthAdvances.reduce((sum, adv) => sum + adv.amount, 0);
    
    // Calculate other deductions for the month
    const monthDeductions = deductions.filter(ded => {
      const dedDate = new Date(ded.date);
      return ded.employeeId === employeeId && 
             dedDate.getMonth() === month && 
             dedDate.getFullYear() === year;
    });
    
    const totalDeductions = monthDeductions.reduce((sum, ded) => sum + ded.amount, 0);
    
    return baseSalary - totalAdvances - totalDeductions;
  };
  
  // Update company info
  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    const updatedInfo = { ...companyInfo, ...info };
    setCompanyInfo(updatedInfo);
    saveToLocalStorage({ companyInfo: updatedInfo });
  };
  
  // Export data
  const exportData = () => {
    return JSON.stringify({
      employees,
      tasks,
      logs,
      advances,
      attendance,
      deductions,
      departments,
      companyInfo
    });
  };
  
  // Import data
  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.employees) setEmployees(data.employees);
      if (data.tasks) setTasks(data.tasks);
      if (data.logs) setLogs(data.logs);
      if (data.advances) setAdvances(data.advances);
      if (data.attendance) setAttendance(data.attendance);
      if (data.deductions) setDeductions(data.deductions);
      if (data.departments) setDepartments(data.departments);
      if (data.companyInfo) setCompanyInfo(data.companyInfo);
      
      saveToLocalStorage(data);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Invalid data format');
    }
  };
  
  // Reset data
  const resetData = () => {
    setEmployees([]);
    setTasks([]);
    setLogs([]);
    setAdvances([]);
    setAttendance([]);
    setDeductions([]);
    setDepartments([]);
    setCompanyInfo(initialState.companyInfo);
    
    saveToLocalStorage({
      employees: [],
      tasks: [],
      logs: [],
      advances: [],
      attendance: [],
      deductions: [],
      departments: [],
      companyInfo: initialState.companyInfo
    });
  };

  const value = {
    employees,
    tasks,
    logs,
    advances,
    attendance,
    deductions,
    departments,
    companyInfo,
    dashboardSummary: calculateDashboardSummary(),
    
    theme,
    toggleTheme,
    
    addEmployee,
    updateEmployee,
    deleteEmployee,
    
    addTask,
    updateTask,
    deleteTask,
    
    addLog,
    updateLog,
    deleteLog,
    
    addAdvance,
    updateAdvance,
    deleteAdvance,
    
    addAttendance,
    updateAttendance,
    deleteAttendance,
    
    addDeduction,
    updateDeduction,
    deleteDeduction,
    
    addDepartment,
    updateDepartment,
    deleteDepartment,
    
    updateCompanyInfo,
    calculateRemainingBalance,
    
    exportData,
    importData,
    resetData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
