
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/context/app-context';
import { formatDate, priorityToColor, statusToColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckSquare, Edit, ListPlus, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Tasks = () => {
  const { tasks, employees, updateTask, deleteTask } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [employeeFilter, setEmployeeFilter] = React.useState('all');
  
  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (employeeFilter !== 'all' && task.employeeId !== employeeFilter) return false;
    return true;
  });
  
  const handleMarkAsCompleted = (id: string, title: string) => {
    updateTask(id, { status: 'Completed' });
    toast({
      title: "Task Completed",
      description: `Task "${title}" marked as completed.`,
    });
  };
  
  const handleDeleteTask = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteTask(id);
      toast({
        title: "Task Deleted",
        description: `Task "${title}" has been deleted.`,
      });
    }
  };
  
  const activeEmployees = employees.filter(employee => employee.isActive);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-app-gray-900 dark:text-white">
          Tasks
        </h1>
        
        <Button 
          onClick={() => navigate('/tasks/new')}
          className="flex gap-2 items-center w-full sm:w-auto"
        >
          <ListPlus className="h-5 w-5" />
          <span>Add New Task</span>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'Pending' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setStatusFilter('Pending')}
          >
            Pending
          </Button>
          <Button 
            variant={statusFilter === 'In Progress' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setStatusFilter('In Progress')}
          >
            In Progress
          </Button>
          <Button 
            variant={statusFilter === 'Completed' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setStatusFilter('Completed')}
          >
            Completed
          </Button>
        </div>
        
        <select
          className="p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700 w-full sm:w-auto"
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
        >
          <option value="all">All Employees</option>
          {activeEmployees.map(employee => (
            <option key={employee.id} value={employee.id}>{employee.name}</option>
          ))}
        </select>
      </div>
      
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const assignedEmployee = employees.find(e => e.id === task.employeeId);
            return (
              <Card key={task.id} className="overflow-hidden">
                <div className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-app-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <div className="flex items-center flex-wrap gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${priorityToColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusToColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      {task.status !== 'Completed' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleMarkAsCompleted(task.id, task.title)}
                          className="text-app-green hover:bg-green-100 dark:hover:bg-green-900"
                        >
                          <CheckSquare className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/tasks/edit/${task.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteTask(task.id, task.title)}
                        className="text-app-red hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-app-gray-600 dark:text-app-gray-400 mt-2 space-y-1">
                    {task.description && (
                      <p className="line-clamp-2">{task.description}</p>
                    )}
                    <p>Assigned to: {assignedEmployee?.name || 'Unknown'}</p>
                    <p>Due: {formatDate(task.dueDate)}</p>
                    <p>Created: {formatDate(task.assignedDate)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-app-gray-500 dark:text-app-gray-400">
            No tasks found matching your filters.
          </p>
          <Button onClick={() => navigate('/tasks/new')} className="mt-4">
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tasks;
