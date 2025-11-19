import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, FileText, Search } from "lucide-react";
import { useState } from "react";

// todo: remove mock functionality
const documents = [
  {
    id: 1,
    title: "Заявление на регистрацию ИП (Р21001)",
    category: "Регистрация ИП",
    description: "Форма для подачи в налоговую службу при регистрации ИП",
    format: "PDF/DOCX",
  },
  {
    id: 2,
    title: "Устав ООО (образец)",
    category: "Регистрация ООО",
    description: "Типовой устав для регистрации общества с ограниченной ответственностью",
    format: "DOCX",
  },
  {
    id: 3,
    title: "Договор оказания услуг",
    category: "Договоры",
    description: "Универсальный шаблон договора между ИП/ООО и клиентом",
    format: "DOCX",
  },
  {
    id: 4,
    title: "Приказ о приёме на работу (Т-1)",
    category: "Кадры",
    description: "Унифицированная форма для оформления сотрудников",
    format: "DOCX",
  },
  {
    id: 5,
    title: "Акт выполненных работ",
    category: "Договоры",
    description: "Документ для подтверждения оказания услуг или выполнения работ",
    format: "DOCX",
  },
  {
    id: 6,
    title: "Решение единственного учредителя",
    category: "Регистрация ООО",
    description: "Решение о создании ООО и утверждении устава",
    format: "DOCX",
  },
];

const categories = ["Все", "Регистрация ИП", "Регистрация ООО", "Договоры", "Кадры"];

export default function DocumentLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Все" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (docId: number, docTitle: string) => {
    console.log('Downloading document:', { docId, docTitle });
  };

  return (
    <section id="documents" className="border-b bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-documents-title">
            Библиотека документов
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-documents-subtitle">
            Готовые шаблоны для регистрации и ведения бизнеса
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск документов..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-documents"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => setSelectedCategory(category)}
                data-testid={`badge-category-${category}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover-elevate" data-testid={`card-document-${doc.id}`}>
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{doc.title}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mb-2">
                    {doc.category}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{doc.description}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{doc.format}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleDownload(doc.id, doc.title)}
                  data-testid={`button-download-${doc.id}`}
                >
                  <Download className="h-4 w-4" />
                  Скачать
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Документы не найдены. Попробуйте изменить критерии поиска.</p>
          </div>
        )}
      </div>
    </section>
  );
}
