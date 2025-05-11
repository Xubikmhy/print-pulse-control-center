
import { supabase } from '../db/config';
import { departments, employees, tasks, workLogs, advances, attendance, salaryDeductions, companyInfo } from './schema';

/**
 * Check if a table exists in the Supabase database
 */
export const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('exec', {
      query: `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '${tableName}'
      ) as exists`
    });
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return data && Array.isArray(data) && data.length > 0 ? !!data[0].exists : false;
  } catch (error) {
    console.error(`Error in tableExists for ${tableName}:`, error);
    return false;
  }
};

/**
 * Get table definitions for creating tables in Supabase
 */
export const getTableDefinitions = () => {
  return {
    departments: `
      CREATE TABLE IF NOT EXISTS departments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    employees: `
      CREATE TABLE IF NOT EXISTS employees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        position TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        joining_date TIMESTAMP NOT NULL,
        employment_type TEXT NOT NULL CHECK (employment_type IN ('Full-time', 'Part-time', 'Contractual')),
        salary_type TEXT NOT NULL CHECK (salary_type IN ('Hourly', 'Monthly')),
        salary_rate NUMERIC NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    tasks: `
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES employees(id),
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        due_date TIMESTAMP NOT NULL,
        assigned_date TIMESTAMP NOT NULL,
        priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
        status TEXT NOT NULL CHECK (status IN ('Completed', 'In Progress', 'Pending')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    work_logs: `
      CREATE TABLE IF NOT EXISTS work_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES employees(id),
        date TIMESTAMP NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        description TEXT DEFAULT '',
        task_id UUID REFERENCES tasks(id),
        status TEXT NOT NULL CHECK (status IN ('Finished', 'Pending')),
        hours_worked NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    advances: `
      CREATE TABLE IF NOT EXISTS advances (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES employees(id),
        amount NUMERIC NOT NULL,
        date TIMESTAMP NOT NULL,
        description TEXT DEFAULT '',
        is_paid BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    attendance: `
      CREATE TABLE IF NOT EXISTS attendance (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES employees(id),
        date TIMESTAMP NOT NULL,
        check_in TIMESTAMP NOT NULL,
        check_out TIMESTAMP,
        status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Half-day', 'Late')),
        notes TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    salary_deductions: `
      CREATE TABLE IF NOT EXISTS salary_deductions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL REFERENCES employees(id),
        amount NUMERIC NOT NULL,
        date TIMESTAMP NOT NULL,
        reason TEXT DEFAULT '',
        advance_id UUID REFERENCES advances(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    company_info: `
      CREATE TABLE IF NOT EXISTS company_info (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        logo TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
  };
};

/**
 * Create all necessary tables in Supabase
 */
export const setupTables = async () => {
  try {
    const tableDefinitions = getTableDefinitions();
    const results = [];
    
    // Create tables in order to respect foreign key constraints
    const tableOrder = [
      'departments', 
      'employees', 
      'tasks', 
      'work_logs', 
      'advances', 
      'attendance', 
      'salary_deductions', 
      'company_info'
    ];
    
    for (const tableName of tableOrder) {
      const exists = await tableExists(tableName);
      
      if (!exists) {
        const { error } = await supabase.rpc('exec', { 
          query: tableDefinitions[tableName as keyof typeof tableDefinitions] 
        });
        
        results.push({
          table: tableName,
          success: !error,
          error: error ? error.message : null
        });
      } else {
        results.push({
          table: tableName,
          success: true,
          message: 'Table already exists'
        });
      }
    }
    
    return results;
  } catch (error: any) {
    console.error('Error setting up tables:', error);
    return [{ success: false, error: error.message }];
  }
};

/**
 * Insert initial sample data into the tables
 */
export const insertSampleData = async () => {
  try {
    // Clear existing data
    await supabase.rpc('exec', { 
      query: "DELETE FROM salary_deductions WHERE id != '00000000-0000-0000-0000-000000000000'"
    });
    await supabase.rpc('exec', { 
      query: "DELETE FROM attendance WHERE id != '00000000-0000-0000-0000-000000000000'"
    });
    await supabase.rpc('exec', { 
      query: "DELETE FROM work_logs WHERE id != '00000000-0000-0000-0000-000000000000'"
    });
    await supabase.rpc('exec', { 
      query: "DELETE FROM advances WHERE id != '00000000-0000-0000-0000-000000000000'"
    });
    await supabase.rpc('exec', { 
      query: "DELETE FROM tasks WHERE id != '00000000-0000-0000-0000-000000000000'"
    });
    await supabase.rpc('exec', { 
      query: "DELETE FROM employees WHERE id != '00000000-0000-0000-0000-000000000000'"
    });
    await supabase.rpc('exec', { 
      query: "DELETE FROM departments WHERE id != '00000000-0000-0000-0000-000000000000'"
    });
    await supabase.rpc('exec', { 
      query: "DELETE FROM company_info WHERE id != '00000000-0000-0000-0000-000000000000'"
    });
    
    // Insert departments
    const { error: deptError } = await supabase.rpc('exec', {
      query: `
        INSERT INTO departments (name, description)
        VALUES 
          ('Printing', 'Handles all printing operations'),
          ('Design', 'Creates design layouts for printing'),
          ('Binding', 'Handles book binding and finishing'),
          ('Management', 'Administrative department')
        RETURNING *;
      `
    });
    
    if (deptError) throw deptError;
    
    // Insert employees
    const { error: empError } = await supabase.rpc('exec', {
      query: `
        INSERT INTO employees (
          name, department, position, phone, email, joining_date, 
          employment_type, salary_type, salary_rate, is_active
        )
        VALUES 
          (
            'John Doe', 'Printing', 'Senior Printer', '555-1234', 
            'john@example.com', '2022-01-15', 'Full-time', 
            'Monthly', 3500, true
          ),
          (
            'Jane Smith', 'Design', 'Graphic Designer', '555-5678', 
            'jane@example.com', '2022-03-10', 'Full-time', 
            'Monthly', 4000, true
          )
        RETURNING id;
      `
    });
    
    if (empError) throw empError;
    
    // For tasks, we'll need to get the employee IDs first
    const { data: empData, error: getEmpError } = await supabase.rpc('exec', {
      query: `SELECT id, name FROM employees LIMIT 2;`
    });
    
    if (getEmpError) throw getEmpError;
    
    if (empData && Array.isArray(empData) && empData.length > 0) {
      // Insert tasks for the employees
      const { error: taskError } = await supabase.rpc('exec', {
        query: `
          INSERT INTO tasks (
            employee_id, title, description, due_date, assigned_date, 
            priority, status
          )
          VALUES 
            (
              '${empData[0].id}', 'Complete spring catalog printing', 
              'Print 500 copies of the spring catalog', 
              NOW() + INTERVAL '7 days', NOW(),
              'High', 'In Progress'
            ),
            (
              '${empData[1].id}', 'Design summer brochure', 
              'Create layout for summer products brochure', 
              NOW() + INTERVAL '14 days', NOW(),
              'Medium', 'Pending'
            );
        `
      });
      
      if (taskError) throw taskError;
    }
    
    // Insert company info
    const { error: companyError } = await supabase.rpc('exec', {
      query: `
        INSERT INTO company_info (name, address)
        VALUES ('PrintPulse Inc.', '123 Printing Avenue, Inktown, IN 12345');
      `
    });
    
    if (companyError) throw companyError;
    
    return { success: true, message: 'Sample data inserted successfully' };
  } catch (error: any) {
    console.error('Error inserting sample data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Run a test query to verify the database connection and schema
 */
export const runTestQuery = async () => {
  try {
    // Test query for departments
    const { data: deptData, error: deptError } = await supabase.rpc('exec', {
      query: `SELECT * FROM departments;`
    });
    
    if (deptError) throw deptError;
    
    // Test query for employees with department join
    const { data: empData, error: empError } = await supabase.rpc('exec', {
      query: `
        SELECT e.*, 
        (SELECT json_agg(t) FROM tasks t WHERE t.employee_id = e.id) as tasks 
        FROM employees e;
      `
    });
    
    if (empError) throw empError;
    
    return { 
      success: true, 
      departments: deptData || [], 
      employees: empData || [],
      message: 'Test query executed successfully' 
    };
  } catch (error: any) {
    console.error('Error running test query:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Reset the database - for development use only
 */
export const resetDatabase = async () => {
  try {
    await setupTables();
    const result = await insertSampleData();
    return result;
  } catch (error: any) {
    console.error('Error resetting database:', error);
    return { success: false, error: error.message };
  }
};
