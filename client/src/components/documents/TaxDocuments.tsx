import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye, FileText, Plus } from "lucide-react";

const taxDocuments = [
  {
    id: "tax-declaration-ip",
    title: "Налоговая декларация ИП (УСН)",
    description: "Декларация по упрощенной системе налогообложения для ИП",
    format: "PDF/Excel",
    type: "form",
    instructions: "Заполните разделы 1.1, 1.2 и 2. Укажите полученные доходы и уплаченные страховые взносы."
  },
  {
    id: "tax-declaration-ooo",
    title: "Налоговая декларация ООО (УСН)",
    description: "Декларация по УСН для организаций",
    format: "PDF/Excel",
    type: "form",
    instructions: "Заполните все разделы декларации. Укажите доходы, расходы и уплаченные налоги."
  },
  {
    id: "vat-declaration",
    title: "Налоговая декларация по НДС",
    description: "Декларация по налогу на добавленную стоимость",
    format: "PDF/Excel",
    type: "form",
    instructions: "Заполните разделы 3-9. Укажите сумму НДС к уплате или возмещению."
  },
  {
    id: "property-tax-declaration",
    title: "Декларация по налогу на имущество",
    description: "Декларация по налогу на имущество организаций",
    format: "PDF/Excel",
    type: "form",
    instructions: "Укажите кадастровую стоимость объектов и ставку налога в вашем регионе."
  },
  {
    id: "income-tax-declaration",
    title: "Декларация по налогу на прибыль",
    description: "Декларация по налогу на прибыль организаций",
    format: "PDF/Excel",
    type: "form",
    instructions: "Заполните доходы и расходы по основной и прочей деятельности."
  },
  {
    id: "tax-notification",
    title: "Уведомление об исчисленных налогах",
    description: "Уведомление для ИП на патенте о суммах налогов",
    format: "DOCX",
    type: "template",
    instructions: "Укажите сумму патента, срок действия и виды деятельности."
  },
  {
    id: "tax-certificate",
    title: "Справка об отсутствии задолженности",
    description: "Запрос справки об отсутствии задолженности по налогам",
    format: "DOCX",
    type: "template",
    instructions: "Заполните реквизиты организации и укажите период для проверки."
  },
  {
    id: "self-employed-tax",
    title: "Уведомление о доходах самозанятого",
    description: "Форма уведомления о полученных доходах для плательщиков НПД",
    format: "PDF",
    type: "form",
    instructions: "Укажите сумму полученных доходов за период и налоговые вычеты."
  }
];

export default function TaxDocuments() {
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleDownload = (docId: string, docTitle: string) => {
    console.log('Downloading document:', { docId, docTitle });
    // Здесь будет логика скачивания документа
  };

  const handleCreate = (docId: string, docTitle: string) => {
    console.log('Creating document:', { docId, docTitle });
    // Здесь будет логика создания документа
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Налоговые документы</h2>
        <p className="text-muted-foreground">
          Декларации, уведомления и справки для налоговой отчетности
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {taxDocuments.map((doc) => (
          <Card key={doc.id} className="hover-elevate">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{doc.title}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mb-2">
                  {doc.type === 'form' ? 'Форма' : 'Шаблон'}
                </Badge>
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
    </div>
  );
}