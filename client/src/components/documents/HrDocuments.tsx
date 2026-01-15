import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye, FileText, Plus } from "lucide-react";

const hrDocuments = [
  {
    id: "employment-contract",
    title: "Трудовой договор",
    description: "Договор между работодателем и работником",
    format: "DOCX",
    type: "template",
    instructions: "Заполните ФИО работника, должность, оклад, условия труда и реквизиты организации."
  },
  {
    id: "employment-order",
    title: "Приказ о приёме на работу (Т-1)",
    description: "Унифицированная форма для оформления сотрудников",
    format: "DOCX",
    type: "template",
    instructions: "Укажите ФИО, должность, дату начала работы, оклад и условия испытательного срока."
  },
  {
    id: "dismissal-order",
    title: "Приказ об увольнении (Т-8)",
    description: "Форма для оформления увольнения сотрудника",
    format: "DOCX",
    type: "template",
    instructions: "Укажите ФИО, дату увольнения, основание и статью Трудового кодекса."
  },
  {
    id: "vacation-order",
    title: "Приказ о предоставлении отпуска (Т-6)",
    description: "Форма для оформления ежегодного отпуска",
    format: "DOCX",
    type: "template",
    instructions: "Укажите ФИО, период отпуска, количество дней и тип отпуска."
  },
  {
    id: "staff-schedule",
    title: "Штатное расписание",
    description: "Документ со списком должностей и окладов",
    format: "Excel/DOCX",
    type: "template",
    instructions: "Заполните наименования должностей, количество штатных единиц, оклады и надбавки."
  },
  {
    id: "job-description",
    title: "Должностная инструкция",
    description: "Документ с обязанностями и правами работника",
    format: "DOCX",
    type: "template",
    instructions: "Опишите должностные обязанности, права, ответственность и квалификационные требования."
  },
  {
    id: "work-rules",
    title: "Правила внутреннего трудового распорядка",
    description: "Локальный нормативный акт организации",
    format: "DOCX",
    type: "template",
    instructions: "Опишите порядок приёма и увольнения, рабочее время, время отдыха и поощрения."
  },
  {
    id: "personal-data-processing",
    title: "Согласие на обработку персональных данных",
    description: "Согласие работника на обработку персональных данных",
    format: "DOCX",
    type: "template",
    instructions: "Заполните ФИО работника, наименование организации и перечень обрабатываемых данных."
  }
];

export default function HrDocuments() {
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
        <h2 className="text-2xl font-bold mb-2">Кадровые документы</h2>
        <p className="text-muted-foreground">
          Трудовые договоры, приказы, штатное расписание и другие кадровые документы
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hrDocuments.map((doc) => (
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