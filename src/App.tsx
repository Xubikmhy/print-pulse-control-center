
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./lib/context/app-context";
import Layout from "./components/layout/layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
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

const App: React.FC = () => {
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
              <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
              <Route path="/tasks/new" element={<Layout><AddTask /></Layout>} />
              <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
              <Route path="/finances" element={<Layout><Finances /></Layout>} />
              <Route path="/salary-reports" element={<Layout><SalaryReports /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              <Route path="/salary" element={<Layout><SalaryReports /></Layout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
