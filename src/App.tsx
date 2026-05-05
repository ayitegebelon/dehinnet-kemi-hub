import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import PeriodicTablePage from "./pages/PeriodicTablePage";
import RecipeCalculatorPage from "./pages/RecipeCalculatorPage";
import SafetyChecklistPage from "./pages/SafetyChecklistPage";
import ProjectsPage from "./pages/ProjectsPage";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NotificationsPage from "./pages/NotificationsPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import LabNotebookPage from "./pages/LabNotebookPage";
import MoleculeBuilderPage from "./pages/MoleculeBuilderPage";
import ReactionSimulatorPage from "./pages/ReactionSimulatorPage";
import LabTimerPage from "./pages/LabTimerPage";
import WhatIfPage from "./pages/WhatIfPage";
import HumanImpactPage from "./pages/HumanImpactPage";
import SimplifyPage from "./pages/SimplifyPage";
import EnvironmentPage from "./pages/EnvironmentPage";
import LabelInterpreterPage from "./pages/LabelInterpreterPage";
import RiskEnginePage from "./pages/RiskEnginePage";
import EmergencyResponsePage from "./pages/EmergencyResponsePage";
import LabSafetyScorePage from "./pages/LabSafetyScorePage";
import ChemicalDatabasePage from "./pages/ChemicalDatabasePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
    <Route path="/periodic-table" element={<ProtectedRoute><PeriodicTablePage /></ProtectedRoute>} />
    <Route path="/calculator" element={<ProtectedRoute><RecipeCalculatorPage /></ProtectedRoute>} />
    <Route path="/safety" element={<ProtectedRoute><SafetyChecklistPage /></ProtectedRoute>} />
    <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
    <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
    <Route path="/lab-notebook" element={<ProtectedRoute><LabNotebookPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
    <Route path="/molecule-builder" element={<ProtectedRoute><MoleculeBuilderPage /></ProtectedRoute>} />
    <Route path="/reaction-simulator" element={<ProtectedRoute><ReactionSimulatorPage /></ProtectedRoute>} />
    <Route path="/lab-timer" element={<ProtectedRoute><LabTimerPage /></ProtectedRoute>} />
    {/* New AI Safety features */}
    <Route path="/what-if" element={<ProtectedRoute><WhatIfPage /></ProtectedRoute>} />
    <Route path="/human-impact" element={<ProtectedRoute><HumanImpactPage /></ProtectedRoute>} />
    <Route path="/simplify" element={<ProtectedRoute><SimplifyPage /></ProtectedRoute>} />
    <Route path="/environment" element={<ProtectedRoute><EnvironmentPage /></ProtectedRoute>} />
    <Route path="/label-interpreter" element={<ProtectedRoute><LabelInterpreterPage /></ProtectedRoute>} />
    <Route path="/risk-engine" element={<ProtectedRoute><RiskEnginePage /></ProtectedRoute>} />
    <Route path="/emergency-response" element={<ProtectedRoute><EmergencyResponsePage /></ProtectedRoute>} />
    <Route path="/lab-safety-score" element={<ProtectedRoute><LabSafetyScorePage /></ProtectedRoute>} />
    <Route path="/chemicals" element={<ProtectedRoute><ChemicalDatabasePage /></ProtectedRoute>} />
    {/* Redirect removed routes */}
    <Route path="/learn/*" element={<Navigate to="/dashboard" replace />} />
    <Route path="/flashcards" element={<Navigate to="/dashboard" replace />} />
    <Route path="/element-quiz" element={<Navigate to="/dashboard" replace />} />
    <Route path="/certificates" element={<Navigate to="/dashboard" replace />} />
    <Route path="/verify/*" element={<Navigate to="/" replace />} />
    <Route path="/discussion" element={<Navigate to="/dashboard" replace />} />
    <Route path="/leaderboard" element={<Navigate to="/dashboard" replace />} />
    <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
    <Route path="/subscription" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
