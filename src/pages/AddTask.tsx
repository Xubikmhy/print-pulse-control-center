
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddTask = () => {
  const navigate = useNavigate();
  const { addTask, employees } = useApp();
  const { toast } = useToast();
  
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [employeeId, setEmployeeId] = React.useState('');
  const [dueDate, setDueDate] = React.useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [priority, setPriority] = React.useState('Medium');
  const [status, setStatus] = React.useState('Pending');
  
  const activeEmployees = employees.filter(employee => employee.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !employeeId || !dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    addTask({
      title,
      description,
      employeeId,
      dueDate,
      assignedDate: new Date().toISOString(),
      priority: priority as any,
      status: status as any,
    });
    
    toast({
      title: "Task Added",
      description: `Task "${title}" has been added successfully.`,
    });
    
    navigate('/tasks');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/tasks')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-app-gray-900 dark:text-white">
            Add New Task
          </h1>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-app-red">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full p-2 border rounded-md min-h-[100px] dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="employee" className="text-sm font-medium">
                  Assign To <span className="text-app-red">*</span>
                </label>
                <select
                  id="employee"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select an employee</option>
                  {activeEmployees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.department})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="due-date" className="text-sm font-medium">
                  Due Date <span className="text-app-red">*</span>
                </label>
                <input
                  id="due-date"
                  type="date"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tasks')}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto flex gap-2 items-center"
              >
                <Save className="h-4 w-4" />
                Save Task
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddTask;
