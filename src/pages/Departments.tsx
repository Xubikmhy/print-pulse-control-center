
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DepartmentForm } from '@/components/departments/DepartmentForm';

const Departments = () => {
  const { departments, employees } = useApp();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  
  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setIsEditDialogOpen(true);
  };
  
  const getDepartmentUsageCount = (departmentName: string) => {
    return employees.filter(employee => employee.department === departmentName).length;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-app-gray-900 dark:text-white">
          Departments
        </h1>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex gap-2 items-center w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Add Department</span>
        </Button>
      </div>
      
      {departments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((department) => {
            const usageCount = getDepartmentUsageCount(department.name);
            
            return (
              <Card key={department.id} className="overflow-hidden">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-app-gray-900 dark:text-white">
                        {department.name}
                      </h3>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDepartmentSelect(department.id)}
                      >
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
                            <AlertDialogTitle>
                              {usageCount > 0 ? "Department in Use" : "Delete Department"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {usageCount > 0 
                                ? `This department is currently assigned to ${usageCount} employee(s). You need to reassign them before deleting.`
                                : `Are you sure you want to delete ${department.name}? This action cannot be undone.`
                              }
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            {usageCount === 0 && (
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  try {
                                    const { deleteDepartment } = useApp();
                                    deleteDepartment(department.id);
                                    toast({
                                      title: "Department Deleted",
                                      description: `${department.name} has been deleted.`,
                                    });
                                  } catch (error) {
                                    toast({
                                      variant: "destructive",
                                      title: "Error",
                                      description: error instanceof Error ? error.message : "An unknown error occurred",
                                    });
                                  }
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            )}
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  
                  <p className="text-sm text-app-gray-600 dark:text-app-gray-400 mt-2">
                    {department.description}
                  </p>
                  
                  <div className="mt-4 text-xs text-app-gray-500 dark:text-app-gray-400">
                    <span className="flex items-center">
                      {usageCount} employee{usageCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-app-gray-500 dark:text-app-gray-400">
            No departments found. Add your first department to get started.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" /> Add Department
          </Button>
        </div>
      )}
      
      {/* Add Department Dialog */}
      <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Department</AlertDialogTitle>
          </AlertDialogHeader>
          <DepartmentForm 
            onClose={() => setIsAddDialogOpen(false)} 
          />
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Department Dialog */}
      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Department</AlertDialogTitle>
          </AlertDialogHeader>
          <DepartmentForm 
            departmentId={selectedDepartment ?? undefined} 
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedDepartment(null);
            }} 
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Departments;
