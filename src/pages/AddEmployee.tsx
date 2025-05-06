import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { addEmployee, departments } = useApp();
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [joiningDate, setJoiningDate] = React.useState(
    new Date().toISOString().split('T')[0]
  );
  const [employmentType, setEmploymentType] = React.useState('Full-time');
  const [salaryType, setSalaryType] = React.useState('Hourly');
  const [salaryRate, setSalaryRate] = React.useState(0);

  React.useEffect(() => {
    // Set default department if available
    if (departments.length > 0 && !department) {
      setDepartment(departments[0].name);
    }
  }, [departments, department]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !department || !phone || !email || !joiningDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addEmployee({
      name,
      department,
      position,
      phone,
      email,
      joiningDate,
      employmentType: employmentType as any,
      salaryType: salaryType as any,
      salaryRate,
      isActive: true
    });

    toast({
      title: "Employee Added",
      description: `${name} has been added successfully.`,
    });

    navigate('/employees');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/employees')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-app-gray-900 dark:text-white">
            Add New Employee
          </h1>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-app-red">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Department <span className="text-app-red">*</span>
                </label>
                <select
                  id="department"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  {departments.length > 0 ? (
                    departments.map(dept => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Printing">Printing</option>
                      <option value="Design">Design</option>
                      <option value="Binding">Binding</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Management">Management</option>
                      <option value="Others">Others</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">
                  Position <span className="text-app-red">*</span>
                </label>
                <input
                  id="position"
                  type="text"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone <span className="text-app-red">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-app-red">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="joining-date" className="text-sm font-medium">
                  Joining Date <span className="text-app-red">*</span>
                </label>
                <input
                  id="joining-date"
                  type="date"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="employment-type" className="text-sm font-medium">
                  Employment Type
                </label>
                <select
                  id="employment-type"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contractual">Contractual</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="salary-type" className="text-sm font-medium">
                  Salary Type
                </label>
                <select
                  id="salary-type"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                >
                  <option value="Hourly">Hourly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="salary-rate" className="text-sm font-medium">
                  {salaryType === 'Hourly' ? 'Hourly Rate' : 'Monthly Salary'}
                </label>
                <input
                  id="salary-rate"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
                  value={salaryRate}
                  onChange={(e) => setSalaryRate(parseFloat(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/employees')}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto flex gap-2 items-center"
              >
                <Save className="h-4 w-4" />
                Save Employee
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddEmployee;
