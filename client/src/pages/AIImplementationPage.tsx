import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import AIImplementationGuide from "@/components/AIImplementationGuide";
import EnhancedAIAssistant from "@/components/EnhancedAIAssistant";

export default function AIImplementationPage() {
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  return (
    <PageLayout>
      <PageHeader 
        title="Руководство по реализации ИИ-помощника"
        description="Полное руководство по интеграции ИИ-помощника в BizStartMaster. Технические требования, структура компонентов и план развертывания."
        breadcrumbs={[{ label: "Реализация" }]}
      />

      <PageSection size="lg">
        <AIImplementationGuide />
      </PageSection>

      {/* AI-помощник */}
      <EnhancedAIAssistant 
        isMinimized={isChatMinimized}
        onToggle={() => setIsChatMinimized(!isChatMinimized)}
      />
    </PageLayout>
  );
}