import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentLibrary from "@/components/DocumentLibrary";
import RegistrationDocuments from "@/components/documents/RegistrationDocuments";
import TaxDocuments from "@/components/documents/TaxDocuments";
import HrDocuments from "@/components/documents/HrDocuments";
import ContractDocuments from "@/components/documents/ContractDocuments";
import LicenseDocuments from "@/components/documents/LicenseDocuments";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <PageLayout>
      <PageHeader
        title="Документы для бизнеса"
        description="Готовые шаблоны и формы для регистрации и ведения бизнеса"
        breadcrumbs={[{ label: "Документы" }]}
      />

      <PageSection>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-6 sm:mx-0 sm:px-2 py-2">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 min-w-max sm:min-w-0 gap-1 sm:gap-2 h-auto p-2">
              <TabsTrigger value="all" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Все</TabsTrigger>
              <TabsTrigger value="registration" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Регистрация</TabsTrigger>
              <TabsTrigger value="tax" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Налоги</TabsTrigger>
              <TabsTrigger value="hr" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Кадры</TabsTrigger>
              <TabsTrigger value="contracts" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Договоры</TabsTrigger>
              <TabsTrigger value="licenses" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Лицензии</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-6">
            <DocumentLibrary />
          </TabsContent>

          <TabsContent value="registration" className="mt-6">
            <RegistrationDocuments />
          </TabsContent>

          <TabsContent value="tax" className="mt-6">
            <TaxDocuments />
          </TabsContent>

          <TabsContent value="hr" className="mt-6">
            <HrDocuments />
          </TabsContent>

          <TabsContent value="contracts" className="mt-6">
            <ContractDocuments />
          </TabsContent>

          <TabsContent value="licenses" className="mt-6">
            <LicenseDocuments />
          </TabsContent>
        </Tabs>
      </PageSection>
    </PageLayout>
  );
}