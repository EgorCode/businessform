import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText, Search, Eye, Plus } from "lucide-react";
import { useState } from "react";

// todo: remove mock functionality
const documents = [
  {
    id: 1,
    title: "Заявление на регистрацию ИП (Р21001)",
    category: "Регистрация",
    description: "Форма для подачи в налоговую службу при регистрации ИП",
    format: "PDF/DOCX",
    type: "form",
    instructions: "Заполните все поля в соответствии с вашими паспортными данными. Укажите коды ОКВЭД для вашей деятельности."
  },
  {
    id: 2,
    title: "Устав ООО (образец)",
    category: "Регистрация",
    description: "Типовой устав для регистрации общества с ограниченной ответственностью",
    format: "DOCX",
    type: "template",
    instructions: "Заполните реквизиты компании, ФИО учредителей, уставный капитал и виды деятельности."
  },
  {
    id: 3,
    title: "Договор оказания услуг",
    category: "Договоры",
    description: "Универсальный шаблон договора между ИП/ООО и клиентом",
    format: "DOCX",
    type: "template",
    instructions: "Заполните реквизиты сторон, предмет договора, стоимость услуг и порядок оплаты."
  },
  {
    id: 4,
    title: "Приказ о приёме на работу (Т-1)",
    category: "Кадры",
    description: "Унифицированная форма для оформления сотрудников",
    format: "DOCX",
    type: "template",
    instructions: "Укажите ФИО, должность, дату начала работы, оклад и условия испытательного срока."
  },
  {
    id: 5,
    title: "Акт выполненных работ",
    category: "Договоры",
    description: "Документ для подтверждения оказания услуг или выполнения работ",
    format: "DOCX",
    type: "template",
    instructions: "Укажите дату, стороны, перечень выполненных работ и их стоимость."
  },
  {
    id: 6,
    title: "Решение единственного учредителя",
    category: "Регистрация",
    description: "Решение о создании ООО и утверждении устава",
    format: "DOCX",
    type: "template",
    instructions: "Укажите ФИО учредителя, данные компании, размер уставного капитала и директора."
  },
  {
    id: 7,
    title: "Налоговая декларация ИП (УСН)",
    category: "Налоги",
    description: "Декларация по упрощенной системе налогообложения для ИП",
    format: "PDF/Excel",
    type: "form",
    instructions: "Заполните разделы 1.1, 1.2 и 2. Укажите полученные доходы и уплаченные страховые взносы."
  },
  {
    id: 8,
    title: "Заявление на лицензию на алкоголь",
    category: "Лицензии",
    description: "Для розничной и оптовой продажи алкогольной продукции",
    format: "DOCX",
    type: "form",
    instructions: "Заполните реквизиты организации, адреса магазинов, информацию о руководителе и кассирах."
  }
];

const categories = ["Все", "Регистрация", "Налоги", "Кадры", "Договоры", "Лицензии"];

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
    // Здесь будет логика скачивания документа
  };

  const handleCreate = (docId: number, docTitle: string) => {
    console.log('Creating document:', { docId, docTitle });
    // Здесь будет логика создания документа
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
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">
                      {doc.category}
                    </Badge>
                    <Badge variant="outline">
                      {doc.type === 'form' ? 'Форма' : 'Шаблон'}
                    </Badge>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{doc.format}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Предпросмотр
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{doc.title}</DialogTitle>
                      <DialogDescription>{doc.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Инструкции по заполнению:</h4>
                        <p className="text-sm text-muted-foreground">{doc.instructions}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-md">
                        <p className="text-sm text-center text-muted-foreground">
                          Здесь будет отображаться предпросмотр документа
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {doc.type === 'form' ? (
                  <Button size="sm" className="gap-2" onClick={() => handleDownload(doc.id, doc.title)}>
                    <Download className="h-4 w-4" />
                    Скачать
                  </Button>
                ) : (
                  <Button size="sm" className="gap-2" onClick={() => handleCreate(doc.id, doc.title)}>
                    <Plus className="h-4 w-4" />
                    Создать
                  </Button>
                )}
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
