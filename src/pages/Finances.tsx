
import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Advance, SalaryDeduction } from '@/lib/types';
import { 
  CalendarIcon, DollarSign, Edit, 
  FileMinus, FilePlus, Plus, Trash2 
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Finances = () => {
  const { 
    employees, advances, deductions, 
    addAdvance, updateAdvance, deleteAdvance,
    addDeduction, updateDeduction, deleteDeduction,
    calculateRemainingBalance
  } = useApp();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('advances');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Form states for Advances
  const [isAddingAdvance, setIsAddingAdvance] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState<Advance | null>(null);
  const [advanceFormData, setAdvanceFormData] = useState({
    employeeId: '',
    amount: '',
    date: new Date(),
    description: '',
    isPaid: false
  });
  
  // Form states for Deductions
  const [isAddingDeduction, setIsAddingDeduction] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState<SalaryDeduction | null>(null);
  const [deductionFormData, setDeductionFormData] = useState({
    employeeId: '',
    amount: '',
    date: new Date(),
    reason: '',
    advanceId: undefined as string | undefined
  });
  
  // Filter states for advances & deductions
  const [employeeFilter, setEmployeeFilter] = useState('all');
  
  // Reset advance form
  const resetAdvanceForm = () => {
    setAdvanceFormData({
      employeeId: '',
      amount: '',
      date: new Date(),
      description: '',
      isPaid: false
    });
    setSelectedAdvance(null);
    setIsAddingAdvance(false);
  };
  
  // Reset deduction form
  const resetDeductionForm = () => {
    setDeductionFormData({
      employeeId: '',
      amount: '',
      date: new Date(),
      reason: '',
      advanceId: undefined
    });
    setSelectedDeduction(null);
    setIsAddingDeduction(false);
  };
  
  // Handle advance form submit
  const handleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const advanceData = {
        employeeId: advanceFormData.employeeId,
        amount: parseFloat(advanceFormData.amount),
        date: advanceFormData.date.toISOString(),
        description: advanceFormData.description,
        isPaid: advanceFormData.isPaid
      };
      
      if (selectedAdvance) {
        // Update existing advance
        updateAdvance(selectedAdvance.id, advanceData);
        toast({
          title: "Advance Updated",
          description: "Advance record has been updated successfully."
        });
      } else {
        // Add new advance
        addAdvance(advanceData);
        toast({
          title: "Advance Added",
          description: "New advance record has been added."
        });
      }
      
      resetAdvanceForm();
    } catch (error) {
      console.error('Error submitting advance:', error);
      toast({
        title: "Error",
        description: "There was an error saving the advance record.",
        variant: "destructive"
      });
    }
  };
  
  // Handle deduction form submit
  const handleDeductionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const deductionData = {
        employeeId: deductionFormData.employeeId,
        amount: parseFloat(deductionFormData.amount),
        date: deductionFormData.date.toISOString(),
        reason: deductionFormData.reason,
        advanceId: deductionFormData.advanceId
      };
      
      if (selectedDeduction) {
        // Update existing deduction
        updateDeduction(selectedDeduction.id, deductionData);
        toast({
          title: "Deduction Updated",
          description: "Deduction record has been updated successfully."
        });
      } else {
        // Add new deduction
        addDeduction(deductionData);
        toast({
          title: "Deduction Added",
          description: "New deduction record has been added."
        });
        
        // If this deduction is for an advance, mark the advance as paid
        if (deductionData.advanceId) {
          updateAdvance(deductionData.advanceId, { isPaid: true });
        }
      }
      
      resetDeductionForm();
    } catch (error) {
      console.error('Error submitting deduction:', error);
      toast({
        title: "Error",
        description: "There was an error saving the deduction record.",
        variant: "destructive"
      });
    }
  };
  
  // Handle edit advance
  const handleEditAdvance = (advance: Advance) => {
    setSelectedAdvance(advance);
    
    setAdvanceFormData({
      employeeId: advance.employeeId,
      amount: advance.amount.toString(),
      date: new Date(advance.date),
      description: advance.description,
      isPaid: advance.isPaid
    });
    
    setIsAddingAdvance(true);
  };
  
  // Handle delete advance
  const handleDeleteAdvance = (id: string) => {
    if (window.confirm('Are you sure you want to delete this advance record?')) {
      deleteAdvance(id);
      toast({
        title: "Advance Deleted",
        description: "Advance record has been deleted."
      });
    }
  };
  
  // Handle edit deduction
  const handleEditDeduction = (deduction: SalaryDeduction) => {
    setSelectedDeduction(deduction);
    
    setDeductionFormData({
      employeeId: deduction.employeeId,
      amount: deduction.amount.toString(),
      date: new Date(deduction.date),
      reason: deduction.reason,
      advanceId: deduction.advanceId
    });
    
    setIsAddingDeduction(true);
  };
  
  // Handle delete deduction
  const handleDeleteDeduction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this deduction record?')) {
      deleteDeduction(id);
      toast({
        title: "Deduction Deleted",
        description: "Deduction record has been deleted."
      });
    }
  };
  
  // Filter advances & deductions
  const filteredAdvances = advances.filter(adv => 
    employeeFilter === 'all' || adv.employeeId === employeeFilter
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const filteredDeductions = deductions.filter(ded => 
    employeeFilter === 'all' || ded.employeeId === employeeFilter
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get active employees for dropdown
  const activeEmployees = employees.filter(employee => employee.isActive);
  
  // Get unpaid advances for an employee
  const getUnpaidAdvancesForEmployee = (employeeId: string) => {
    return advances.filter(adv => adv.employeeId === employeeId && !adv.isPaid);
  };
  
  // Generate months array
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate years array (current year - 2 to current year + 1)
  const currentYearValue = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYearValue - 2 + i);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Financial Management</h1>
      
      <Tabs defaultValue="advances" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="advances">Advances</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="salary">Salary Summary</TabsTrigger>
        </TabsList>
        
        {/* Advances Tab */}
        <TabsContent value="advances">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">Advance Payments</h2>
            
            <Button 
              onClick={() => setIsAddingAdvance(prev => !prev)}
              className="flex gap-2 items-center w-full sm:w-auto"
            >
              {isAddingAdvance ? (
                <span>Cancel</span>
              ) : (
                <>
                  <FilePlus className="h-5 w-5" />
                  <span>Add Advance</span>
                </>
              )}
            </Button>
          </div>
          
          {isAddingAdvance && (
            <Card className="p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedAdvance ? 'Edit Advance' : 'Add Advance Payment'}
              </h3>
              
              <form onSubmit={handleAdvanceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="employee" className="block text-sm font-medium">
                      Employee
                    </label>
                    <Select 
                      value={advanceFormData.employeeId}
                      onValueChange={(value) => setAdvanceFormData({...advanceFormData, employeeId: value})}
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
                    <label htmlFor="amount" className="block text-sm font-medium">
                      Amount
                    </label>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                      <Input 
                        id="amount" 
                        type="number"
                        min="0"
                        step="0.01"
                        value={advanceFormData.amount}
                        onChange={(e) => setAdvanceFormData({...advanceFormData, amount: e.target.value})}
                        placeholder="0.00"
                        required
                        className="flex-1"
                      />
                    </div>
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
                          {advanceFormData.date ? format(advanceFormData.date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={advanceFormData.date}
                          onSelect={(date) => date && setAdvanceFormData({...advanceFormData, date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium">
                      Description
                    </label>
                    <Input 
                      id="description" 
                      value={advanceFormData.description}
                      onChange={(e) => setAdvanceFormData({...advanceFormData, description: e.target.value})}
                      placeholder="Purpose of advance"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 flex items-center">
                    <label htmlFor="isPaid" className="block text-sm font-medium mr-3">
                      Status:
                    </label>
                    <Select 
                      value={advanceFormData.isPaid ? "paid" : "unpaid"}
                      onValueChange={(value) => setAdvanceFormData({
                        ...advanceFormData, 
                        isPaid: value === "paid"
                      })}
                    >
                      <SelectTrigger id="isPaid" className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetAdvanceForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedAdvance ? 'Update Advance' : 'Save Advance'}
                  </Button>
                </div>
              </form>
            </Card>
          )}
          
          <div className="mb-4">
            <Select 
              value={employeeFilter}
              onValueChange={setEmployeeFilter}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Filter by Employee" />
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
          
          {filteredAdvances.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdvances.map(advance => {
                    const employee = employees.find(e => e.id === advance.employeeId);
                    return (
                      <TableRow key={advance.id}>
                        <TableCell className="font-medium">{employee?.name || 'Unknown'}</TableCell>
                        <TableCell>${advance.amount.toFixed(2)}</TableCell>
                        <TableCell>{format(new Date(advance.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{advance.description}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            advance.isPaid ? 
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {advance.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditAdvance(advance)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-app-red hover:bg-red-100 dark:hover:bg-red-900"
                              onClick={() => handleDeleteAdvance(advance.id)}
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
                No advance records found for the selected employee.
              </p>
              <Button onClick={() => setIsAddingAdvance(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" /> Add Advance
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Deductions Tab */}
        <TabsContent value="deductions">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">Salary Deductions</h2>
            
            <Button 
              onClick={() => setIsAddingDeduction(prev => !prev)}
              className="flex gap-2 items-center w-full sm:w-auto"
            >
              {isAddingDeduction ? (
                <span>Cancel</span>
              ) : (
                <>
                  <FileMinus className="h-5 w-5" />
                  <span>Add Deduction</span>
                </>
              )}
            </Button>
          </div>
          
          {isAddingDeduction && (
            <Card className="p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedDeduction ? 'Edit Deduction' : 'Add Salary Deduction'}
              </h3>
              
              <form onSubmit={handleDeductionSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="deduction-employee" className="block text-sm font-medium">
                      Employee
                    </label>
                    <Select 
                      value={deductionFormData.employeeId}
                      onValueChange={(value) => setDeductionFormData({...deductionFormData, employeeId: value})}
                      required
                    >
                      <SelectTrigger id="deduction-employee" className="w-full">
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
                    <label htmlFor="deduction-amount" className="block text-sm font-medium">
                      Amount
                    </label>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                      <Input 
                        id="deduction-amount" 
                        type="number"
                        min="0"
                        step="0.01"
                        value={deductionFormData.amount}
                        onChange={(e) => setDeductionFormData({...deductionFormData, amount: e.target.value})}
                        placeholder="0.00"
                        required
                        className="flex-1"
                      />
                    </div>
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
                          {deductionFormData.date ? format(deductionFormData.date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={deductionFormData.date}
                          onSelect={(date) => date && setDeductionFormData({...deductionFormData, date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="deduction-reason" className="block text-sm font-medium">
                      Reason
                    </label>
                    <Input 
                      id="deduction-reason" 
                      value={deductionFormData.reason}
                      onChange={(e) => setDeductionFormData({...deductionFormData, reason: e.target.value})}
                      placeholder="Reason for deduction"
                      required
                    />
                  </div>
                  
                  {deductionFormData.employeeId && (
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="advanceId" className="block text-sm font-medium">
                        Related to Advance (Optional)
                      </label>
                      <Select 
                        value={deductionFormData.advanceId}
                        onValueChange={(value) => setDeductionFormData({...deductionFormData, advanceId: value})}
                      >
                        <SelectTrigger id="advanceId" className="w-full">
                          <SelectValue placeholder="Select Advance (Optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={undefined}>None</SelectItem>
                          {getUnpaidAdvancesForEmployee(deductionFormData.employeeId).map((advance) => (
                            <SelectItem key={advance.id} value={advance.id}>
                              ${advance.amount.toFixed(2)} - {format(new Date(advance.date), 'MMM dd, yyyy')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetDeductionForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedDeduction ? 'Update Deduction' : 'Save Deduction'}
                  </Button>
                </div>
              </form>
            </Card>
          )}
          
          <div className="mb-4">
            <Select 
              value={employeeFilter}
              onValueChange={setEmployeeFilter}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Filter by Employee" />
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
          
          {filteredDeductions.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Related to Advance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeductions.map(deduction => {
                    const employee = employees.find(e => e.id === deduction.employeeId);
                    const relatedAdvance = deduction.advanceId ? 
                      advances.find(a => a.id === deduction.advanceId) : null;
                      
                    return (
                      <TableRow key={deduction.id}>
                        <TableCell className="font-medium">{employee?.name || 'Unknown'}</TableCell>
                        <TableCell>${deduction.amount.toFixed(2)}</TableCell>
                        <TableCell>{format(new Date(deduction.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{deduction.reason}</TableCell>
                        <TableCell>
                          {relatedAdvance ? `$${relatedAdvance.amount.toFixed(2)}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditDeduction(deduction)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-app-red hover:bg-red-100 dark:hover:bg-red-900"
                              onClick={() => handleDeleteDeduction(deduction.id)}
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
                No deduction records found for the selected employee.
              </p>
              <Button onClick={() => setIsAddingDeduction(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" /> Add Deduction
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Salary Summary Tab */}
        <TabsContent value="salary">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Monthly Salary Summary</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium mb-1">Select Employee</label>
                <Select 
                  value={employeeFilter === 'all' ? '' : employeeFilter}
                  onValueChange={setEmployeeFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium mb-1">Month</label>
                <Select 
                  value={currentMonth.toString()}
                  onValueChange={(value) => setCurrentMonth(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium mb-1">Year</label>
                <Select 
                  value={currentYear.toString()}
                  onValueChange={(value) => setCurrentYear(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {employeeFilter !== 'all' && employeeFilter !== '' ? (
              <Card className="p-4">
                {(() => {
                  const employee = employees.find(e => e.id === employeeFilter);
                  if (!employee) return <p>Select an employee to view salary details</p>;
                  
                  // Calculate salary
                  const remainingBalance = calculateRemainingBalance(
                    employee.id, 
                    currentMonth, 
                    currentYear
                  );
                  
                  // Get employee advances for the month
                  const employeeAdvances = advances.filter(adv => {
                    const advDate = new Date(adv.date);
                    return adv.employeeId === employee.id && 
                           advDate.getMonth() === currentMonth && 
                           advDate.getFullYear() === currentYear;
                  });
                  
                  // Get employee deductions for the month
                  const employeeDeductions = deductions.filter(ded => {
                    const dedDate = new Date(ded.date);
                    return ded.employeeId === employee.id && 
                           dedDate.getMonth() === currentMonth && 
                           dedDate.getFullYear() === currentYear;
                  });
                  
                  // Calculate totals
                  const totalAdvances = employeeAdvances.reduce((sum, adv) => sum + adv.amount, 0);
                  const totalDeductions = employeeDeductions.reduce((sum, ded) => sum + ded.amount, 0);
                  
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Base Salary</p>
                          <p className="text-xl font-semibold">${employee.salaryRate.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            {employee.salaryType === 'Hourly' ? 'Per Hour' : 'Per Month'}
                          </p>
                        </div>
                        
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Advances</p>
                          <p className="text-xl font-semibold text-orange-500">${totalAdvances.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{employeeAdvances.length} advance(s)</p>
                        </div>
                        
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Deductions</p>
                          <p className="text-xl font-semibold text-red-500">${totalDeductions.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{employeeDeductions.length} deduction(s)</p>
                        </div>
                        
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Net Salary</p>
                          <p className="text-xl font-semibold text-green-600">${remainingBalance.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">After all deductions</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Advances This Month</h3>
                          {employeeAdvances.length > 0 ? (
                            <div className="border rounded-md overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {employeeAdvances.map(advance => (
                                    <TableRow key={advance.id}>
                                      <TableCell>{format(new Date(advance.date), 'MMM dd')}</TableCell>
                                      <TableCell>${advance.amount.toFixed(2)}</TableCell>
                                      <TableCell>
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                          advance.isPaid ? 
                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                        }`}>
                                          {advance.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No advances for this month</p>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Deductions This Month</h3>
                          {employeeDeductions.length > 0 ? (
                            <div className="border rounded-md overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Reason</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {employeeDeductions.map(deduction => (
                                    <TableRow key={deduction.id}>
                                      <TableCell>{format(new Date(deduction.date), 'MMM dd')}</TableCell>
                                      <TableCell>${deduction.amount.toFixed(2)}</TableCell>
                                      <TableCell className="max-w-[150px] truncate">{deduction.reason}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No deductions for this month</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Card>
            ) : (
              <div className="text-center py-10 border rounded-md">
                <p className="text-app-gray-500 dark:text-app-gray-400">
                  Select an employee to view their salary details.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
