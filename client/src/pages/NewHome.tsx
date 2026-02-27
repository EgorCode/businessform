import { useState, lazy, Suspense } from "react";
import Header from "@/components/Header";
import NewHero from "@/components/NewHero";
import ArchetypeSelector from "@/components/ArchetypeSelector";
import IdeaGenerator from "@/components/IdeaGenerator";
import Footer from "@/components/Footer";
import EnhancedAIAssistant from "@/components/EnhancedAIAssistant";
import { useHashScroll } from "@/hooks/useHashScroll";
import { Skeleton } from "@/components/ui/skeleton";

// Ленивая загрузка для компонентов "ниже сгиба" страницы
const NewsFeed = lazy(() => import("@/components/NewsFeed"));
const TestimonialsSplit = lazy(() => import("@/components/ui/split-testimonial").then(m => ({ default: m.TestimonialsSplit })));
const WorkExperienceTracker = lazy(() => import("@/components/WorkExperienceTracker"));
const SelfEmploymentRegistration = lazy(() => import("@/components/SelfEmploymentRegistration"));
const SocialInsuranceGuide = lazy(() => import("@/components/SocialInsuranceGuide"));
const FeaturedArticles = lazy(() => import("@/components/FeaturedArticles"));

const SectionSkeleton = () => (
  <div className="py-20 max-w-7xl mx-auto px-4 w-full">
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/3 mb-10" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  </div>
);

export default function NewHome() {
  const [showArchetypeSelector, setShowArchetypeSelector] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  useHashScroll();

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
        <Suspense fallback={<SectionSkeleton />}>
          <NewsFeed />
        </Suspense>
        <IdeaGenerator />
        <Suspense fallback={<SectionSkeleton />}>
          <section id="testimonials">
            <TestimonialsSplit />
          </section>

          <SelfEmploymentRegistration />
          <WorkExperienceTracker />
          <FeaturedArticles />
          <SocialInsuranceGuide />
        </Suspense>


      </main>
      <Footer />
      <EnhancedAIAssistant
        isMinimized={isChatMinimized}
        onToggle={() => setIsChatMinimized(!isChatMinimized)}
      />
    </div >
  );
}

