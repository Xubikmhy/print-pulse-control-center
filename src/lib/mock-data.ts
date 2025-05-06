
import { Employee, Task, WorkLog, Advance, CompanyInfo, Department } from './types';
import { generateId } from './utils';

// Helper to get a date X days ago/ahead
const getDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Today at specific time
const getTodayAt = (hours: number, minutes: number = 0): string => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

// Mock employees
export const mockEmployees: Employee[] = [
  {
    id: generateId(),
    name: 'John Smith',
    department: 'Printing',
    position: 'Senior Printer',
    phone: '555-1234',
    email: 'john@print.com',
    joiningDate: getDate(-180), // 6 months ago
    employmentType: 'Full-time',
    salaryType: 'Monthly',
    salaryRate: 3200,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'Emma Johnson',
    department: 'Design',
    position: 'Graphic Designer',
    phone: '555-2345',
    email: 'emma@print.com',
    joiningDate: getDate(-90), // 3 months ago
    employmentType: 'Full-time',
    salaryType: 'Monthly',
    salaryRate: 3000,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'Michael Brown',
    department: 'Binding',
    position: 'Binding Specialist',
    phone: '555-3456',
    email: 'michael@print.com',
    joiningDate: getDate(-45), // 1.5 months ago
    employmentType: 'Part-time',
    salaryType: 'Hourly',
    salaryRate: 18.5,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'Sarah Miller',
    department: 'Packaging',
    position: 'Packaging Associate',
    phone: '555-4567',
    email: 'sarah@print.com',
    joiningDate: getDate(-30), // 1 month ago
    employmentType: 'Full-time',
    salaryType: 'Monthly',
    salaryRate: 2800,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'David Wilson',
    department: 'Management',
    position: 'Production Manager',
    phone: '555-5678',
    email: 'david@print.com',
    joiningDate: getDate(-200), // ~6.5 months ago
    employmentType: 'Full-time',
    salaryType: 'Monthly',
    salaryRate: 4500,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'James Williams',
    department: 'Printing',
    position: 'Assistant Printer',
    phone: '555-6789',
    email: 'james@print.com',
    joiningDate: getDate(-150), // 5 months ago
    employmentType: 'Contractual',
    salaryType: 'Hourly',
    salaryRate: 19.75,
    isActive: false, // Inactive employee
  },
];

// Mock tasks - reference actual employee IDs
export const mockTasks: Task[] = [
  {
    id: generateId(),
    employeeId: mockEmployees[0].id,
    title: 'Complete business card printing',
    description: 'Print 500 business cards for Tech Solutions Inc.',
    dueDate: getDate(2), // 2 days from now
    assignedDate: getDate(-1), // yesterday
    priority: 'High',
    status: 'In Progress',
  },
  {
    id: generateId(),
    employeeId: mockEmployees[1].id,
    title: 'Design new brochure layout',
    description: 'Create a tri-fold brochure design for Green Gardens',
    dueDate: getDate(3), // 3 days from now
    assignedDate: getDate(-2), // 2 days ago
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: generateId(),
    employeeId: mockEmployees[2].id,
    title: 'Bind monthly reports',
    description: 'Spiral binding for 50 financial reports',
    dueDate: getDate(1), // tomorrow
    assignedDate: getDate(-1), // yesterday
    priority: 'Medium',
    status: 'In Progress',
  },
  {
    id: generateId(),
    employeeId: mockEmployees[3].id,
    title: 'Package calendar orders',
    description: 'Box and label 200 custom calendars for shipping',
    dueDate: getDate(0), // today
    assignedDate: getDate(-3), // 3 days ago
    priority: 'High',
    status: 'Completed',
  },
  {
    id: generateId(),
    employeeId: mockEmployees[0].id,
    title: 'Print wedding invitations',
    description: 'Print and cut 150 wedding invitations',
    dueDate: getDate(5), // 5 days from now
    assignedDate: getDate(-1), // yesterday
    priority: 'Low',
    status: 'Pending',
  },
];

// Mock work logs
export const mockLogs: WorkLog[] = [
  // Today's logs
  {
    id: generateId(),
    employeeId: mockEmployees[0].id,
    date: getDate(0), // today
    startTime: getTodayAt(8, 0), // 8:00 AM
    endTime: null, // still working
    description: 'Working on business card printing',
    taskId: mockTasks[0].id,
    status: 'Pending',
    hoursWorked: 0, // Will be calculated when ended
  },
  {
    id: generateId(),
    employeeId: mockEmployees[1].id,
    date: getDate(0), // today
    startTime: getTodayAt(9, 0), // 9:00 AM
    endTime: null, // still working
    description: 'Creating brochure designs',
    taskId: mockTasks[1].id,
    status: 'Pending',
    hoursWorked: 0, // Will be calculated when ended
  },
  {
    id: generateId(),
    employeeId: mockEmployees[3].id,
    date: getDate(0), // today
    startTime: getTodayAt(8, 30), // 8:30 AM
    endTime: getTodayAt(12, 30), // 12:30 PM
    description: 'Completed packaging calendar orders',
    taskId: mockTasks[3].id,
    status: 'Finished',
    hoursWorked: 4, // 4 hours
  },
  
  // Yesterday's logs
  {
    id: generateId(),
    employeeId: mockEmployees[0].id,
    date: getDate(-1), // yesterday
    startTime: getDate(-1) + 'T08:00:00.000Z', // 8:00 AM
    endTime: getDate(-1) + 'T17:00:00.000Z', // 5:00 PM
    description: 'Worked on various printing tasks',
    status: 'Finished',
    hoursWorked: 9, // 9 hours
  },
  {
    id: generateId(),
    employeeId: mockEmployees[1].id,
    date: getDate(-1), // yesterday
    startTime: getDate(-1) + 'T09:30:00.000Z', // 9:30 AM
    endTime: getDate(-1) + 'T16:30:00.000Z', // 4:30 PM
    description: 'Worked on design projects',
    status: 'Finished',
    hoursWorked: 7, // 7 hours
  },
  // Day before yesterday logs
  {
    id: generateId(),
    employeeId: mockEmployees[2].id,
    date: getDate(-2), // day before yesterday
    startTime: getDate(-2) + 'T10:00:00.000Z', // 10:00 AM
    endTime: getDate(-2) + 'T14:00:00.000Z', // 2:00 PM
    description: 'Binding work',
    status: 'Finished',
    hoursWorked: 4, // 4 hours
  },
];

// Mock advances
export const mockAdvances: Advance[] = [
  {
    id: generateId(),
    employeeId: mockEmployees[0].id,
    amount: 500,
    date: getDate(-15), // 15 days ago
    description: 'Advance for medical emergency',
    isPaid: false,
  },
  {
    id: generateId(),
    employeeId: mockEmployees[2].id,
    amount: 300,
    date: getDate(-45), // 45 days ago
    description: 'Advance for family event',
    isPaid: true,
  },
];

// Mock company info
export const mockCompanyInfo: CompanyInfo = {
  name: 'PrintPulse Press',
  address: '123 Print Boulevard, Inkwell City, IN 45678',
  logo: null,
};
