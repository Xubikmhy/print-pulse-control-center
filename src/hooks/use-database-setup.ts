
import { useState } from 'react';
import { setupTables, insertSampleData, runTestQuery, resetDatabase } from '@/lib/db/setup';
import { testConnection } from '@/lib/db/config';

export function useDatabaseSetup() {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupResult, setSetupResult] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  
  // Test connection to Supabase
  const checkConnection = async () => {
    setIsSettingUp(true);
    try {
      const result = await testConnection();
      setTestResult(result);
      return result;
    } catch (error: any) {
      setTestResult({ success: false, message: error.message });
      return { success: false, message: error.message };
    } finally {
      setIsSettingUp(false);
    }
  };
  
  // Set up database tables
  const setupDatabase = async () => {
    setIsSettingUp(true);
    try {
      const tables = await setupTables();
      setSetupResult({ tables });
      return { success: true, tables };
    } catch (error: any) {
      setSetupResult({ success: false, message: error.message });
      return { success: false, message: error.message };
    } finally {
      setIsSettingUp(false);
    }
  };
  
  // Insert sample data
  const setupSampleData = async () => {
    setIsSettingUp(true);
    try {
      const result = await insertSampleData();
      setSetupResult({ ...setupResult, sampleData: result });
      return result;
    } catch (error: any) {
      setSetupResult({ ...setupResult, sampleData: { success: false, message: error.message } });
      return { success: false, message: error.message };
    } finally {
      setIsSettingUp(false);
    }
  };
  
  // Run test query
  const testQuery = async () => {
    setIsSettingUp(true);
    try {
      const result = await runTestQuery();
      setTestResult(result);
      return result;
    } catch (error: any) {
      setTestResult({ success: false, message: error.message });
      return { success: false, message: error.message };
    } finally {
      setIsSettingUp(false);
    }
  };
  
  // Reset database (for development)
  const reset = async () => {
    setIsSettingUp(true);
    try {
      const result = await resetDatabase();
      setSetupResult({ reset: result });
      return result;
    } catch (error: any) {
      setSetupResult({ reset: { success: false, message: error.message } });
      return { success: false, message: error.message };
    } finally {
      setIsSettingUp(false);
    }
  };
  
  return {
    isSettingUp,
    setupResult,
    testResult,
    checkConnection,
    setupDatabase,
    setupSampleData,
    testQuery,
    reset
  };
}
