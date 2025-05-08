
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getWorkLogs,
  addWorkLog,
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  getAdvances,
  getSalaryDeductions,
  getCompanyInfo,
  updateCompanyInfo
} from '../lib/server/actions';
import type { 
  Department, 
  Employee, 
  Task, 
  WorkLog, 
  Attendance, 
  Advance, 
  SalaryDeduction, 
  CompanyInfo 
} from '@/lib/types';
import { useToast } from './use-toast';

export function useDepartments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments
  });

  const addMutation = useMutation({
    mutationFn: ({ name, description }: { name: string, description: string }) => 
      addDepartment(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Success",
        description: "Department has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add department: ${error}`,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name, description }: { id: string, name: string, description: string }) => 
      updateDepartment(id, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Success",
        description: "Department has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update department: ${error}`,
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Success",
        description: "Department has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete department: ${error}`,
        variant: "destructive",
      });
    }
  });

  return {
    departments: data,
    isLoading,
    error,
    addDepartment: addMutation.mutate,
    updateDepartment: updateMutation.mutate,
    deleteDepartment: deleteMutation.mutate
  };
}

export function useEmployees() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees
  });

  const addMutation = useMutation({
    mutationFn: (employee: Omit<Employee, 'id'>) => addEmployee(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Success",
        description: "Employee has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add employee: ${error}`,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Employee> }) => 
      updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Success",
        description: "Employee has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update employee: ${error}`,
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Success",
        description: "Employee has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete employee: ${error}`,
        variant: "destructive",
      });
    }
  });

  return {
    employees: data,
    isLoading,
    error,
    addEmployee: addMutation.mutate,
    updateEmployee: updateMutation.mutate,
    deleteEmployee: deleteMutation.mutate
  };
}

export function useTasks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });

  const addMutation = useMutation({
    mutationFn: (task: Omit<Task, 'id'>) => addTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Success",
        description: "Task has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add task: ${error}`,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Task> }) => 
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Success",
        description: "Task has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update task: ${error}`,
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Success",
        description: "Task has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete task: ${error}`,
        variant: "destructive",
      });
    }
  });

  return {
    tasks: data,
    isLoading,
    error,
    addTask: addMutation.mutate,
    updateTask: updateMutation.mutate,
    deleteTask: deleteMutation.mutate
  };
}

export function useWorkLogs() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['workLogs'],
    queryFn: getWorkLogs
  });

  return { workLogs: data, isLoading, error };
}

export function useAttendance() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['attendance'],
    queryFn: getAttendance
  });

  const addMutation = useMutation({
    mutationFn: (attendance: Omit<Attendance, 'id'>) => addAttendance(attendance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: "Success",
        description: "Attendance record has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add attendance: ${error}`,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Attendance> }) => 
      updateAttendance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: "Success",
        description: "Attendance record has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update attendance: ${error}`,
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: "Success",
        description: "Attendance record has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete attendance: ${error}`,
        variant: "destructive",
      });
    }
  });

  return {
    attendance: data,
    isLoading,
    error,
    addAttendance: addMutation.mutate,
    updateAttendance: updateMutation.mutate,
    deleteAttendance: deleteMutation.mutate
  };
}

export function useAdvances() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['advances'],
    queryFn: getAdvances
  });

  return { advances: data, isLoading, error };
}

export function useSalaryDeductions() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['salaryDeductions'],
    queryFn: getSalaryDeductions
  });

  return { deductions: data, isLoading, error };
}

export function useCompanyInfo() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: getCompanyInfo
  });

  const updateMutation = useMutation({
    mutationFn: (info: CompanyInfo) => updateCompanyInfo(info),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyInfo'] });
      toast({
        title: "Success",
        description: "Company information has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update company information: ${error}`,
        variant: "destructive",
      });
    }
  });

  return {
    companyInfo: data,
    isLoading,
    error,
    updateCompanyInfo: updateMutation.mutate
  };
}
