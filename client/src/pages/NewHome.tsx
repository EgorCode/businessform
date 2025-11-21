import { useState } from "react";
import Header from "@/components/Header";
import NewHero from "@/components/NewHero";
import ArchetypeSelector from "@/components/ArchetypeSelector";
import IdeaGenerator from "@/components/IdeaGenerator";
import BloggerCaseStudy from "@/components/BloggerCaseStudy";
import StressTestSimulator from "@/components/StressTestSimulator";
import TaxCalculator from "@/components/TaxCalculator";
import DocumentLibrary from "@/components/DocumentLibrary";
import KnowledgeBase from "@/components/KnowledgeBase";
import Footer from "@/components/Footer";
import AIAdvisorChat from "@/components/AIAdvisorChat";

export default function NewHome() {
  const [showArchetypeSelector, setShowArchetypeSelector] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  const handleArchetypeSelect = (archetypeId: string) => {
    setSelectedArchetype(archetypeId);
    setShowArchetypeSelector(false);
    console.log('Selected archetype:', archetypeId);
    // Scroll to next section after selection
    setTimeout(() => {
      document.getElementById('case-study')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
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
        <NewHero />
        <IdeaGenerator />
        <section id="case-study">
          <BloggerCaseStudy />
        </section>
        <StressTestSimulator />
        <TaxCalculator />
        <DocumentLibrary />
        <KnowledgeBase />
      </main>
      <Footer />
      <AIAdvisorChat 
        isMinimized={isChatMinimized}
        onToggle={() => setIsChatMinimized(!isChatMinimized)}
      />
    </div>
  );
}
