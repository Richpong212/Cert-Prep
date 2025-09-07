import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Landing from "./pages/Landing";
import FreeQuiz from "./pages/FreeQuiz";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import PracticeSession from "./pages/PracticeSession";
import PracticeResults from "./pages/PracticeResults";
import Tracks from "./pages/Tracks";
import TrackDetail from "./pages/TrackDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/free-quiz" element={<FreeQuiz />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/session" element={<PracticeSession />} />
            <Route path="/practice/results" element={<PracticeResults />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/tracks/:trackId" element={<TrackDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/exam" element={<Index />} />
            <Route path="/flashcards" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
