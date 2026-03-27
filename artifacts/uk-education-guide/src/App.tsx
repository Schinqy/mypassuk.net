import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { AiStudyProvider, useAiStudy } from "@/contexts/AiStudyContext";
import AiStudyAssistant from "@/components/AiStudyAssistant";

// Pages
import Home from "@/pages/Home";
import Subjects from "@/pages/Subjects";
import SubjectDetail from "@/pages/SubjectDetail";
import Careers from "@/pages/Careers";
import CareerDetail from "@/pages/CareerDetail";
import Institutions from "@/pages/Institutions";
import InstitutionDetail from "@/pages/InstitutionDetail";
import Routes from "@/pages/Routes";
import Quiz from "@/pages/Quiz";
import Editorial from "@/pages/Editorial";
import Timetable from "@/pages/Timetable";
import Pricing from "@/pages/Pricing";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function AppContent() {
  const { subjectName, subjectLevel, subjectCategory, keyTopics } = useAiStudy();

  return (
    <>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/subjects" component={Subjects} />
          <Route path="/subjects/:id" component={SubjectDetail} />
          <Route path="/careers" component={Careers} />
          <Route path="/careers/:id" component={CareerDetail} />
          <Route path="/institutions" component={Institutions} />
          <Route path="/institutions/:id" component={InstitutionDetail} />
          <Route path="/routes" component={Routes} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/editorial" component={Editorial} />
          <Route path="/timetable" component={Timetable} />
          <Route path="/pricing" component={Pricing} />
          <Route component={NotFound} />
        </Switch>
      </Layout>

      <AiStudyAssistant
        subjectName={subjectName}
        subjectLevel={subjectLevel}
        subjectCategory={subjectCategory}
        keyTopics={keyTopics}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AiStudyProvider>
            <AppContent />
          </AiStudyProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
