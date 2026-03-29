
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import { CreditsProvider } from "@/contexts/CreditsContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Analyze from "./pages/Analyze";
import Creations from "./pages/Creations";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Add Plus Jakarta Sans font link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap';
    document.head.appendChild(link);

    // Apply Plus Jakarta Sans font to body
    document.body.classList.add('font-jakarta');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CreditsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/analyze" element={
                  <ProtectedRoute>
                    <Analyze />
                  </ProtectedRoute>
                } />
                <Route path="/creations" element={
                  <ProtectedRoute>
                    <Creations />
                  </ProtectedRoute>
                } />
                <Route path="/collections/:id" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CreditsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
