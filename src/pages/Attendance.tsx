
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/context/app-context';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Attendance as AttendanceType } from '@/lib/types';
import { CalendarIcon, Clock, UserPlus, Edit, Trash2, UserCheck, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Attendance = () => {
  const { employees, attendance, addAttendance, updateAttendance, deleteAttendance } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filter states
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(new Date());
  
  // Form states
  const [isAddingAttendance, setIsAddingAttendance] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceType | null>(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date(),
    checkIn: '',
    checkOut: '',
    status: 'Present' as 'Present' | 'Absent' | 'Half-day' | 'Late',
    notes: ''
  });
  
  // Filtered attendance records
  const filteredAttendance = attendance.filter(record => {
    const recordDate = new Date(record.date);
    
    // Filter by employee
    if (employeeFilter !== 'all' && record.employeeId !== employeeFilter) {
      return false;
    }
    
    // Filter by date if a date is selected
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      return recordDate.getDate() === filterDate.getDate() && 
             recordDate.getMonth() === filterDate.getMonth() && 
             recordDate.getFullYear() === filterDate.getFullYear();
    }
    
    return true;
  });
  
  // Sort by date (newest first)
  filteredAttendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Reset form
  const resetForm = () => {
    setFormData({
      employeeId: '',
      date: new Date(),
      checkIn: '',
      checkOut: '',
      status: 'Present',
      notes: ''
    });
    setSelectedAttendance(null);
    setIsAddingAttendance(false);
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const attendanceData = {
        employeeId: formData.employeeId,
        date: formData.date.toISOString(),
        checkIn: formData.checkIn ? new Date(`${format(formData.date, 'yyyy-MM-dd')}T${formData.checkIn}`).toISOString() : new Date().toISOString(),
        checkOut: formData.checkOut ? new Date(`${format(formData.date, 'yyyy-MM-dd')}T${formData.checkOut}`).toISOString() : null,
        status: formData.status,
        notes: formData.notes
      };
      
      if (selectedAttendance) {
        // Update existing record
        updateAttendance(selectedAttendance.id, attendanceData);
        toast({
          title: "Attendance Updated",
          description: "Attendance record has been updated successfully."
        });
      } else {
        // Add new record
        addAttendance(attendanceData);
        toast({
          title: "Attendance Added",
          description: "New attendance record has been added."
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast({
        title: "Error",
        description: "There was an error saving the attendance record.",
        variant: "destructive"
      });
    }
  };
  
  // Handle edit attendance
  const handleEditAttendance = (record: AttendanceType) => {
    setSelectedAttendance(record);
    
    setFormData({
      employeeId: record.employeeId,
      date: new Date(record.date),
      checkIn: record.checkIn ? format(new Date(record.checkIn), 'HH:mm') : '',
      checkOut: record.checkOut ? format(new Date(record.checkOut), 'HH:mm') : '',
      status: record.status,
      notes: record.notes
    });
    
    setIsAddingAttendance(true);
  };
  
  // Handle delete attendance
  const handleDeleteAttendance = (id: string) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      deleteAttendance(id);
      toast({
        title: "Attendance Deleted",
        description: "Attendance record has been deleted."
      });
    }
  };
  
  // Active employees for dropdown
  const activeEmployees = employees.filter(employee => employee.isActive);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Attendance Management</h1>
        
        <Button 
          onClick={() => setIsAddingAttendance(prev => !prev)}
          className="flex gap-2 items-center w-full sm:w-auto"
        >
          {isAddingAttendance ? (
            <span>Cancel</span>
          ) : (
            <>
              <UserCheck className="h-5 w-5" />
              <span>Mark Attendance</span>
            </>
          )}
        </Button>
      </div>
      
      {isAddingAttendance && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            {selectedAttendance ? 'Edit Attendance' : 'Mark Attendance'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="employee" className="block text-sm font-medium">
                  Employee
                </label>
                <Select 
                  value={formData.employeeId}
                  onValueChange={(value) => setFormData({...formData, employeeId: value})}
                  required
                >
                  <SelectTrigger id="employee" className="w-full">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {activeEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({...formData, date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="checkIn" className="block text-sm font-medium">
                  Check In Time
                </label>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-400" />
                  <Input 
                    id="checkIn" 
                    type="time"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="checkOut" className="block text-sm font-medium">
                  Check Out Time (leave blank if not checked out)
                </label>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-400" />
                  <Input 
                    id="checkOut" 
                    type="time"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <Select 
                  value={formData.status}
                  onValueChange={(value: 'Present' | 'Absent' | 'Half-day' | 'Late') => 
                    setFormData({...formData, status: value})}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                      <SelectItem value="Half-day">Half-day</SelectItem>
                      <SelectItem value="Late">Late</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-medium">
                  Notes
                </label>
                <Input 
                  id="notes" 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional notes"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedAttendance ? 'Update Attendance' : 'Save Attendance'}
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="space-y-1 flex-1">
          <label className="text-sm font-medium">Filter by Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, 'PPP') : <span>All dates</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-1 flex-1">
          <label className="text-sm font-medium">Filter by Employee</label>
          <Select 
            value={employeeFilter}
            onValueChange={setEmployeeFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {activeEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => {
            setEmployeeFilter('all');
            setDateFilter(undefined);
          }}
        >
          Reset Filters
        </Button>
      </div>
      
      {filteredAttendance.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map(record => {
                const employee = employees.find(e => e.id === record.employeeId);
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{employee?.name || 'Unknown'}</TableCell>
                    <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{record.checkIn ? format(new Date(record.checkIn), 'hh:mm a') : '-'}</TableCell>
                    <TableCell>{record.checkOut ? format(new Date(record.checkOut), 'hh:mm a') : '-'}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        record.status === 'Absent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        record.status === 'Half-day' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{record.notes || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditAttendance(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-app-red hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => handleDeleteAttendance(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md">
          <p className="text-app-gray-500 dark:text-app-gray-400">
            No attendance records found for the selected filters.
          </p>
          <Button onClick={() => setIsAddingAttendance(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" /> Mark Attendance
          </Button>
        </div>
      )}
    </div>
  );
};

export default Attendance;
