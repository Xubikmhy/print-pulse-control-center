
import { supabase, db } from '../db/config';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { Department, Employee, Task, WorkLog, Attendance, Advance, SalaryDeduction, CompanyInfo } from '@/lib/types';
import { generateId } from '@/lib/utils';

// Department actions
export async function getDepartments(): Promise<Department[]> {
  try {
    const result = await db.select().from(schema.departments);
    return result.map(dept => ({
      id: dept.id.toString(),
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
    await db.insert(schema.departments).values({
      id,
      name,
      description
    });
    return {
      id: id.toString(),
      name,
      description
    };
  } catch (error) {
    console.error('Error adding department:', error);
    return null;
  }
}

export async function updateDepartment(id: string, name: string, description: string): Promise<boolean> {
  try {
    await db.update(schema.departments)
      .set({
        name,
        description,
        updatedAt: new Date()
      })
      .where(eq(schema.departments.id, id));
    return true;
  } catch (error) {
    console.error('Error updating department:', error);
    return false;
  }
}

export async function deleteDepartment(id: string): Promise<boolean> {
  try {
    await db.delete(schema.departments)
      .where(eq(schema.departments.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting department:', error);
    return false;
  }
}

// Employee actions
export async function getEmployees(): Promise<Employee[]> {
  try {
    const result = await db.select().from(schema.employees);
    return result.map(employee => ({
      id: employee.id.toString(),
      name: employee.name,
      department: employee.department,
      position: employee.position,
      phone: employee.phone,
      email: employee.email,
      joiningDate: new Date(employee.joiningDate).toISOString(),
      employmentType: employee.employmentType,
      salaryType: employee.salaryType,
      salaryRate: Number(employee.salaryRate),
      isActive: employee.isActive
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

export async function addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee | null> {
  try {
    const id = generateId();
    await db.insert(schema.employees).values({
      id,
      name: employee.name,
      department: employee.department,
      position: employee.position,
      phone: employee.phone,
      email: employee.email,
      joiningDate: new Date(employee.joiningDate),
      employmentType: employee.employmentType,
      salaryType: employee.salaryType,
      salaryRate: employee.salaryRate,
      isActive: employee.isActive
    });
    return {
      id: id.toString(),
      ...employee
    };
  } catch (error) {
    console.error('Error adding employee:', error);
    return null;
  }
}

export async function updateEmployee(id: string, employee: Partial<Employee>): Promise<boolean> {
  try {
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };

    if (employee.name) updateData.name = employee.name;
    if (employee.department) updateData.department = employee.department;
    if (employee.position) updateData.position = employee.position;
    if (employee.phone) updateData.phone = employee.phone;
    if (employee.email) updateData.email = employee.email;
    if (employee.joiningDate) updateData.joiningDate = new Date(employee.joiningDate);
    if (employee.employmentType) updateData.employmentType = employee.employmentType;
    if (employee.salaryType) updateData.salaryType = employee.salaryType;
    if (employee.salaryRate !== undefined) updateData.salaryRate = employee.salaryRate;
    if (employee.isActive !== undefined) updateData.isActive = employee.isActive;

    await db.update(schema.employees)
      .set(updateData)
      .where(eq(schema.employees.id, id));
    return true;
  } catch (error) {
    console.error('Error updating employee:', error);
    return false;
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    await db.delete(schema.employees)
      .where(eq(schema.employees.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    return false;
  }
}

// Task actions
export async function getTasks(): Promise<Task[]> {
  try {
    const result = await db.select().from(schema.tasks);
    return result.map(task => ({
      id: task.id.toString(),
      employeeId: task.employeeId.toString(),
      title: task.title,
      description: task.description || '',
      dueDate: new Date(task.dueDate).toISOString(),
      assignedDate: new Date(task.assignedDate).toISOString(),
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
    const id = generateId();
    await db.insert(schema.tasks).values({
      id,
      employeeId: task.employeeId,
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate),
      assignedDate: new Date(task.assignedDate),
      priority: task.priority,
      status: task.status
    });
    return {
      id: id.toString(),
      ...task
    };
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
}

export async function updateTask(id: string, task: Partial<Task>): Promise<boolean> {
  try {
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };

    if (task.title) updateData.title = task.title;
    if (task.description !== undefined) updateData.description = task.description;
    if (task.dueDate) updateData.dueDate = new Date(task.dueDate);
    if (task.priority) updateData.priority = task.priority;
    if (task.status) updateData.status = task.status;

    await db.update(schema.tasks)
      .set(updateData)
      .where(eq(schema.tasks.id, id));
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    await db.delete(schema.tasks)
      .where(eq(schema.tasks.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

// WorkLog actions
export async function getWorkLogs(): Promise<WorkLog[]> {
  try {
    const result = await db.select().from(schema.workLogs);
    return result.map(log => ({
      id: log.id.toString(),
      employeeId: log.employeeId.toString(),
      date: new Date(log.date).toISOString(),
      startTime: new Date(log.startTime).toISOString(),
      endTime: log.endTime ? new Date(log.endTime).toISOString() : null,
      description: log.description || '',
      taskId: log.taskId ? log.taskId.toString() : undefined,
      status: log.status,
      hoursWorked: Number(log.hoursWorked)
    }));
  } catch (error) {
    console.error('Error fetching work logs:', error);
    return [];
  }
}

export async function addWorkLog(log: Omit<WorkLog, 'id'>): Promise<WorkLog | null> {
  try {
    const id = generateId();
    await db.insert(schema.workLogs).values({
      id,
      employeeId: log.employeeId,
      date: new Date(log.date),
      startTime: new Date(log.startTime),
      endTime: log.endTime ? new Date(log.endTime) : null,
      description: log.description,
      taskId: log.taskId,
      status: log.status,
      hoursWorked: log.hoursWorked
    });
    return {
      id: id.toString(),
      ...log
    };
  } catch (error) {
    console.error('Error adding work log:', error);
    return null;
  }
}

// Attendance actions
export async function getAttendance(): Promise<Attendance[]> {
  try {
    const result = await db.select().from(schema.attendance);
    return result.map(record => ({
      id: record.id.toString(),
      employeeId: record.employeeId.toString(),
      date: new Date(record.date).toISOString(),
      checkIn: new Date(record.checkIn).toISOString(),
      checkOut: record.checkOut ? new Date(record.checkOut).toISOString() : null,
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
    const id = generateId();
    await db.insert(schema.attendance).values({
      id,
      employeeId: attendance.employeeId,
      date: new Date(attendance.date),
      checkIn: new Date(attendance.checkIn),
      checkOut: attendance.checkOut ? new Date(attendance.checkOut) : null,
      status: attendance.status,
      notes: attendance.notes
    });
    return {
      id: id.toString(),
      ...attendance
    };
  } catch (error) {
    console.error('Error adding attendance:', error);
    return null;
  }
}

export async function updateAttendance(id: string, attendance: Partial<Attendance>): Promise<boolean> {
  try {
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };

    if (attendance.date) updateData.date = new Date(attendance.date);
    if (attendance.checkIn) updateData.checkIn = new Date(attendance.checkIn);
    if (attendance.checkOut !== undefined) updateData.checkOut = attendance.checkOut ? new Date(attendance.checkOut) : null;
    if (attendance.status) updateData.status = attendance.status;
    if (attendance.notes !== undefined) updateData.notes = attendance.notes;

    await db.update(schema.attendance)
      .set(updateData)
      .where(eq(schema.attendance.id, id));
    return true;
  } catch (error) {
    console.error('Error updating attendance:', error);
    return false;
  }
}

export async function deleteAttendance(id: string): Promise<boolean> {
  try {
    await db.delete(schema.attendance)
      .where(eq(schema.attendance.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return false;
  }
}

// Advances and Deductions
export async function getAdvances(): Promise<Advance[]> {
  try {
    const result = await db.select().from(schema.advances);
    return result.map(advance => ({
      id: advance.id.toString(),
      employeeId: advance.employeeId.toString(),
      amount: Number(advance.amount),
      date: new Date(advance.date).toISOString(),
      description: advance.description || '',
      isPaid: advance.isPaid
    }));
  } catch (error) {
    console.error('Error fetching advances:', error);
    return [];
  }
}

export async function getSalaryDeductions(): Promise<SalaryDeduction[]> {
  try {
    const result = await db.select().from(schema.salaryDeductions);
    return result.map(deduction => ({
      id: deduction.id.toString(),
      employeeId: deduction.employeeId.toString(),
      amount: Number(deduction.amount),
      date: new Date(deduction.date).toISOString(),
      reason: deduction.reason || '',
      advanceId: deduction.advanceId ? deduction.advanceId.toString() : undefined
    }));
  } catch (error) {
    console.error('Error fetching salary deductions:', error);
    return [];
  }
}

// Company Info
export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  try {
    const result = await db.select().from(schema.companyInfo).limit(1);
    
    if (result.length === 0) return null;
    
    return {
      name: result[0].name,
      address: result[0].address,
      logo: result[0].logo || null
    };
  } catch (error) {
    console.error('Error fetching company info:', error);
    return null;
  }
}

export async function updateCompanyInfo(info: CompanyInfo): Promise<boolean> {
  try {
    const existingInfo = await db.select().from(schema.companyInfo).limit(1);
    
    if (existingInfo.length === 0) {
      await db.insert(schema.companyInfo).values({
        id: generateId(),
        name: info.name,
        address: info.address,
        logo: info.logo
      });
    } else {
      await db.update(schema.companyInfo)
        .set({
          name: info.name,
          address: info.address,
          logo: info.logo,
          updatedAt: new Date()
        })
        .where(eq(schema.companyInfo.id, existingInfo[0].id));
    }
    return true;
  } catch (error) {
    console.error('Error updating company info:', error);
    return false;
  }
}
