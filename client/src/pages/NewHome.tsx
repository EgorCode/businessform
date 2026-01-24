import { useState, useEffect } from "react";
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

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');

        // Функция попытки скролла
        const attemptScroll = (attempts = 0) => {
          const element = document.getElementById(id);
          if (element) {
            // Небольшая задержка, чтобы убедиться, что элементы выше (новости и т.д.) заняли свое место
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          } else if (attempts < 10) {
            // Если элемента еще нет, пробуем снова через 100мс
            setTimeout(() => attemptScroll(attempts + 1), 100);
          }
        };

        attemptScroll();
      }
    };

    // Запускаем при монтировании
    setTimeout(handleHashScroll, 300);
    setTimeout(handleHashScroll, 1500); // Резервная попытка после полной загрузки страницы

    // Слушаем изменения хэша
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

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
        <IdeaGenerator />
        <section id="testimonials">
          <TestimonialsSplit />
        </section>

        <SelfEmploymentRegistration />
        <WorkExperienceTracker />
        <FeaturedArticles />
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

