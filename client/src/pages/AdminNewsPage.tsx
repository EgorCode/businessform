import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import NewsAdmin from "@/components/admin/NewsAdmin";
import { Settings, Newspaper } from "lucide-react";

export default function AdminNewsPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Управление новостями"
        description="Создавайте, редактируйте и управляйте новостями на сайте"
        breadcrumbs={[
          { label: "Админка", href: "/admin" },
          { label: "Новости" }
        ]}
      />

      <PageSection size="lg">
        <NewsAdmin />
      </PageSection>
    </PageLayout>
  );
}