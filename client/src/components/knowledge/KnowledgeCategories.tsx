import { useMemo, useState, useEffect as ReactUseEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/strapi";
import { KnowledgeArticle as StrapiArticle, StrapiResponse } from "@/types/strapi";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Eye, Star, Heart, TrendingUp, Calendar, User, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KnowledgeCategoriesProps {
  category: string;
  searchQuery: string;
  selectedTag: string;
}

interface Article {
  id: number | string;
  documentId?: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  author?: string;
  readTime: string;
  tags: string[];
  views: number;
  rating: number;
  isFavorite: boolean;
  isNew: boolean;
  isPopular: boolean;
  publishDate: string;
}

const staticArticles: Article[] = [
  // Авторские статьи (Баканина Анастасия)
  {
    id: 101,
    title: "От подработки к бизнесу: какую форму выбрать фрилансеру",
    category: "starting",
    author: "Баканина Анастасия",
    excerpt: "Фриланс — это не просто подработка, а старт бизнеса. Разбираем, что выбрать: самозанятость, ИП или ООО, чтобы легально зарабатывать и расти.",
    content: `Фриланс — это формат работы, при котором специалист самостоятельно находит проекты, выполняет их и получает за это плату.
Фрилансер — это специалист, ведущий собственную профессиональную деятельность. Он самостоятельно выстраивает график, отбирает подходящие проекты и несёт полную ответственность за результаты своей работы.

В отличие от штатного сотрудника, фрилансер не получает заданий от руководителя и не имеет гарантированного объёма работы — ему приходится самому находить заказчиков. При этом уровень ответственности 
перед клиентами зачастую превышает тот, что предусмотрен в традиционной 
занятости на аналогичной позиции: ведь от качества его работы напрямую зависит 
репутация и возможность получать новые заказы.

В законодательстве РФ нет термина «фрилансер», но его деятельность подпадает под определение самостоятельной предпринимательской деятельности (<a href="https://login.consultant.ru/link/?req=doc&base=LAW&n=508490&dst=100016&date=22.01.2026&demo=2" target="_blank" class="text-primary hover:underline">ст. 2 ГК РФ</a>). Это значит:
• работа выполняется на свой риск;
• доход формируется от оказания услуг или выполнения работ;
• взаимодействие с заказчиками строится на договорной основе.
Палитра профессий для фриланса:
Сфера деятельности безгранична — от текста до кода. Ключевые направления:
• тексты и коммуникации: копирайтинг, редактура, SMM, PR;
• дизайн и визуал: веб‑дизайн, иллюстрации, обработка фото, анимация;
• IT и технологии: программирование, верстка, тестирование, настройка CRM;
• аудио и видео: монтаж, озвучивание, создание подкастов;
• бизнес‑услуги: бухгалтерия, HR‑консалтинг, маркетинг, перевод;
• обучение: онлайн‑репетиторство, создание курсов, коучинг.

Следует отметить, что начать с выбора формы бизнеса для фриланса - не формальность, а стратегическое решение. Оно определит вашу нагрузку, возможности и риски.
1. Самозанятость или Налог на профессиональныйдоход (НПД): лёгкий старт для новичка 
Для кого: новички и специалисты с доходом до 2,4 млн руб./год.
Плюсы:
• простая регистрация;
• самые низкие ставки: 4 % (от физлиц) и 6 % (от юрлиц);
• отсутствие бухгалтерии и деклараций.
Минусы:
• нельзя нанимать сотрудников;
• запрет на перепродажу товаров;
• лимит дохода.

Начните с самозанятости, чтобы протестировать нишу. При росте доходов и задач переходите на ИП — это сохранит гибкость, но откроет новые возможности. Главное — не ограничивать творчество, а создать для него надёжную основу.
2. Индвидуальный предприниматель (ИП): мост к серьёзному бизнесу
Для кого: фрилансеры с доходом свыше 2,4 млн руб., планирующие расширение.
Плюсы:
• возможность нанимать команду;
• доступ к расчётным счетам и эквайрингу;
• гибкость в выборе налогового режима.
Минусы:
• обязательные страховые взносы;
• необходимость вести бухгалтерию;
• отчётность (декларации, книги учёта).
3. Общество с ограниченной ответственностью (ООО): крепость для масштабных проектов
Для кого:  фрилансер‑предприниматель, строящий бренд или работающий с крупными заказчиками, например, студия дизайна, продюсерский центр, образовательная платформа — проекты, где важны репутация и масштабируемость.
Плюсы:
• защита активов (ответственность ограничена уставным капиталом);
• возможность привлекать инвесторов;
• престиж для контрактов с корпорациями.
Минусы:
• сложная регистрация (устав, юридический адрес, капитал);
• высокая налоговая нагрузка (налог на прибыль 20 %, НДС);
• строгий бухучёт.
Кроме того, фрилансер имеет возможность работать по Договору ГПХ (без статуса ИП/самозанятого)
Для кого: редкие заказы, эпизодическая подработка.
Особенности:
• заказчик удерживает НДФЛ (13 %);
• нет обязательств по налогам и отчётности для исполнителя;
• невозможно накапливать стаж и формировать пенсионные накопления.
При этом существует риск, что при систематической деятельности налоговая может признать это предпринимательством и доначислить налоги.

Таким образом, выбор формы бизнеса для фриланса разнообразен, ведь это не про бюрократию, а про защиту ваших интересов. Самозанятость даст лёгкость, ИП — рост, ООО — масштаб.`,
    readTime: "7 мин",
    tags: ["Фриланс", "Старт бизнеса", "ИП vs Самозанятость"],
    views: 3100,
    rating: 5.0,
    isFavorite: false,
    isNew: true,
    isPopular: true,
    publishDate: "2024-03-30"
  },
  {
    id: 102,
    title: "Кто такие самозанятые: суть статуса и основные правила",
    category: "taxes",
    author: "Баканина Анастасия",
    excerpt: "Полный разбор НПД: от регистрации в пару кликов до ограничений по доходу. Кому подходит этот режим, а кому лучше сразу открывать ИП.",
    content: `"Самозанятость" или "Налог на профессиональный доход" - это особый налоговый режим для граждан, получающих доход от профессиональной деятельности. Налог на профессиональный доход (далее - НПД) вправе применять физические лица, в том числе индивидуальные предприниматели, местом ведения деятельности которых является территория любого из субъектов Российской Федерации. 

Согласно <a href="https://login.consultant.ru/link/?req=doc&base=LAW&n=520124&dst=100001%2C-1&date=22.01.2026&demo=2" target="_blank" class="text-primary hover:underline">Федеральному закону</a> от 27.11.2018 № 422‑ФЗ, плательщиком НПД или "самозанятым" может стать:
• Физическое лицо, однако стоит отметить, что несовершеннолетние физические лица в возрасте от 14 до 18 лет, вправе вести деятельность, доходы от которой облагаются НПД, в случаях приобретения несовершеннолетним дееспособности, а с 14 лет — при наличии письменного согласия родителей или попечителей.
• Индивидуальный предприниматель, но при условии отказа от иных налоговых режимов в течение 30 дней после перехода на НПД, а также без наёмных работников по трудовым договорам.
• Граждане стран ЕАЭС - при соблюдении миграционных требований РФ (Беларусь, Казахстан, Армения, Киргизии).
• Иностранные граждане - постоянно проживающие в РФ.
• Госслужащие - с единственным ограничением: разрешено только сдавать в аренду жилое помещение (не коммерческую недвижимость). 

Самозанятость — это правовой инструмент, дающий возможность легально монетизировать талант, навыки и время абсолютно разным социальным, профессиональным и возрастным группам общества. 
Светлые стороны НПД: 
• Лёгкость входа. Всего несколько касаний экрана — и вы в игре. Регистрация похожа на создание аккаунта в соцсети: быстро, бесплатно, без бумажной волокиты. Никакой госпошлины, никаких походов в налоговую.
• Честная математика. 4 % с доходов от физлиц, 6 % — от юрлиц. 
• Без бюрократии. Нет деклараций, нет бухгалтерии, нет ночных кошмаров о сроках сдачи отчётов. Калькулятор сам считает налог и напоминает: «Пора заплатить». Вы занимаетесь делом, а не бумагами.
• Легальность без границ. Вы можете смело размещать рекламу, брать крупные заказы, оформлять договоры. Ваш доход — не тайна, а аргумент для банка при оформлении ипотеки или визы. Вы выходите из тени, но сохраняете гибкость.
• Свобода графика. Хотите работать по ночам? В отпуске? В кафе с ноутбуком? Ваше время — ваш ресурс. НПД не привязывает вас к офису или строгому расписанию.
Тем не менее, стоит оценить некоторые подводные камни НПД, в них входят: 
• Потолок доходов. 2,4 млн. руб. в год — ваша красная линия. Налоги пересчитают по ставке НДФЛ, а мечты о масштабировании придётся отложить.
• Одиночество бизнеса. Нанимать сотрудников нельзя. Всё делаете сами или через подрядчиков. 
• Соцпакет — за ваш счёт. Нет больничных, нет декретных, нет оплачиваемого 

отпуска. Болезнь или перерыв в работе — ваши личные риски. Трудовой стаж не идёт, если не платить добровольные взносы в Социальный фонд России.
• Ежемесячный ритм. Налог нужно платить каждый месяц до 28‑го числа. 
• Расходы не в счёт. Купили материалы? Оплатили рекламу? Аренда студии? НПД не позволяет вычитать затраты из налогооблагаемой базы. Ваш доход — это вся сумма на счету, даже если половина ушла на инструменты.
• Временность режима. На данный момент НПД действует в экспериментальном режиме до 2028 года. 

Таким образом, НПД - это не универсальное решение, а точный инструмент для конкретной задачи. Он идеален для:
• фрилансеров, тестирующих нишу;
• арендодателей, ценящих легальность без избыточного регулирования;
• блогеров, работающих «в одиночку» и других.`,
    readTime: "6 мин",
    tags: ["Самозанятость", "НПД", "Законы"],
    views: 2950,
    rating: 4.9,
    isFavorite: true,
    isNew: true,
    isPopular: true,
    publishDate: "2024-03-25"
  },
  {
    id: 103, // Featured article duplicate for category list
    title: "Блог как бизнес-проект: ключевые этапы построения",
    category: "marketing",
    author: "Баканина Анастасия",
    excerpt: "Для большинства авторов контента самозанятость или налог на профессиональный доход (НПД) — золотой ключ: просто, легально, без избыточной бюрократии.",
    content: `Юридически понятия «блогер» в закодательсве нет. Но если за публикации, обзоры, сторис или ролики приходят деньги — деятельность признаётся предпринимательской (<a href="https://login.consultant.ru/link/?req=doc&base=LAW&n=508490&dst=100016&date=22.01.2026&demo=2" target="_blank" class="text-primary hover:underline">ст. 2 ГК РФ</a>). А значит, требует оформления.
Систематическое размещение контента, при этом наличие аудитории (подписчиков, зрителей), а также получение дохода: реклама, спонсорские контракты, платные подписки, донаты и взаимодействие с брендами и юридическими лицами делает блогерство потенциальным кандидатом на оформление легализованного бизнеса.
Пока доход случайный — можно не задумываться о статусе. Но как только монетизация становится регулярной, наступает время выбрать правовую форму бизнеса. 
Для большинства авторов контента самозанятость или налог на профессиональный доход (НПД) —золотой ключ: просто, легально, без избыточной бюрократии.

Рассмотрим основные критерии: 
Условия по <a href="https://login.consultant.ru/link/?req=doc&base=LAW&n=520124&dst=100001%2C-1&date=22.01.2026&demo=2" target="_blank" class="text-primary hover:underline">Федеральному закону</a> от 27.11.2018 № 422‑ФЗ:
• Возраст — с 16 лет (с 14 лет — с согласия родителей).
• Гражданство — РФ или страны ЕАЭС.
• Доход — не более 2,4 млн. руб в год.
• Отсутствие наёмных работников — вы работаете сами (исключение договор гпх).
• Виды монетизации:
1.	реклама и нативная интеграция;
2.	платные посты и обзоры;
3.	продажа цифровых продуктов (гайды, курсы, шаблоны);
4.	донаты и подписки;
5.	фотосессии, видеосъёмка на заказ. 

При этом стоит отметить, есть некоторые моменты на которые особо следует обратить внимание,  самозанятым блогерам запрещается: 
• Перепродавать чужой контент.
• Получать доход свыше лимита.
• Нанимать сотрудников по трудовому договору.
• Брать оплату в натуральной форме (товарами, услугами) — такой доход не подпадает под НПД. 

Однако,  когда самозанятость  с его ограниченностью может стать кандалами для творчества и развития, в таком случае стоит рассматривать варианты ИП или ООО, если:
• доход превышает 2,4 млн. руб. в год;
• планируете нанимать команду (редактора, SMM‑специалиста, видеографа);
• хотите работать с крупными брендами, требующими юрлица;
• развиваете несколько проектов одновременно. 

Таким образом, выбор формы бизнеса для блогера зависит от масштаба деятельности, уровня доходов, планов по развитию и особенностей монетизации.  
Самозанятость для блогера — это стартовая площадка. Здесь вы учитесь вести дела, нарабатываете репутацию и готовитесь к масштабированию. Главное — помнить: творчество процветает там, где есть порядок. И самозанятость даёт этот порядок без потери вдохновения.`,
    readTime: "5 мин",
    tags: ["Блогер", "Медиа", "Монетизация"],
    views: 3200,
    rating: 5.0,
    isFavorite: false,
    isNew: true,
    isPopular: true,
    publishDate: "2024-03-30"
  },
  {
    id: 104,
    title: "Как устроено ООО: что нужно знать перед выбором",
    category: "legal",
    author: "Баканина Анастасия",
    excerpt: "Когда стоит открывать ООО вместо ИП? Ответственность, уставный капитал и сложность управления компанией.",
    content: `Общество с ограниченной ответственностью (ООО) — коммерческая организация, созданная одним или несколькими лицами (физическими или юридическими), уставный капитал которой разделён на доли.
Ключевые характеристики:
• Ограниченная ответственность участников. Учредители не отвечают по обязательствам общества и несут риск убытков только в пределах стоимости своих долей в уставном капитале (за исключением случаев банкротства).
• Уставный капитал. Минимальный размер — 10 000 руб. Капитал делится на доли, выраженные в процентах или дробях.
• Число участников. От 1 до 50 лиц. При превышении лимита ООО обязано преобразоваться в акционерное общество или производственный кооператив.
• Учредительный документ. Устав ООО, содержащий:
☐	наименование и место нахождения общества;
☐	размер уставного капитала;
☐	состав и компетенцию органов управления;
☐	права и обязанности участников;
☐	порядок выхода участника и перехода доли;
☐	правила хранения документов и предоставления информации.
• Органы управления:
☐	Общее собрание участников (ОСУ) — высший орган, принимающий стратегические решения (изменение устава, распределение прибыли, ликвидация).
☐	Исполнительный орган (генеральный директор) — руководит текущей деятельностью, действует без доверенности.
• Распределение прибыли. Может осуществляться пропорционально долям или иным образом, предусмотренным уставом.
• Выход участника. Возможен при условии, что это право закреплено в уставе; общество обязано выплатить действительную стоимость доли в течение 3 месяцев.

Стоит отметить, что для ООО необходимо выбирать налоговый режим исходя из масштаба деятельности,  структуры доходов и расходов, численности персонала,  влияющее на рентабельность и административную нагрузку всей системы.
Когда ООО не стоит выбирать как форму бизнеса:
• Микробизнес с одним владельцем и низкими рисками (лучше ИП или самозанятость).
• Необходимость мгновенного вывода прибыли (в ООО дивиденды облагаются НДФЛ 13 %).
• Ограниченный бюджет на регистрацию и бухгалтерию (при регистрации - госпошлина 4 000 руб., уставный капитал 10 000 руб., затраты на бухучёт).
• Временный проект (ликвидация ООО сложнее, чем закрытие ИП).


Таким образом, ООО — форма бизнеса для тех, кто строит не просто бизнес, а устойчивую систему, где каждый элемент — от устава до бухгалтерской отчётности — работает на будущее. Это выбор тех, кто:
• планирует работать с партнёрами, а не в одиночку;
• хочет защитить личное имущество от бизнес‑рисков;
• нацелен на крупные контракты и сотрудничество с юрлицами;
• готов инвестировать время и средства в структурирование бизнеса.`,
    readTime: "8 мин",
    tags: ["ООО", "Юрлица", "Бизнес"],
    views: 2100,
    rating: 4.7,
    isFavorite: false,
    isNew: false,
    isPopular: true,
    publishDate: "2024-03-20"
  },
  {
    id: 105,
    title: "ИП: в чем сильные стороны и где подводные камни",
    category: "starting",
    author: "Баканина Анастасия",
    excerpt: "Ответственность всем имуществом против свободы распоряжаться деньгами. Стоит ли регистрировать ИП?",
    content: `Индивидуальный предприниматель (ИП) — это физическое лицо, зарегистрированное в установленном законом порядке и осуществляющее предпринимательскую деятельность без образования юридического  лица (<a href="https://login.consultant.ru/link/?req=doc&base=LAW&n=495617&dst=100093&date=22.01.2026&demo=2" target="_blank" class="text-primary hover:underline">ст. 11 НК РФ</a>, <a href="https://login.consultant.ru/link/?req=doc&base=LAW&n=508490&dst=100126&date=22.01.2026&demo=2" target="_blank" class="text-primary hover:underline">ст. 23 ГК РФ</a>).
Ключевая особенность статуса ИП — полная имущественная ответственность: 
предприниматель отвечает по обязательствам всем принадлежащим ему имуществом (за исключением имущества, на которое по закону не может быть  обращено взыскание). 
Плюсы: 
• Лёгкий старт. Простой порядок регистрации, ведения и прекращения деятельности.
• Свобода распоряжаться заработанным. Ваши деньги — ваши правила. Нет нужды ждать выплат или согласовывать снятие средств:  доход в вашем распоряжении в любой момент.
• Бухгалтерия без мудрствований. Вместо громоздких отчётов — простая книга учёта. Это как вести дневник расходов, а не разгадывать ребусы двойной записи.
• Налоговые лазейки — ваши союзники. Патент, УСН, НПД  и другие.  Льготные режимы снижают нагрузку, оставляя больше ресурсов для развития.
• Господдержка на расстоянии руки. Гранты, субсидии, налоговые каникулы — государство протягивает руку тем, кто решился на собственный путь.
• Законность как щит. Никаких тревог о проверках или блокировках счетов. Вы — легальный игрок, с правом заключать договоры с крупными партнёрами и  брать корпоративные заказы.
• Стаж — инвестиция в будущее. Платя взносы в ПФР, вы копите не только капитал, но и пенсионные баллы. 
Минусы: 
• Ответственность без границ. Ваше имущество — гарантия по обязательствам. Долги бизнеса могут стать личными: квартира, машина, сбережения — всё под ударом. 
• Страховые взносы. Даже если касса молчит, а клиенты исчезли, взносы в ПФР и ОМС придётся платить. 
• Ограничения, словно стены. Алкоголь, банки, лекарства — многие сферы закрыты для ИП. Хотите войти туда? Придётся менять форму ведения бизнеса.
• Качество — ваша личная печать. Любая ошибка в товаре или услуге бьёт по репутации и кошельку. 
• Нет «директора» за спиной. Все решения — на вас. Нельзя назначить управляющего и отойти в сторону: бизнес требует личного участия.

Кроме того, важно отметить, что выбор налогового режима влияет на отчётность, размер платежей и возможности бизнеса.
На данный момент действуют пять основных налоговых режимов для ИП:
☐	Общая система налогообложения (ОСН)
• Уплата НДС, НДФЛ, имущественного и земельного налогов.

• Обязательное ведение бухгалтерского учёта.
• Подходит для работы с контрагентами, требующими НДС.
☐	Упрощённая система налогообложения (УСН)
• Два варианта расчёта:
• 6% от доходов - налог платится от выручки и внереализованных доходов;
• 15% от разницы «доходы минус расходы» - налог платится с разницы между всеми доходами, но итоговый размер не может быть меньше 1% от величины доходов.
• Освобождение от НДФЛ, НДС и налога на имущество, но имеются ограничения: пороговый доход до 20 млн руб. в год, штат до 130 сотрудников.
☐	Патентная система налогообложения (ПСН)
• Фиксированная стоимость патента (зависит от вида деятельности и региона).
• Применяется при штате до 15 человек и определённых видах бизнеса.
• Замена большинства налогов единым платежом.
☐	Налог на профессиональный доход (НПД)
• Ставка: 4% при работе с физлицами, 6% — с юрлицами.
• Условия: доход до 2,4 млн руб. в год, отсутствие наёмных сотрудников, запрет на перепродажу товаров.
☐	Единый сельскохозяйственный налог (ЕСХН)
• Ставка: 6% от прибыли.
• Для предпринимателей в сельскохозяйственной сфере.
• Требует ведения учёта доходов и расходов.

Таким образом, ИП — одна из доступных и гибких форм ведения бизнеса для физических лиц.  Это не юридическое лицо, а особый статус гражданина, позволяющий легально  зарабатывать на предпринимательской деятельности без создания сложной организационной структуры, но при этом состоящий из колосального уровня риска среди всех форм бизнеса.`,
    readTime: "10 мин",
    tags: ["ИП", "Риски", "Плюсы и минусы"],
    views: 2800,
    rating: 4.8,
    isFavorite: true,
    isNew: false,
    isPopular: true,
    publishDate: "2024-03-28"
  },

];

const categoryNames = {
  all: "Все статьи",
  starting: "Начало бизнеса",
  taxes: "Налоги и бухгалтерия",
  hr: "Кадры и трудовое право",
  marketing: "Маркетинг и продажи",
  legal: "Юридические аспекты",
  finance: "Финансы и инвестиции",
};

export default function KnowledgeCategories({ category, searchQuery, selectedTag }: KnowledgeCategoriesProps) {
  const { settings } = useSiteSettings();
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Fetch from Strapi v5
  const { data: strapiResponse, isLoading, error } = useQuery<StrapiResponse<StrapiArticle[]>>({
    queryKey: ["/knowledge-articles"],
    queryFn: () => fetchAPI<StrapiResponse<StrapiArticle[]>>("/knowledge-articles"),
    retry: 1,
  });

  // Handle visibility
  if (settings && settings.showKnowledgeBase === false) {
    return null;
  }

  // Transform and sync local state
  // Transform Strapi items
  const strapiArticles = useMemo(() => {
    if (!strapiResponse?.data) return [];

    return strapiResponse.data.map((item: StrapiArticle): Article => ({
      id: item.documentId,
      documentId: item.documentId,
      title: item.title,
      category: item.category || "starting",
      excerpt: item.excerpt,
      content: typeof item.content === 'string' ? item.content : JSON.stringify(item.content),
      author: item.author || "Редакция",
      readTime: item.readTime || "5 мин",
      tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(',') : []),
      views: item.views || 0,
      rating: item.rating || 5.0,
      isFavorite: item.isFavorite || false,
      isNew: item.isNew || false,
      isPopular: item.isPopular || false,
      publishDate: item.publishDate,
    }));
  }, [strapiResponse]);

  // Sync articles to local state (Merging Static + Strapi)
  ReactUseEffect(() => {
    // Start with static
    let merged = [...staticArticles];

    // Append Strapi if available, prioritizing static by title
    if (strapiArticles.length > 0) {
      const staticTitles = new Set(staticArticles.map(a => a.title.toLowerCase().trim()));
      const uniqueStrapiItems = strapiArticles.filter(a => !staticTitles.has(a.title.toLowerCase().trim()));
      merged = [...uniqueStrapiItems, ...staticArticles];
    }

    setLocalArticles(merged);
  }, [strapiArticles]);

  const toggleFavorite = (articleId: number | string) => {
    setLocalArticles(prev =>
      prev.map(article =>
        article.id === articleId
          ? { ...article, isFavorite: !article.isFavorite }
          : article
      )
    );
  };

  const filteredArticles = localArticles.filter((article: Article) => {
    const matchesCategory = category === "all" || article.category === category;
    const matchesSearch = searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === "" || article.tags.includes(selectedTag);

    return matchesCategory && matchesSearch && matchesTag;
  });

  const tabFilteredArticles = filteredArticles.filter((article: Article) => {
    if (activeTab === "all") return true;
    if (activeTab === "popular") return article.isPopular;
    if (activeTab === "new") return article.isNew;
    if (activeTab === "favorites") return article.isFavorite;
    if (activeTab === "author") return article.author === "Баканина Анастасия";
    return true;
  });



  const handleReadArticle = (article: Article) => {
    setSelectedArticle(article);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {categoryNames[category as keyof typeof categoryNames]}
        </h2>
        <div className="text-sm text-muted-foreground">
          Найдено статей: {filteredArticles.length}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList data-testid="knowledge-categories-tabs">
          <TabsTrigger value="all" data-testid="knowledge-categories-tab">Все статьи</TabsTrigger>
          <TabsTrigger value="popular" className="gap-2" data-testid="knowledge-categories-tab">
            <TrendingUp className="h-4 w-4" />
            Популярные
          </TabsTrigger>
          <TabsTrigger value="new" className="gap-2" data-testid="knowledge-categories-tab">
            <Calendar className="h-4 w-4" />
            Новые
          </TabsTrigger>
          <TabsTrigger value="author" className="gap-2" data-testid="knowledge-categories-tab">
            <User className="h-4 w-4" />
            Авторские
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2" data-testid="knowledge-categories-tab">
            <Heart className="h-4 w-4" />
            Избранное
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {tabFilteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Статьи не найдены. Попробуйте изменить параметры поиска или фильтры.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tabFilteredArticles.map((article) => (
                <Card key={article.id} className="flex flex-col hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        {article.isNew && (
                          <Badge variant="secondary" className="w-fit">
                            Новое
                          </Badge>
                        )}
                        {article.isPopular && (
                          <Badge variant="default" className="w-fit">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Популярное
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => toggleFavorite(article.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${article.isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                        />
                      </Button>
                    </div>
                    {article.author && (
                      <div className="text-xs font-semibold text-primary mt-2">
                        {article.author}
                      </div>
                    )}
                    <CardTitle className="text-xl leading-tight line-clamp-2 mt-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="line-clamp-3 text-base leading-relaxed">
                      {article.excerpt}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{article.rating}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReadArticle(article)}
                    >
                      Читать
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0">
          {selectedArticle && (
            <>
              <DialogHeader className="p-6 pb-4 border-b">
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="font-normal">
                    {categoryNames[selectedArticle.category as keyof typeof categoryNames] || selectedArticle.category}
                  </Badge>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedArticle.readTime} чтения</span>
                </div>
                <DialogTitle className="text-2xl font-bold leading-tight">{selectedArticle.title}</DialogTitle>
                {selectedArticle.author && (
                  <DialogDescription className="text-base text-foreground font-medium pt-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Автор: {selectedArticle.author}
                  </DialogDescription>
                )}
              </DialogHeader>
              <ScrollArea className="flex-1 p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div
                    className="whitespace-pre-line text-base leading-relaxed text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content || selectedArticle.excerpt }}
                  />
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}