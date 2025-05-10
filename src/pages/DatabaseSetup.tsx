
import React, { useEffect, useState } from 'react';
import { useDatabaseSetup } from '@/hooks/use-database-setup';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Database, ServerCog, CheckCircle, XCircle, Package, Table, Play, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const DatabaseSetup = () => {
  const { 
    isSettingUp, 
    setupResult, 
    testResult, 
    checkConnection, 
    setupDatabase, 
    setupSampleData, 
    testQuery, 
    reset 
  } = useDatabaseSetup();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('setup');
  
  // Check connection on mount
  useEffect(() => {
    const initialCheck = async () => {
      await checkConnection();
    };
    initialCheck();
  }, []);
  
  const handleSetupDatabase = async () => {
    const result = await setupDatabase();
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Database tables created successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: `Failed to create tables: ${result.message}`,
        variant: 'destructive',
      });
    }
  };
  
  const handleSetupSampleData = async () => {
    const result = await setupSampleData();
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Sample data inserted successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: `Failed to insert sample data: ${result.message}`,
        variant: 'destructive',
      });
    }
  };
  
  const handleTestQuery = async () => {
    const result = await testQuery();
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Test query executed successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: `Failed to execute test query: ${result.message}`,
        variant: 'destructive',
      });
    }
  };
  
  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the database? This will delete all existing data.')) {
      const result = await reset();
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Database reset successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: `Failed to reset database: ${result.message}`,
          variant: 'destructive',
        });
      }
    }
  };
  
  const renderConnectionStatus = () => {
    if (!testResult) return <p>Checking connection...</p>;
    
    return testResult.success ? (
      <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20 mb-4">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <AlertTitle>Connected to Supabase</AlertTitle>
        <AlertDescription>{testResult.message || 'Database connection is active'}</AlertDescription>
      </Alert>
    ) : (
      <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20 mb-4">
        <XCircle className="h-5 w-5 text-red-500" />
        <AlertTitle>Connection Failed</AlertTitle>
        <AlertDescription>
          {testResult.message || 'Could not connect to database'}
          <p className="mt-2">Please check your environment variables in .env file.</p>
        </AlertDescription>
      </Alert>
    );
  };
  
  const renderTableStatus = () => {
    if (!setupResult?.tables) return null;
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Table Status</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">Table</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {setupResult.tables.map((table: any, index: number) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="px-4 py-2">{table.table}</td>
                  <td className="px-4 py-2">
                    {table.success ? (
                      <span className="flex items-center text-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {table.message || 'Created'}
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <XCircle className="h-4 w-4 mr-1" />
                        {table.error || 'Failed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  const renderTestResult = () => {
    if (!testResult?.departments || !testResult?.employees) return null;
    
    return (
      <div className="mt-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Departments ({testResult.departments.length})</h3>
          {testResult.departments.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {testResult.departments.map((dept: any) => (
                    <tr key={dept.id}>
                      <td className="px-4 py-2 text-sm">{dept.id}</td>
                      <td className="px-4 py-2">{dept.name}</td>
                      <td className="px-4 py-2">{dept.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No departments found</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Employees ({testResult.employees.length})</h3>
          {testResult.employees.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Position</th>
                    <th className="px-4 py-2 text-left">Tasks</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {testResult.employees.map((emp: any) => (
                    <tr key={emp.id}>
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">{emp.department}</td>
                      <td className="px-4 py-2">{emp.position}</td>
                      <td className="px-4 py-2">{emp.tasks?.length || 0} tasks</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No employees found</p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Database Setup</h1>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
      
      {renderConnectionStatus()}
      
      <Tabs defaultValue="setup" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="setup">
            <ServerCog className="h-4 w-4 mr-2" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="test">
            <Play className="h-4 w-4 mr-2" />
            Test
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="setup">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <Table className="h-5 w-5 mr-2" />
                  Database Tables
                </h2>
                <p className="text-app-gray-500 dark:text-app-gray-400 mt-1">
                  Create or update the necessary database tables in Supabase.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={handleSetupDatabase} disabled={isSettingUp}>
                    <Database className="h-4 w-4 mr-2" />
                    Setup Tables
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSetupSampleData}
                    disabled={isSettingUp}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Insert Sample Data
                  </Button>
                  {import.meta.env.DEV && (
                    <Button
                      variant="destructive"
                      onClick={handleReset}
                      disabled={isSettingUp}
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Reset Database
                    </Button>
                  )}
                </div>
              </div>
              
              {renderTableStatus()}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Test Database
                </h2>
                <p className="text-app-gray-500 dark:text-app-gray-400 mt-1">
                  Run test queries to verify that your database is correctly set up.
                </p>
                <div className="mt-4">
                  <Button onClick={handleTestQuery} disabled={isSettingUp}>
                    <Play className="h-4 w-4 mr-2" />
                    Run Test Query
                  </Button>
                </div>
              </div>
              
              {renderTestResult()}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseSetup;
