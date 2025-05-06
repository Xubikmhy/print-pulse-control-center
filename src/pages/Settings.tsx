
import React, { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Download, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Settings = () => {
  const { companyInfo, updateCompanyInfo, exportData, importData, resetData } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  
  // Company info form state
  const [companyName, setCompanyName] = useState(companyInfo.name);
  const [companyAddress, setCompanyAddress] = useState(companyInfo.address);
  const [companyLogo, setCompanyLogo] = useState<string | null>(companyInfo.logo);
  
  // Import/Export form state
  const [importFile, setImportFile] = useState<File | null>(null);
  
  // Handle company info save
  const handleSaveCompanyInfo = () => {
    updateCompanyInfo({
      name: companyName,
      address: companyAddress,
      logo: companyLogo
    });
    
    toast({
      title: "Settings Saved",
      description: "Company information has been updated."
    });
  };
  
  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setCompanyLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle logo removal
  const handleRemoveLogo = () => {
    setCompanyLogo(null);
  };
  
  // Handle data export
  const handleExport = () => {
    const dataStr = exportData();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `printpulse-export-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully."
    });
  };
  
  // Handle data import
  const handleImport = () => {
    if (!importFile) {
      toast({
        title: "Error",
        description: "Please select a file to import.",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        importData(jsonData);
        
        toast({
          title: "Data Imported",
          description: "Your data has been imported successfully."
        });
        
        // Reset file input
        setImportFile(null);
        const fileInput = document.getElementById('import-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "There was an error importing your data.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(importFile);
  };
  
  // Handle data reset
  const handleReset = () => {
    resetData();
    
    toast({
      title: "Data Reset",
      description: "All data has been reset to default."
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>
        
        {/* Company Tab */}
        <TabsContent value="company">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            
            <div className="space-y-6">
              {/* Logo */}
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-app-gray-100 dark:bg-app-gray-800 overflow-hidden flex items-center justify-center">
                    {companyLogo ? (
                      <img 
                        src={companyLogo} 
                        alt={companyName} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-app-gray-400">
                        {companyName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      {companyLogo && (
                        <Button 
                          type="button" 
                          variant="outline"
                          className="ml-2"
                          onClick={handleRemoveLogo}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-app-gray-500">
                      Recommended: Square image, minimum 200x200px
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              {/* Company Address */}
              <div className="space-y-2">
                <Label htmlFor="company-address">Company Address</Label>
                <Textarea
                  id="company-address"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button onClick={handleSaveCompanyInfo}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Data Management Tab */}
        <TabsContent value="data">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Data Management</h2>
            
            <div className="space-y-8">
              {/* Export Data */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">Export Data</h3>
                <p className="text-app-gray-500 mb-4">
                  Export all your data as a JSON file. This includes employees, tasks, attendance records, and financial data.
                </p>
                <Button onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
              
              {/* Import Data */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">Import Data</h3>
                <p className="text-app-gray-500 mb-4">
                  Import data from a previously exported JSON file. This will replace all your current data.
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  />
                  <Button onClick={handleImport} disabled={!importFile}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
              
              {/* Reset Data */}
              <div>
                <h3 className="text-lg font-medium mb-2">Reset Data</h3>
                <p className="text-app-gray-500 mb-4">
                  Reset all data to default. This action cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Reset All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your data
                        including employees, tasks, attendance records, and financial information.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset}>Yes, Reset All Data</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
