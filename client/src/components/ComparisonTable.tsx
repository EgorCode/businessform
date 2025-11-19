import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

// todo: remove mock functionality
const comparisons = [
  {
    category: "Регистрация",
    npd: { value: "Через приложение", icon: "check" },
    ip: { value: "В налоговой или онлайн", icon: "check" },
    ooo: { value: "Через нотариуса", icon: "neutral" },
  },
  {
    category: "Срок регистрации",
    npd: { value: "1 день", icon: "check" },
    ip: { value: "3 дня", icon: "check" },
    ooo: { value: "7-10 дней", icon: "neutral" },
  },
  {
    category: "Стоимость регистрации",
    npd: { value: "Бесплатно", icon: "check" },
    ip: { value: "800 ₽ госпошлина", icon: "check" },
    ooo: { value: "4000 ₽ + услуги", icon: "cross" },
  },
  {
    category: "Максимальный доход",
    npd: { value: "2.4 млн ₽/год", icon: "neutral" },
    ip: { value: "200 млн ₽/год (УСН)", icon: "check" },
    ooo: { value: "Без ограничений", icon: "check" },
  },
  {
    category: "Наёмные сотрудники",
    npd: { value: "Запрещено", icon: "cross" },
    ip: { value: "До 130 человек", icon: "check" },
    ooo: { value: "Без ограничений", icon: "check" },
  },
  {
    category: "Налоговая ставка",
    npd: { value: "4-6%", icon: "check" },
    ip: { value: "6% или 15% (УСН)", icon: "check" },
    ooo: { value: "6% или 15% (УСН)", icon: "check" },
  },
  {
    category: "Отчётность",
    npd: { value: "Не требуется", icon: "check" },
    ip: { value: "1 раз в год", icon: "check" },
    ooo: { value: "Ежеквартально", icon: "neutral" },
  },
  {
    category: "Ответственность",
    npd: { value: "Личным имуществом", icon: "cross" },
    ip: { value: "Личным имуществом", icon: "cross" },
    ooo: { value: "Уставным капиталом", icon: "check" },
  },
];

export default function ComparisonTable() {
  return (
    <section id="comparison" className="border-b py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-comparison-title">
            Сравнение форм бизнеса
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-comparison-subtitle">
            Подробное сравнение НПД, ИП и ООО по ключевым параметрам
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Сравнительная таблица</CardTitle>
            <CardDescription>
              Выберите форму бизнеса, которая соответствует вашим потребностям
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Параметр</TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Badge variant="outline">НПД</Badge>
                        <span className="text-xs font-normal text-muted-foreground">Самозанятый</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Badge variant="outline">ИП</Badge>
                        <span className="text-xs font-normal text-muted-foreground">Индивидуальный предприниматель</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Badge variant="outline">ООО</Badge>
                        <span className="text-xs font-normal text-muted-foreground">Общество с ограниченной ответственностью</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisons.map((row, index) => (
                    <TableRow key={index} data-testid={`row-comparison-${index}`}>
                      <TableCell className="font-medium">{row.category}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {row.npd.icon === "check" && <Check className="h-5 w-5 text-green-600" />}
                          {row.npd.icon === "cross" && <X className="h-5 w-5 text-red-600" />}
                          <span className="text-sm">{row.npd.value}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {row.ip.icon === "check" && <Check className="h-5 w-5 text-green-600" />}
                          {row.ip.icon === "cross" && <X className="h-5 w-5 text-red-600" />}
                          <span className="text-sm">{row.ip.value}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {row.ooo.icon === "check" && <Check className="h-5 w-5 text-green-600" />}
                          {row.ooo.icon === "cross" && <X className="h-5 w-5 text-red-600" />}
                          <span className="text-sm">{row.ooo.value}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
