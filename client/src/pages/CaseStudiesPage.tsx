import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import SelfEmployedCaseStudies from "@/components/SelfEmployedCaseStudies";
import PracticalFAQ from "@/components/PracticalFAQ";


export default function CaseStudiesPage() {
    return (
        <PageLayout>
            <PageHeader
                title="Кейсы и истории успеха"
                description="Реальные примеры того, как предприниматели и самозанятые оптимизируют налоги и развивают свой бизнес с помощью нашей платформы."
                breadcrumbs={[{ label: "Кейсы" }]}
            />

            <PageSection size="lg" className="pt-0">
                <SelfEmployedCaseStudies />
                <PracticalFAQ />
            </PageSection>


        </PageLayout>
    );
}
