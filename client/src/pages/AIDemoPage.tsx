import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import AIDemo from "@/components/AIDemo";
import EnhancedAIAssistant from "@/components/EnhancedAIAssistant";

export default function AIDemoPage() {
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  return (
    <PageLayout>
      <PageHeader 
        title="Демонстрация ИИ-помощника"
        description="Полная демонстрация возможностей ИИ-помощника по бизнесу. Интерактивный чат, анализ бизнеса, расчёт налогов и анализ документов."
        breadcrumbs={[{ label: "AI-демонстрация" }]}
      />

      <PageSection size="lg">
        <AIDemo />
      </PageSection>

      {/* AI-помощник */}
      <EnhancedAIAssistant 
        isMinimized={isChatMinimized}
        onToggle={() => setIsChatMinimized(!isChatMinimized)}
      />
    </PageLayout>
  );
}