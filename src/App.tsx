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
import Subscription from "./pages/Subscription";
import Profile from "./pages/Profile";
import LearnPage from "./pages/LearnPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import DiscussionPage from "./pages/DiscussionPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotificationsPage from "./pages/NotificationsPage";
import CertificatesPage from "./pages/CertificatesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
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
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
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
      <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
      <Route path="/learn/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
      <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
      <Route path="/discussion" element={<ProtectedRoute><DiscussionPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

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
