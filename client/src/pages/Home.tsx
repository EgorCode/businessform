import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ValueProposition from "@/components/ValueProposition";
import HowItWorks from "@/components/HowItWorks";
import WizardSection from "@/components/WizardSection";
import ComparisonTable from "@/components/ComparisonTable";
import TaxCalculator from "@/components/TaxCalculator";
import DocumentLibrary from "@/components/DocumentLibrary";
import KnowledgeBase from "@/components/KnowledgeBase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ValueProposition />
        <HowItWorks />
        <WizardSection />
        <ComparisonTable />
        <TaxCalculator />
        <DocumentLibrary />
        <KnowledgeBase />
      </main>
      <Footer />
    </div>
  );
}
