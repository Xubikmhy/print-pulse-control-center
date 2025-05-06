
// Main data types for the application

export type DepartmentType = 'Printing' | 'Design' | 'Binding' | 'Packaging' | 'Management' | 'Others';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contractual';

export type SalaryType = 'Hourly' | 'Monthly';

export type TaskPriority = 'High' | 'Medium' | 'Low';

export type TaskStatus = 'Completed' | 'In Progress' | 'Pending';

export type LogStatus = 'Finished' | 'Pending';

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;  // Changed from DepartmentType to string to allow custom departments
  position: string;
  phone: string;
  email: string;
  joiningDate: string; // ISO string
  employmentType: EmploymentType;
  salaryType: SalaryType;
  salaryRate: number; // per hour or per month
  isActive: boolean;
}

export interface WorkLog {
  id: string;
  employeeId: string;
  date: string; // ISO string
  startTime: string; // ISO string
  endTime: string | null; // ISO string or null if not ended
  description: string;
  taskId?: string; // Optional link to task
  status: LogStatus;
  hoursWorked: number; // Calculated field
}

export interface Task {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  assignedDate: string; // ISO string
  priority: TaskPriority;
  status: TaskStatus;
}

export interface Advance {
  id: string;
  employeeId: string;
  amount: number;
  date: string; // ISO string
  description: string;
  isPaid: boolean;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string; // ISO string
  checkIn: string; // ISO string
  checkOut: string | null; // ISO string or null if not checked out
  status: 'Present' | 'Absent' | 'Half-day' | 'Late';
  notes: string;
}

export interface SalaryDeduction {
  id: string;
  employeeId: string;
  amount: number;
  date: string; // ISO string
  reason: string;
  advanceId?: string; // Link to advance if deduction is for advance payment
}

export interface CompanyInfo {
  name: string;
  address: string;
  logo: string | null; // URL or null
}

// For summary data on dashboard
export interface DashboardSummary {
  totalEmployees: number;
  activeToday: number;
  totalHoursToday: number;
  tasksCompleted: number;
  tasksPending: number;
  recentActivity: {
    type: 'task' | 'log' | 'employee' | 'advance';
    message: string;
    timestamp: string;
  }[];
}
