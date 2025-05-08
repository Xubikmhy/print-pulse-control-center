
import { supabase } from '../db/config';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { Department, Employee, Task, WorkLog, Attendance, Advance, SalaryDeduction, CompanyInfo } from '@/lib/types';
import { generateId } from '@/lib/utils';

// Using Supabase as the primary client for frontend operations
// For actual production, you would use server-side actions for DB operations

// Department actions
export async function getDepartments(): Promise<Department[]> {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*');
    
    if (error) throw error;
    
    return data.map(dept => ({
      id: dept.id,
      name: dept.name,
      description: dept.description || ''
    }));
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

export async function addDepartment(name: string, description: string): Promise<Department | null> {
  try {
    const id = generateId();
    const { data, error } = await supabase
      .from('departments')
      .insert({
        id,
        name,
        description
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || ''
    };
  } catch (error) {
    console.error('Error adding department:', error);
    return null;
  }
}

export async function updateDepartment(id: string, name: string, description: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('departments')
      .update({
        name,
        description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating department:', error);
    return false;
  }
}

export async function deleteDepartment(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting department:', error);
    return false;
  }
}

// Employee actions
export async function getEmployees(): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*');
    
    if (error) throw error;
    
    return data.map(employee => ({
      id: employee.id,
      name: employee.name,
      department: employee.department,
      position: employee.position,
      phone: employee.phone,
      email: employee.email,
      joiningDate: new Date(employee.joining_date).toISOString(),
      employmentType: employee.employment_type,
      salaryType: employee.salary_type,
      salaryRate: Number(employee.salary_rate),
      isActive: employee.is_active
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee | null> {
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert({
        name: employee.name,
        department: employee.department,
        position: employee.position,
        phone: employee.phone,
        email: employee.email,
        joining_date: new Date(employee.joiningDate).toISOString(),
        employment_type: employee.employmentType,
        salary_type: employee.salaryType,
        salary_rate: employee.salaryRate,
        is_active: employee.isActive
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      department: data.department,
      position: data.position,
      phone: data.phone,
      email: data.email,
      joiningDate: new Date(data.joining_date).toISOString(),
      employmentType: data.employment_type,
      salaryType: data.salary_type,
      salaryRate: Number(data.salary_rate),
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Error adding employee:', error);
    return null;
  }
}

export async function updateEmployee(id: string, employee: Partial<Employee>): Promise<boolean> {
  try {
    const updateData: Record<string, any> = {};

    if (employee.name) updateData.name = employee.name;
    if (employee.department) updateData.department = employee.department;
    if (employee.position) updateData.position = employee.position;
    if (employee.phone) updateData.phone = employee.phone;
    if (employee.email) updateData.email = employee.email;
    if (employee.joiningDate) updateData.joining_date = new Date(employee.joiningDate).toISOString();
    if (employee.employmentType) updateData.employment_type = employee.employmentType;
    if (employee.salaryType) updateData.salary_type = employee.salaryType;
    if (employee.salaryRate !== undefined) updateData.salary_rate = employee.salaryRate;
    if (employee.isActive !== undefined) updateData.is_active = employee.isActive;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating employee:', error);
    return false;
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    return false;
  }
}

// Task actions
export async function getTasks(): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');
    
    if (error) throw error;
    
    return data.map(task => ({
      id: task.id,
      employeeId: task.employee_id,
      title: task.title,
      description: task.description || '',
      dueDate: new Date(task.due_date).toISOString(),
      assignedDate: new Date(task.assigned_date).toISOString(),
      priority: task.priority,
      status: task.status
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function addTask(task: Omit<Task, 'id'>): Promise<Task | null> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        employee_id: task.employeeId,
        title: task.title,
        description: task.description,
        due_date: new Date(task.dueDate).toISOString(),
        assigned_date: new Date(task.assignedDate).toISOString(),
        priority: task.priority,
        status: task.status
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      employeeId: data.employee_id,
      title: data.title,
      description: data.description || '',
      dueDate: new Date(data.due_date).toISOString(),
      assignedDate: new Date(data.assigned_date).toISOString(),
      priority: data.priority,
      status: data.status
    };
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
}

export async function updateTask(id: string, task: Partial<Task>): Promise<boolean> {
  try {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (task.title) updateData.title = task.title;
    if (task.description !== undefined) updateData.description = task.description;
    if (task.dueDate) updateData.due_date = new Date(task.dueDate).toISOString();
    if (task.priority) updateData.priority = task.priority;
    if (task.status) updateData.status = task.status;

    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

// WorkLog actions
export async function getWorkLogs(): Promise<WorkLog[]> {
  try {
    const { data, error } = await supabase
      .from('work_logs')
      .select('*');
    
    if (error) throw error;
    
    return data.map(log => ({
      id: log.id,
      employeeId: log.employee_id,
      date: new Date(log.date).toISOString(),
      startTime: new Date(log.start_time).toISOString(),
      endTime: log.end_time ? new Date(log.end_time).toISOString() : null,
      description: log.description || '',
      taskId: log.task_id || undefined,
      status: log.status,
      hoursWorked: Number(log.hours_worked)
    }));
  } catch (error) {
    console.error('Error fetching work logs:', error);
    return [];
  }
}

export async function addWorkLog(log: Omit<WorkLog, 'id'>): Promise<WorkLog | null> {
  try {
    const { data, error } = await supabase
      .from('work_logs')
      .insert({
        employee_id: log.employeeId,
        date: new Date(log.date).toISOString(),
        start_time: new Date(log.startTime).toISOString(),
        end_time: log.endTime ? new Date(log.endTime).toISOString() : null,
        description: log.description,
        task_id: log.taskId,
        status: log.status,
        hours_worked: log.hoursWorked
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      employeeId: data.employee_id,
      date: new Date(data.date).toISOString(),
      startTime: new Date(data.start_time).toISOString(),
      endTime: data.end_time ? new Date(data.end_time).toISOString() : null,
      description: data.description || '',
      taskId: data.task_id || undefined,
      status: data.status,
      hoursWorked: Number(data.hours_worked)
    };
  } catch (error) {
    console.error('Error adding work log:', error);
    return null;
  }
}

// Attendance actions
export async function getAttendance(): Promise<Attendance[]> {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*');
    
    if (error) throw error;
    
    return data.map(record => ({
      id: record.id,
      employeeId: record.employee_id,
      date: new Date(record.date).toISOString(),
      checkIn: new Date(record.check_in).toISOString(),
      checkOut: record.check_out ? new Date(record.check_out).toISOString() : null,
      status: record.status,
      notes: record.notes || ''
    }));
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
}

export async function addAttendance(attendance: Omit<Attendance, 'id'>): Promise<Attendance | null> {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        employee_id: attendance.employeeId,
        date: new Date(attendance.date).toISOString(),
        check_in: new Date(attendance.checkIn).toISOString(),
        check_out: attendance.checkOut ? new Date(attendance.checkOut).toISOString() : null,
        status: attendance.status,
        notes: attendance.notes
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      employeeId: data.employee_id,
      date: new Date(data.date).toISOString(),
      checkIn: new Date(data.check_in).toISOString(),
      checkOut: data.check_out ? new Date(data.check_out).toISOString() : null,
      status: data.status,
      notes: data.notes || ''
    };
  } catch (error) {
    console.error('Error adding attendance:', error);
    return null;
  }
}

export async function updateAttendance(id: string, attendance: Partial<Attendance>): Promise<boolean> {
  try {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (attendance.date) updateData.date = new Date(attendance.date).toISOString();
    if (attendance.checkIn) updateData.check_in = new Date(attendance.checkIn).toISOString();
    if (attendance.checkOut !== undefined) updateData.check_out = attendance.checkOut ? new Date(attendance.checkOut).toISOString() : null;
    if (attendance.status) updateData.status = attendance.status;
    if (attendance.notes !== undefined) updateData.notes = attendance.notes;

    const { error } = await supabase
      .from('attendance')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating attendance:', error);
    return false;
  }
}

export async function deleteAttendance(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return false;
  }
}

// Advances and Deductions
export async function getAdvances(): Promise<Advance[]> {
  try {
    const { data, error } = await supabase
      .from('advances')
      .select('*');
    
    if (error) throw error;
    
    return data.map(advance => ({
      id: advance.id,
      employeeId: advance.employee_id,
      amount: Number(advance.amount),
      date: new Date(advance.date).toISOString(),
      description: advance.description || '',
      isPaid: advance.is_paid
    }));
  } catch (error) {
    console.error('Error fetching advances:', error);
    return [];
  }
}

export async function getSalaryDeductions(): Promise<SalaryDeduction[]> {
  try {
    const { data, error } = await supabase
      .from('salary_deductions')
      .select('*');
    
    if (error) throw error;
    
    return data.map(deduction => ({
      id: deduction.id,
      employeeId: deduction.employee_id,
      amount: Number(deduction.amount),
      date: new Date(deduction.date).toISOString(),
      reason: deduction.reason || '',
      advanceId: deduction.advance_id || undefined
    }));
  } catch (error) {
    console.error('Error fetching salary deductions:', error);
    return [];
  }
}

// Company Info
export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  try {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return null;
    
    return {
      name: data.name,
      address: data.address,
      logo: data.logo || null
    };
  } catch (error) {
    console.error('Error fetching company info:', error);
    return null;
  }
}

export async function updateCompanyInfo(info: CompanyInfo): Promise<boolean> {
  try {
    // First check if we have any company info
    const { data } = await supabase
      .from('company_info')
      .select('id')
      .limit(1);
    
    if (data && data.length > 0) {
      // Update existing
      const { error } = await supabase
        .from('company_info')
        .update({
          name: info.name,
          address: info.address,
          logo: info.logo,
          updated_at: new Date().toISOString()
        })
        .eq('id', data[0].id);
      
      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase
        .from('company_info')
        .insert({
          name: info.name,
          address: info.address,
          logo: info.logo
        });
      
      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error('Error updating company info:', error);
    return false;
  }
}
