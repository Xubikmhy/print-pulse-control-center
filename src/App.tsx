
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./lib/context/app-context";
import Layout from "./components/layout/layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import AddEmployee from "./pages/AddEmployee";
import Tasks from "./pages/Tasks";
import AddTask from "./pages/AddTask";
import Attendance from "./pages/Attendance";
import Finances from "./pages/Finances";
import SalaryReports from "./pages/SalaryReports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Configure for offline only - disabling retries and caching aggressively
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      gcTime: Infinity
    },
  },
});

// Make sure we're using the same React instance consistently
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/employees" element={<Layout><Employees /></Layout>} />
              <Route path="/employees/new" element={<Layout><AddEmployee /></Layout>} />
              <Route path="/departments" element={<Layout><Departments /></Layout>} />
              <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
              <Route path="/tasks/new" element={<Layout><AddTask /></Layout>} />
              <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
              <Route path="/finances" element={<Layout><Finances /></Layout>} />
              <Route path="/salary-reports" element={<Layout><SalaryReports /></Layout>} />
              <Route path="/salary" element={<Navigate to="/salary-reports" replace />} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              {/* Catch all route - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
