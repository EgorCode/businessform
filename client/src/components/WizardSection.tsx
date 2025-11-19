import { Button } from "@/components/ui/button";
import BusinessWizard from "./BusinessWizard";
import { useState } from "react";

export default function WizardSection() {
  const [showWizard, setShowWizard] = useState(false);

  if (!showWizard) {
    return (
      <section id="wizard" className="border-b py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-wizard-section-title">
              Мастер подбора формы бизнеса
            </h2>
            <p className="mb-8 text-lg text-muted-foreground" data-testid="text-wizard-section-subtitle">
              Ответьте на несколько вопросов и получите персонализированную рекомендацию по выбору организационно-правовой формы
            </p>
            <Button size="lg" onClick={() => setShowWizard(true)} data-testid="button-start-wizard-section">
              Начать опрос
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="wizard" className="border-b py-20">
      <div className="mx-auto max-w-7xl px-4">
        <BusinessWizard />
      </div>
    </section>
  );
}
