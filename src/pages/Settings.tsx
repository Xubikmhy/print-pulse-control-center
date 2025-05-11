
import React from 'react';
import { useApp } from '@/lib/context/app-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/lib/context/data-provider';
import { useToast } from '@/hooks/use-toast';
import { testConnection } from '@/lib/db/config';

const Settings = () => {
  const { companyInfo, updateCompanyInfo } = useApp();
  const { initializeDatabase } = useData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  // Company info form state
  const [formData, setFormData] = React.useState({
    name: companyInfo?.name || '',
    address: companyInfo?.address || '',
    logo: companyInfo?.logo || ''
  });
  
  // Update form when company info changes
  React.useEffect(() => {
    if (companyInfo) {
      setFormData({
        name: companyInfo.name,
        address: companyInfo.address,
        logo: companyInfo.logo || ''
      });
    }
  }, [companyInfo]);
  
  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo(formData);
    toast({
      title: "Settings Updated",
      description: "Company information has been updated successfully.",
    });
  };
  
  // Test database connection
  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testConnection();
      setConnectionStatus(result);
      toast({
        title: result.success ? "Connection Successful" : "Connection Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error: any) {
      setConnectionStatus({
        success: false,
        message: error.message || "Unknown error occurred"
      });
      toast({
        title: "Connection Failed",
        description: error.message || "An error occurred while testing connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize database
  const handleInitializeDatabase = async () => {
    setIsLoading(true);
    try {
      await initializeDatabase();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-app-gray-900 dark:text-white">
        Settings
      </h1>
      
      {/* Database Connection */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Button 
              onClick={handleTestConnection} 
              disabled={isLoading}
              variant="outline"
            >
              Test Connection
            </Button>
            
            <Button 
              onClick={handleInitializeDatabase} 
              disabled={isLoading}
              variant="default"
            >
              Initialize Database
            </Button>
            
            {connectionStatus && (
              <div className={`text-sm ${connectionStatus.success ? 'text-app-green' : 'text-app-red'}`}>
                {connectionStatus.message}
              </div>
            )}
          </div>
          
          <div className="text-sm text-app-gray-600 dark:text-app-gray-400">
            <p className="mb-2">Testing the connection validates your database configuration.</p>
            <p>Initializing the database will set up all required tables and sample data.</p>
          </div>
        </div>
      </Card>
      
      {/* Company Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Company Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Company Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
              required
            />
          </div>
          
          <div>
            <label htmlFor="logo" className="block text-sm font-medium mb-1">
              Logo URL (optional)
            </label>
            <input
              id="logo"
              name="logo"
              value={formData.logo || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md dark:bg-app-gray-800 dark:border-app-gray-700"
            />
          </div>
          
          <Button type="submit" className="mt-4">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
