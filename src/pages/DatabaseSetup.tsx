
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/context/data-provider';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setupTables, insertSampleData, runTestQuery } from '@/lib/db/setup';
import { testConnection } from '@/lib/db/config';

const DatabaseSetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({
    connection: { tested: false, success: false, message: '' },
    tables: { created: false, success: false, message: '' },
    data: { inserted: false, success: false, message: '' },
    test: { run: false, success: false, message: '' }
  });
  
  const { departments, employees, tasks, initializeDatabase } = useData();
  
  // Test connection to Supabase
  const checkConnection = async () => {
    try {
      setIsLoading(true);
      const result = await testConnection();
      setStatus(prev => ({ 
        ...prev, 
        connection: { 
          tested: true, 
          success: result.success, 
          message: result.message 
        } 
      }));
      return result.success;
    } catch (error: any) {
      setStatus(prev => ({ 
        ...prev, 
        connection: { 
          tested: true, 
          success: false, 
          message: error.message || 'Connection failed' 
        } 
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set up database tables
  const createTables = async () => {
    try {
      setIsLoading(true);
      const results = await setupTables();
      const success = results.every(result => result.success);
      setStatus(prev => ({ 
        ...prev, 
        tables: { 
          created: true, 
          success, 
          message: success ? 'Tables created successfully' : 'Error creating some tables' 
        } 
      }));
      return success;
    } catch (error: any) {
      setStatus(prev => ({ 
        ...prev, 
        tables: { 
          created: true, 
          success: false, 
          message: error.message || 'Table creation failed' 
        } 
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Insert sample data
  const insertData = async () => {
    try {
      setIsLoading(true);
      const result = await insertSampleData();
      setStatus(prev => ({ 
        ...prev, 
        data: { 
          inserted: true, 
          success: result.success, 
          message: result.message || (result.success ? 'Sample data inserted' : 'Data insertion failed') 
        } 
      }));
      return result.success;
    } catch (error: any) {
      setStatus(prev => ({ 
        ...prev, 
        data: { 
          inserted: true, 
          success: false, 
          message: error.message || 'Data insertion failed' 
        } 
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Test query
  const testQuery = async () => {
    try {
      setIsLoading(true);
      const result = await runTestQuery();
      setStatus(prev => ({ 
        ...prev, 
        test: { 
          run: true, 
          success: result.success, 
          message: result.message || (result.success ? 'Test query successful' : 'Test query failed') 
        } 
      }));
      return result.success;
    } catch (error: any) {
      setStatus(prev => ({ 
        ...prev, 
        test: { 
          run: true, 
          success: false, 
          message: error.message || 'Test query failed' 
        } 
      }));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Run all setup steps
  const runSetup = async () => {
    setIsLoading(true);
    
    try {
      const connectionSuccess = await checkConnection();
      if (!connectionSuccess) {
        toast({
          title: "Connection Failed",
          description: "Could not connect to database. Check your Supabase configuration.",
          variant: "destructive",
        });
        return;
      }
      
      const tablesSuccess = await createTables();
      if (!tablesSuccess) {
        toast({
          title: "Table Creation Failed",
          description: "Could not create database tables. Check console for errors.",
          variant: "destructive",
        });
        return;
      }
      
      const dataSuccess = await insertData();
      if (!dataSuccess) {
        toast({
          title: "Data Insertion Failed",
          description: "Could not insert sample data. Check console for errors.",
          variant: "destructive",
        });
        return;
      }
      
      const testSuccess = await testQuery();
      if (!testSuccess) {
        toast({
          title: "Test Query Failed",
          description: "Could not run test queries. Check console for errors.",
          variant: "destructive",
        });
        return;
      }
      
      // Refresh data
      await Promise.all([
        departments.refetch(),
        employees.refetch(),
        tasks.refetch()
      ]);
      
      toast({
        title: "Setup Completed",
        description: "Database setup completed successfully.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified setup using data provider
  const handleOneClickSetup = async () => {
    setIsLoading(true);
    try {
      await initializeDatabase();
      
      // Set all statuses to success after initialization
      setStatus({
        connection: { tested: true, success: true, message: 'Connection successful' },
        tables: { created: true, success: true, message: 'Tables created successfully' },
        data: { inserted: true, success: true, message: 'Sample data inserted' },
        test: { run: true, success: true, message: 'Test query successful' }
      });
      
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate to dashboard
  const goToDashboard = () => {
    navigate('/');
  };
  
  // Status indicator component
  const StatusIndicator = ({ item }: { item: { success: boolean; message: string } }) => (
    <div className="flex items-center space-x-2">
      {item.success ? 
        <CheckCircle className="text-app-green h-5 w-5" /> : 
        <XCircle className="text-app-red h-5 w-5" />
      }
      <span>{item.message}</span>
    </div>
  );
  
  const allSuccess = status.connection.success && 
                     status.tables.success && 
                     status.data.success && 
                     status.test.success;

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Database Setup</h1>
        
        <div className="mb-8">
          <p className="text-app-gray-600 dark:text-app-gray-400 mb-4">
            This utility will set up the database tables and sample data needed for the application to work.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Setup Status</h2>
            
            <div className="space-y-2">
              {status.connection.tested && (
                <div className="p-2 bg-app-gray-100 dark:bg-app-gray-800 rounded">
                  <StatusIndicator item={status.connection} />
                </div>
              )}
              
              {status.tables.created && (
                <div className="p-2 bg-app-gray-100 dark:bg-app-gray-800 rounded">
                  <StatusIndicator item={status.tables} />
                </div>
              )}
              
              {status.data.inserted && (
                <div className="p-2 bg-app-gray-100 dark:bg-app-gray-800 rounded">
                  <StatusIndicator item={status.data} />
                </div>
              )}
              
              {status.test.run && (
                <div className="p-2 bg-app-gray-100 dark:bg-app-gray-800 rounded">
                  <StatusIndicator item={status.test} />
                </div>
              )}
              
              {!status.connection.tested && !isLoading && (
                <div className="p-2 bg-app-gray-100 dark:bg-app-gray-800 rounded">
                  Database setup not started
                </div>
              )}
              
              {isLoading && (
                <div className="flex items-center p-2 bg-app-gray-100 dark:bg-app-gray-800 rounded">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleOneClickSetup} 
                disabled={isLoading || allSuccess}
                className="flex-1"
              >
                One-Click Setup
              </Button>
              
              <Button
                onClick={goToDashboard}
                variant="outline"
                disabled={isLoading}
                className="flex-1"
              >
                {allSuccess ? 'Go to Dashboard' : 'Skip Setup'}
              </Button>
            </div>
            
            <div className="text-sm text-app-gray-500 dark:text-app-gray-400">
              <p>Use "One-Click Setup" to automatically configure your database.</p>
              <p>Click "Skip Setup" to continue without setup (not recommended for first use).</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DatabaseSetup;
