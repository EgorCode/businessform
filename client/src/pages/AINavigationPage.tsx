import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import AINavigation from "@/components/AINavigation";
import EnhancedAIAssistant from "@/components/EnhancedAIAssistant";

export default function AINavigationPage() {
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  return (
    <PageLayout>
      <PageHeader 
        title="ИИ-помощник"
        description="Полный набор AI-инструментов для выбора формы бизнеса, расчёта налогов и ведения бизнеса. Интерактивный чат, анализ документов и персональные рекомендации."
        breadcrumbs={[{ label: "ИИ-помощник" }]}
      />

      <PageSection size="lg">
        <AINavigation />
      </PageSection>

      {/* AI-помощник */}
      <EnhancedAIAssistant 
        isMinimized={isChatMinimized}
        onToggle={() => setIsChatMinimized(!isChatMinimized)}
      />
    </PageLayout>
  );
}