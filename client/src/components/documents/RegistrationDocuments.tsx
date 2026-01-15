import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye, FileText, Plus } from "lucide-react";

const registrationDocuments = [
  {
    id: "ip-registration",
    title: "Заявление на регистрацию ИП (Р21001)",
    description: "Форма для подачи в налоговую службу при регистрации ИП",
    format: "PDF/DOCX",
    type: "form",
    instructions: "Заполните все поля в соответствии с вашими паспортными данными. Укажите коды ОКВЭД для вашей деятельности."
  },
  {
    id: "ooo-ustav",
    title: "Устав ООО (образец)",
    description: "Типовой устав для регистрации общества с ограниченной ответственностью",
    format: "DOCX",
    type: "template",
    instructions: "Заполните реквизиты компании, ФИО учредителей, уставный капитал и виды деятельности."
  },
  {
    id: "ooo-decision",
    title: "Решение единственного учредителя",
    description: "Решение о создании ООО и утверждении устава",
    format: "DOCX",
    type: "template",
    instructions: "Укажите ФИО учредителя, данные компании, размер уставного капитала и директора."
  },
  {
    id: "self-employed-application",
    title: "Заявление на регистрацию самозанятого",
    description: "Форма для регистрации в качестве плательщика НПД",
    format: "PDF",
    type: "form",
    instructions: "Заполните персональные данные и выберите налоговые вычеты при необходимости."
  },
  {
    id: "ip-termination",
    title: "Заявление о прекращении деятельности ИП",
    description: "Форма для закрытия ИП в налоговой службе",
    format: "PDF/DOCX",
    type: "form",
    instructions: "Укажите ИНН, ФИО и причину прекращения деятельности."
  },
  {
    id: "ooo-liquidation",
    title: "Решение о ликвидации ООО",
    description: "Решение учредителей о прекращении деятельности ООО",
    format: "DOCX",
    type: "template",
    instructions: "Заполните данные компании, ФИО учредителей и назначьте ликвидатора."
  }
];

export default function RegistrationDocuments() {
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
        <h2 className="text-2xl font-bold mb-2">Регистрация бизнеса</h2>
        <p className="text-muted-foreground">
          Документы для регистрации ИП, ООО и самозанятости, а также для прекращения деятельности
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {registrationDocuments.map((doc) => (
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