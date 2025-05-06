
import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface DepartmentFormProps {
  departmentId?: string;
  onClose: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({ departmentId, onClose }) => {
  const { departments, addDepartment, updateDepartment } = useApp();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = !!departmentId;
  
  useEffect(() => {
    if (departmentId) {
      const department = departments.find(d => d.id === departmentId);
      if (department) {
        setName(department.name);
        setDescription(department.description);
      }
    }
  }, [departmentId, departments]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('Department name is required');
      return;
    }
    
    // Check if the department name already exists (for new departments)
    if (!isEditing && departments.some(d => d.name.toLowerCase() === name.toLowerCase())) {
      setError('A department with this name already exists');
      return;
    }
    
    try {
      if (isEditing && departmentId) {
        updateDepartment(departmentId, name, description);
        toast({
          title: "Department Updated",
          description: `${name} department has been updated.`,
        });
      } else {
        addDepartment(name, description);
        toast({
          title: "Department Added",
          description: `${name} department has been added.`,
        });
      }
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Department Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter department name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter department description"
            rows={3}
          />
        </div>
        
        {error && (
          <div className="text-sm font-medium text-red-500">
            {error}
          </div>
        )}
      </div>
      
      <AlertDialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Save Changes' : 'Add Department'}
        </Button>
      </AlertDialogFooter>
    </form>
  );
};
