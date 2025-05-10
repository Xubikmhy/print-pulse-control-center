
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/context/app-context';
import { formatDate, departmentToColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Plus, Trash2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useData } from '@/lib/context/data-provider';

const Employees = () => {
  const { employees, departments } = useApp();
  const { deleteEmployee } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = React.useState('all'); // 'all' | 'active' | 'inactive'
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  
  const filteredEmployees = employees.filter(employee => {
    if (filter === 'active' && !employee.isActive) return false;
    if (filter === 'inactive' && employee.isActive) return false;
    if (departmentFilter !== 'all' && employee.department !== departmentFilter) return false;
    return true;
  });
  
  // Get unique department names from actual departments or employees
  const uniqueDepartments = React.useMemo(() => {
    if (departments.length > 0) {
      return departments.map(dept => dept.name);
    }
    return [...new Set(employees.map(e => e.department))];
  }, [departments, employees]);
  
  const handleDelete = (id: string, name: string) => {
    deleteEmployee(id);
    toast({
      title: "Employee Deleted",
      description: `${name} has been deleted.`,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-app-gray-900 dark:text-white">
          Employees
        </h1>
        
        <Button 
          onClick={() => navigate('/employees/new')}
          className="flex gap-2 items-center w-full sm:w-auto"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add New Employee</span>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'active' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant={filter === 'inactive' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('inactive')}
          >
            Inactive
          </Button>
        </div>
        
        <select
          className="p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700 w-full sm:w-auto"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          {uniqueDepartments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>
      
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="overflow-hidden">
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-app-gray-900 dark:text-white">
                      {employee.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${departmentToColor(employee.department)}`}>
                        {employee.department}
                      </span>
                      <span className={`text-xs ml-2 px-2 py-1 rounded-full ${
                        employee.isActive 
                          ? 'bg-app-green bg-opacity-20 text-app-green' 
                          : 'bg-app-red bg-opacity-20 text-app-red'
                      }`}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/employees/edit/${employee.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-app-red hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {employee.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(employee.id, employee.name)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <div className="text-sm text-app-gray-600 dark:text-app-gray-400 mt-2 space-y-1">
                  <p>Phone: {employee.phone}</p>
                  <p>Email: {employee.email}</p>
                  <p>Joined: {formatDate(employee.joiningDate)}</p>
                  <p>
                    {employee.employmentType}, {employee.salaryType} rate
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-app-gray-500 dark:text-app-gray-400">
            No employees found matching your filters.
          </p>
          <Button onClick={() => navigate('/employees/new')} className="mt-4">
            <Plus className="h-4 w-4 mr-2" /> Add Employee
          </Button>
        </div>
      )}
    </div>
  );
};

export default Employees;
