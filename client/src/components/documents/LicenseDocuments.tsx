import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye, FileText, Plus } from "lucide-react";

const licenseDocuments = [
  {
    id: "alcohol-license",
    title: "Заявление на лицензию на алкоголь",
    description: "Для розничной и оптовой продажи алкогольной продукции",
    format: "DOCX",
    type: "form",
    instructions: "Заполните реквизиты организации, адреса магазинов, информацию о руководителе и кассирах."
  },
  {
    id: "pharmacy-license",
    title: "Заявление на фармацевтическую лицензию",
    description: "Для открытия аптеки или аптечного пункта",
    format: "DOCX",
    type: "form",
    instructions: "Укажите тип аптечного учреждения, адрес, информацию о руководителе и фармацевтах."
  },
  {
    id: "education-license",
    title: "Заявление на лицензию на образование",
    description: "Для образовательных учреждений и курсов",
    format: "DOCX",
    type: "form",
    instructions: "Заполните информацию об образовательных программах, преподавательском составе и помещениях."
  },
  {
    id: "medical-license",
    title: "Заявление на медицинскую лицензию",
    description: " для частных медицинских клиник и кабинетов",
    format: "DOCX",
    type: "form",
    instructions: "Укажите медицинские специальности, оборудование, информацию о врачах и помещениях."
  },
  {
    id: "transport-license",
    title: "Заявление на лицензию на перевозки",
    description: "Для пассажирских и грузовых перевозок",
    format: "DOCX",
    type: "form",
    instructions: "Заполните информацию о транспортных средствах, маршрутах и водителях."
  },
  {
    id: "construction-license",
    title: "Заявление на строительную лицензию",
    description: "Для строительных и ремонтных работ",
    format: "DOCX",
    type: "form",
    instructions: "Укажите виды строительных работ, информацию о специалистах и оборудовании."
  },
  {
    id: "security-license",
    title: "Заявление на лицензию на охранную деятельность",
    description: "Для частных охранных предприятий",
    format: "DOCX",
    type: "form",
    instructions: "Заполните информацию о руководителе, сотрудниках с допуском и вооружении."
  },
  {
    id: "waste-license",
    title: "Заявление на лицензию на обращение с отходами",
    description: "Для сбора, утилизации и переработки отходов",
    format: "DOCX",
    type: "form",
    instructions: "Укажите классы опасности отходов, места хранения и способы утилизации."
  }
];

export default function LicenseDocuments() {
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
        <h2 className="text-2xl font-bold mb-2">Лицензии и разрешения</h2>
        <p className="text-muted-foreground">
          Необходимые разрешения для разных видов лицензируемой деятельности
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {licenseDocuments.map((doc) => (
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