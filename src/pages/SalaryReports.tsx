
import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SalaryReports = () => {
  const { employees, calculateRemainingBalance } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Generate months array
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate years array (current year - 2 to current year + 1)
  const currentYearValue = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYearValue - 2 + i);

  // Calculate all employee salaries for the month
  const activeEmployees = employees.filter(employee => employee.isActive);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Salary Reports</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
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
        <div className="w-full md:w-1/2">
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
      
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Monthly Salary Summary - {months[currentMonth]} {currentYear}</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Salary Type</TableHead>
                <TableHead>Base Rate</TableHead>
                <TableHead>Net Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeEmployees.length > 0 ? (
                activeEmployees.map((employee) => {
                  const netSalary = calculateRemainingBalance(employee.id, currentMonth, currentYear);
                  
                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.position || 'N/A'}</TableCell>
                      <TableCell>{employee.salaryType}</TableCell>
                      <TableCell>
                        ${employee.salaryRate.toFixed(2)}
                        <span className="text-xs text-gray-500 ml-1">
                          {employee.salaryType === 'Hourly' ? '/hour' : '/month'}
                        </span>
                      </TableCell>
                      <TableCell>${netSalary.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No active employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default SalaryReports;
