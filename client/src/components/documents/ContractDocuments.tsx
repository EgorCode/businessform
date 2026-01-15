import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye, FileText, Plus } from "lucide-react";

const contractDocuments = [
  {
    id: "service-contract",
    title: "Договор оказания услуг",
    description: "Универсальный шаблон договора между ИП/ООО и клиентом",
    format: "DOCX",
    type: "template",
    instructions: "Заполните реквизиты сторон, предмет договора, стоимость услуг и порядок оплаты."
  },
  {
    id: "supply-contract",
    title: "Договор поставки товаров",
    description: "Шаблон договора для поставки товаров между организациями",
    format: "DOCX",
    type: "template",
    instructions: "Укажите наименование товара, количество, цену, условия поставки и оплаты."
  },
  {
    id: "lease-agreement",
    title: "Договор аренды помещения",
    description: "Шаблон договора аренды коммерческой недвижимости",
    format: "DOCX",
    type: "template",
    instructions: "Заполните адрес объекта, площадь, арендную плату, срок аренды и обязанности сторон."
  },
  {
    id: "work-act",
    title: "Акт выполненных работ",
    description: "Документ для подтверждения оказания услуг или выполнения работ",
    format: "DOCX",
    type: "template",
    instructions: "Укажите дату, стороны, перечень выполненных работ и их стоимость."
  },
  {
    id: "invoice",
    title: "Счёт на оплату",
    description: "Форма счёта для выставления клиентам",
    format: "Excel/DOCX",
    type: "template",
    instructions: "Заполните реквизиты продавца и покупателя, наименование услуг и сумму к оплате."
  },
  {
    id: "nda",
    title: "Соглашение о неразглашении (NDA)",
    description: "Документ о конфиденциальности информации",
    format: "DOCX",
    type: "template",
    instructions: "Определите конфиденциальную информацию, обязанности сторон и срок действия соглашения."
  },
  {
    id: "loan-agreement",
    title: "Договор займа",
    description: "Шаблон договора займа между юридическими лицами",
    format: "DOCX",
    type: "template",
    instructions: "Укажите сумму займа, процентную ставку, срок возврата и порядок погашения."
  },
  {
    id: "partnership-agreement",
    title: "Договор о сотрудничестве",
    description: "Соглашение о совместной деятельности",
    format: "DOCX",
    type: "template",
    instructions: "Определите цели сотрудничества, обязанности сторон, порядок распределения прибыли."
  }
];

export default function ContractDocuments() {
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
        <h2 className="text-2xl font-bold mb-2">Договоры и шаблоны</h2>
        <p className="text-muted-foreground">
          Готовые шаблоны договоров с поставщиками, клиентами и партнёрами
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contractDocuments.map((doc) => (
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