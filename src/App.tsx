import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Terms from "./pages/Terms";
import Overview from "./pages/Overview";
import Exam from "./pages/Exam";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import DevTalentComponent from "./pages/Dev";
import FullPage from "./pages/gallery";
import CoddingExam from "./pages/CoddingExam ";
import OnlineCompiler from "./pages/OnlineCompiler";
import Privacy from "./pages/Privacy";
import Conditions from "./pages/Conditions";
// import MCQQuestionPaperCard from "./components/MCQQuestionPaperCard";
import ExamsTab from "./pages/ExamsTab";
import MCQPaper from "./pages/MCQPaper";
import Login from "./pages/Login";
import ImpactSection from "./pages/ImpactSection";
import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import Individual from "./pages/Individual";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Success1 from "./pages/Success1";
import Registration from "./pages/Registration";
import Performance from "./pages/Performance";
import Payments from "./pages/Payments";
import Certificate from "./pages/Certificate";
import IndividualOverview from "./pages/IndividualOverview";
import IndividualTerms from "./pages/IndividualTerms";
import UpgradePage from "./pages/UpgradePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/success" element={<Success />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dev" element={<DevTalentComponent />} />
          <Route path="/gallery" element={<FullPage />} />
          <Route path="/coddingExam" element={<CoddingExam />} />
          <Route path="/online-compiler" element={<OnlineCompiler />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/condition" element={<Conditions />} />
          {/* <Route path="/mcq" element={<MCQQuestionPaperCard />} /> */}
          <Route path="/examtab" element={<ExamsTab />} />
          <Route path="/mcqpaper/:attemptId" element={<MCQPaper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/impactsection" element={<ImpactSection />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/individual" element={<Individual />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/success1" element={<Success1 />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/individualoverview" element={<IndividualOverview />} />
          <Route path="/individualterms" element={<IndividualTerms />} />
          <Route path="/upgrade" element={<UpgradePage />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
