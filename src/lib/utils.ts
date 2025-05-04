
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Format date to human-readable string
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'PPP');
}

// Format time to 12-hour format
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
}

// Get time passed since date
export function timeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Calculate hours between two dates
export function calculateHours(start: string | Date, end: string | Date): number {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  
  const diffInMs = endDate.getTime() - startDate.getTime();
  return Math.round((diffInMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
}

// Get today's date as ISO string (without time)
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

// Check if the date is today
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
}

// Convert department to color
export function departmentToColor(department: string): string {
  switch (department) {
    case 'Printing':
      return 'bg-app-blue text-white';
    case 'Design':
      return 'bg-app-purple text-white';
    case 'Binding':
      return 'bg-app-green text-white';
    case 'Packaging':
      return 'bg-app-orange text-white';
    case 'Management':
      return 'bg-app-red text-white';
    default:
      return 'bg-app-gray-500 text-white';
  }
}

// Convert priority to color
export function priorityToColor(priority: string): string {
  switch (priority) {
    case 'High':
      return 'bg-app-red text-white';
    case 'Medium':
      return 'bg-app-orange text-white';
    case 'Low':
      return 'bg-app-green text-white';
    default:
      return 'bg-app-gray-500 text-white';
  }
}

// Convert status to color
export function statusToColor(status: string): string {
  switch (status) {
    case 'Completed':
      return 'bg-app-green text-white';
    case 'In Progress':
      return 'bg-app-blue text-white';
    case 'Pending':
      return 'bg-app-orange text-white';
    case 'Finished':
      return 'bg-app-green text-white';
    default:
      return 'bg-app-gray-500 text-white';
  }
}
