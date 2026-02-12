import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import DashboardPage from "@/pages/dashboard";
import SymptomCheckPage from "@/pages/symptom-check";
import ChatAssistantPage from "@/pages/chat-assistant";
import LoginPage from "@/pages/login";
import PatientDashboard from "@/pages/patient-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/patient/dashboard" component={PatientDashboard} />
      
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/symptom-check" component={SymptomCheckPage} />
      <Route path="/chat" component={ChatAssistantPage} />
      
      {/* Clinician Sub-routes mapped to Dashboard for mockup */}
      <Route path="/dashboard/content" component={DashboardPage} />
      <Route path="/dashboard/reviews" component={DashboardPage} />
      <Route path="/dashboard/governance" component={DashboardPage} />
      <Route path="/dashboard/settings" component={DashboardPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
