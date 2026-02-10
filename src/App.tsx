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
          <Route path="/dashboard" element={<Dashboard/>} />
           <Route path="/dev" element={<DevTalentComponent/>} />
           <Route path="/gallery" element={<FullPage />} />
             <Route path="/coddingExam" element={<CoddingExam />} />
             <Route path="/online-compiler" element={<OnlineCompiler />} />
             <Route path="/privacy" element={<Privacy />} />
             <Route path="/condition" element={<Conditions />} />
             {/* <Route path="/mcq" element={<MCQQuestionPaperCard />} /> */}
             <Route path="/examtab" element= {<ExamsTab />} />
               <Route path="/mcqpaper/:attemptId" element={<MCQPaper />} />
               <Route path="/login" element={<Login />} />
            
 



          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
