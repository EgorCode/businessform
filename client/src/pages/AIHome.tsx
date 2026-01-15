import { useState } from "react";
import Header from "@/components/Header";
import AIHeroSection from "@/components/AIHeroSection";
import { useAIAssistant } from "@/contexts/AIAssistantContext";
import ArchetypeSelector from "@/components/ArchetypeSelector";
import IdeaGenerator from "@/components/IdeaGenerator";
import BloggerCaseStudy from "@/components/BloggerCaseStudy";
import StressTestSimulator from "@/components/StressTestSimulator";
import TaxCalculator from "@/components/TaxCalculator";
import WorkExperienceTracker from "@/components/WorkExperienceTracker";
import SelfEmploymentRegistration from "@/components/SelfEmploymentRegistration";
import SocialInsuranceGuide from "@/components/SocialInsuranceGuide";
import PracticalFAQ from "@/components/PracticalFAQ";
import DocumentLibrary from "@/components/DocumentLibrary";
import KnowledgeBase from "@/components/KnowledgeBase";
import NewsHighlight from "@/components/news/NewsHighlight";
import Footer from "@/components/Footer";

export default function AIHome() {
  const { toggleMinimized } = useAIAssistant();
  const [showArchetypeSelector, setShowArchetypeSelector] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);

  const handleArchetypeSelect = (archetypeId: string) => {
    setSelectedArchetype(archetypeId);
    setShowArchetypeSelector(false);
    console.log('Selected archetype:', archetypeId);
    // Scroll to next section after selection
    setTimeout(() => {
      document.getElementById('case-study')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleStartChat = () => {
    toggleMinimized(); // Используем глобальный toggleMinimized
  };

  const handleStartWizard = () => {
    setShowArchetypeSelector(true);
  };

  if (showArchetypeSelector && !selectedArchetype) {
    return (
      <div className="min-h-screen">
        <ArchetypeSelector onSelect={handleArchetypeSelect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AIHeroSection
          onStartChat={handleStartChat}
          onStartWizard={handleStartWizard}
        />
        
        <NewsHighlight limit={3} />
        
        <IdeaGenerator />
        <section id="case-study">
          <BloggerCaseStudy />
        </section>
        <StressTestSimulator />
        <TaxCalculator />
        <WorkExperienceTracker />
        <SelfEmploymentRegistration />
        <SocialInsuranceGuide />
        <PracticalFAQ />
        <DocumentLibrary />
        <KnowledgeBase />
      </main>
      <Footer />
    </div>
  );
}