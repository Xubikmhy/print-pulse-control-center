
import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  uuid,
  pgEnum
} from 'drizzle-orm/pg-core';

// Enums based on the existing types
export const departmentTypeEnum = pgEnum('department_type', [
  'Printing', 'Design', 'Binding', 'Packaging', 'Management', 'Others'
]);

export const employmentTypeEnum = pgEnum('employment_type', [
  'Full-time', 'Part-time', 'Contractual'
]);

export const salaryTypeEnum = pgEnum('salary_type', [
  'Hourly', 'Monthly'
]);

export const taskPriorityEnum = pgEnum('task_priority', [
  'High', 'Medium', 'Low'
]);

export const taskStatusEnum = pgEnum('task_status', [
  'Completed', 'In Progress', 'Pending'
]);

export const logStatusEnum = pgEnum('log_status', [
  'Finished', 'Pending'
]);

export const attendanceStatusEnum = pgEnum('attendance_status', [
  'Present', 'Absent', 'Half-day', 'Late'
]);

// Database schema definition
export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const employees = pgTable('employees', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  department: text('department').notNull(),
  position: text('position').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  joiningDate: timestamp('joining_date').notNull(),
  employmentType: employmentTypeEnum('employment_type').notNull(),
  salaryType: salaryTypeEnum('salary_type').notNull(),
  salaryRate: numeric('salary_rate').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id').notNull().references(() => employees.id),
  title: text('title').notNull(),
  description: text('description').default(''),
  dueDate: timestamp('due_date').notNull(),
  assignedDate: timestamp('assigned_date').notNull(),
  priority: taskPriorityEnum('priority').notNull(),
  status: taskStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const workLogs = pgTable('work_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id').notNull().references(() => employees.id),
  date: timestamp('date').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  description: text('description').default(''),
  taskId: uuid('task_id').references(() => tasks.id),
  status: logStatusEnum('status').notNull(),
  hoursWorked: numeric('hours_worked').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const advances = pgTable('advances', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id').notNull().references(() => employees.id),
  amount: numeric('amount').notNull(),
  date: timestamp('date').notNull(),
  description: text('description').default(''),
  isPaid: boolean('is_paid').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const attendance = pgTable('attendance', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id').notNull().references(() => employees.id),
  date: timestamp('date').notNull(),
  checkIn: timestamp('check_in').notNull(),
  checkOut: timestamp('check_out'),
  status: attendanceStatusEnum('status').notNull(),
  notes: text('notes').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const salaryDeductions = pgTable('salary_deductions', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id').notNull().references(() => employees.id),
  amount: numeric('amount').notNull(),
  date: timestamp('date').notNull(),
  reason: text('reason').default(''),
  advanceId: uuid('advance_id').references(() => advances.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const companyInfo = pgTable('company_info', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  logo: text('logo'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
