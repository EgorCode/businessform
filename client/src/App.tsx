import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIAssistantProvider, useAIAssistant } from "@/contexts/AIAssistantContext";
import EnhancedAIAssistant from "@/components/EnhancedAIAssistant";
import NewHome from "@/pages/NewHome";
import AIHome from "@/pages/AIHome";
import AIAnalysisPage from "@/pages/AIAnalysisPage";
import AIDemoPage from "@/pages/AIDemoPage";
import AINavigationPage from "@/pages/AINavigationPage";
import AIImplementationPage from "@/pages/AIImplementationPage";
import StartPage from "@/pages/StartPage";
import WizardPage from "@/pages/WizardPage";
import ComparisonPage from "@/pages/ComparisonPage";
import CalculatorsPage from "@/pages/CalculatorsPage";
import DocumentsPage from "@/pages/DocumentsPage";
import KnowledgePage from "@/pages/KnowledgePage";
import NewsPage from "@/pages/NewsPage";
import NewsDetailPage from "@/pages/NewsDetailPage";
import AdminNewsPage from "@/pages/AdminNewsPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import ScrollbarDemo from "@/components/ScrollbarDemo";
import ScrollTestPage from "@/components/ScrollTestPage";
import CaseStudiesPage from "@/pages/CaseStudiesPage";
import AboutPage from "@/pages/AboutPage";
import FAQPage from "@/pages/FAQPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={NewHome} />
      <Route path="/old-home" component={AIHome} />
      <Route path="/ai-analysis" component={AIAnalysisPage} />
      <Route path="/ai-demo" component={AIDemoPage} />
      <Route path="/ai-tools" component={AINavigationPage} />
      <Route path="/ai-implementation" component={AIImplementationPage} />
      <Route path="/start" component={StartPage} />
      <Route path="/wizard" component={WizardPage} />
      <Route path="/comparison" component={ComparisonPage} />
      <Route path="/case-studies" component={CaseStudiesPage} />
      <Route path="/calculators" component={CalculatorsPage} />
      <Route path="/documents" component={DocumentsPage} />
      <Route path="/knowledge" component={KnowledgePage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:id" component={NewsDetailPage} />
      <Route path="/admin/news" component={AdminNewsPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/scrollbar-demo" component={ScrollbarDemo} />
      <Route path="/scroll-test" component={ScrollTestPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/faq" component={FAQPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AIAssistantProvider>
          <Router />
          <EnhancedAIAssistantWrapper />
          <Toaster />
        </AIAssistantProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Обертка для управления состоянием EnhancedAIAssistant
function EnhancedAIAssistantWrapper() {
  const { isMinimized } = useAIAssistant();

  if (isMinimized) {
    return null; // Не рендерим чат, если он минимизирован
  }

  return <EnhancedAIAssistant />;
}

export default App;
