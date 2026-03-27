import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";

// Pages
import Home from "@/pages/Home";
import Subjects from "@/pages/Subjects";
import SubjectDetail from "@/pages/SubjectDetail";
import Careers from "@/pages/Careers";
import CareerDetail from "@/pages/CareerDetail";
import Institutions from "@/pages/Institutions";
import Routes from "@/pages/Routes";
import Quiz from "@/pages/Quiz";
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

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/subjects" component={Subjects} />
        <Route path="/subjects/:id" component={SubjectDetail} />
        <Route path="/careers" component={Careers} />
        <Route path="/careers/:id" component={CareerDetail} />
        <Route path="/institutions" component={Institutions} />
        {/* Placeholder route for institution detail to prevent 404s if clicked */}
        <Route path="/institutions/:id" component={Institutions} /> 
        <Route path="/routes" component={Routes} />
        <Route path="/quiz" component={Quiz} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
