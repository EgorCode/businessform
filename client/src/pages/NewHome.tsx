import { useState } from "react";
import Header from "@/components/Header";
import NewHero from "@/components/NewHero";
import ArchetypeSelector from "@/components/ArchetypeSelector";
import IdeaGenerator from "@/components/IdeaGenerator";
import { TestimonialsSplit } from "@/components/ui/split-testimonial";
import WorkExperienceTracker from "@/components/WorkExperienceTracker";
import SelfEmploymentRegistration from "@/components/SelfEmploymentRegistration";
import SocialInsuranceGuide from "@/components/SocialInsuranceGuide";


import NewsFeed from "@/components/NewsFeed";
import FeaturedArticles from "@/components/FeaturedArticles";
import Footer from "@/components/Footer";
import EnhancedAIAssistant from "@/components/EnhancedAIAssistant";

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
      document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
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
        <NewsFeed />
        <FeaturedArticles />
        <IdeaGenerator />
        <section id="testimonials">
          <TestimonialsSplit />
        </section>

        <WorkExperienceTracker />
        <SelfEmploymentRegistration />
        <SocialInsuranceGuide />


      </main>
      <Footer />
      <EnhancedAIAssistant
        isMinimized={isChatMinimized}
        onToggle={() => setIsChatMinimized(!isChatMinimized)}
      />
    </div >
  );
}

