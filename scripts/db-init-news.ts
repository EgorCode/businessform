import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from "../shared/schema";

// Use SQLite for local development
const sqlite = new Database('./local.db');
export const db = drizzle(sqlite, { schema });

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Initialize news categories
async function initNewsCategories() {
  try {
    // Check if categories already exist
    const existingCategories = await db.select().from(schema.newsCategories);
    
    if (existingCategories.length === 0) {
      // Insert default categories
      await db.insert(schema.newsCategories).values([
        { name: "Налоговые изменения", slug: "tax-changes" },
        { name: "Законодательство", slug: "legislation" },
        { name: "Бизнес-новости", slug: "business-news" },
        { name: "Аналитика", slug: "analytics" },
        { name: "Советы предпринимателям", slug: "business-tips" }
      ]);
      
      console.log("News categories initialized successfully");
    } else {
      console.log("News categories already exist");
    }
  } catch (error) {
    console.error("Error initializing news categories:", error);
  }
}

// Initialize sample news
async function initSampleNews() {
  try {
    // Check if news already exist
    const existingNews = await db.select().from(schema.news);
    
    if (existingNews.length === 0) {
      // Get the first category ID
      const categories = await db.select().from(schema.newsCategories);
      const taxCategoryId = categories.find(c => c.slug === "tax-changes")?.id;
      
      if (taxCategoryId) {
        // Insert sample news about tax changes
        await db.insert(schema.news).values({
          title: "АКТУАЛЬНЫЕ ИЗМЕНЕНИЯ В НАЛОГОВОМ КОДЕКСЕ РФ НА 2025 ГОД",
          content: `Основные налоговые реформы 2025:

Повышение ставок налога на прибыль - с 20% до 25%

Введение прогрессивной шкалы НДФЛ - вместо двухуровневой (13%/15%) введена пятиступенчатая шкала: 13%, 15%, 18%, 20%, 22%

НДС на УСН - с 1 января 2025 введена обязанность уплаты НДС для компаний и ИП на УСН с годовым доходом свыше 60 млн рублей по пониженным ставкам (5% и 7%)

Изменение лимитов для УСН - увеличены лимиты по доходам и численности сотрудников для применения спецрежима

Упрощение переходов между режимами - с 1 июля 2025 упрощена процедура перехода ИП с УСН на НПД через мобильное приложение «Мой налог»`,
          summary: "Основные налоговые реформы 2025 года: повышение налога на прибыль, новая прогрессивная шкала НДФЛ, введение НДС для УСН с доходом свыше 60 млн рублей.",
          imageUrl: "/images/tax-changes-2025.jpg",
          publishedAt: Math.floor(Date.now() / 1000),
          isActive: true,
          categoryId: taxCategoryId,
          tags: JSON.stringify(["налоги", "2025 год", "НДФЛ", "УСН", "НПД"]),
          businessForms: JSON.stringify(["НПД", "ИП", "ООО"]),
          priority: 10
        });

        await db.insert(schema.news).values({
          title: "МАСШТАБНЫЕ ИЗМЕНЕНИЯ НА 2026 ГОД",
          content: `Госдума приняла в третьем чтении пакет комплексных поправок в Налоговый кодекс, вступающих в силу с 1 января 2026 года:

1. ПОВЫШЕНИЕ НДС
Базовая ставка НДС: 20% → 22% (с 1 января 2026)

Льготная ставка 10% сохраняется для социально значимых товаров

Расчётная ставка изменится с 20/120 на 22/122

2. СНИЖЕНИЕ ЛИМИТОВ НДС НА УСН (ПОЭТАПНОЕ)
Порог доходов для начала уплаты НДС будет снижаться поэтапно:

2026 год: 60 млн → 20 млн рублей

2027 год: 20 млн → 15 млн рублей

2028 год: 15 млн → 10 млн рублей

3. ПРОГРЕССИВНАЯ ШКАЛА НДФЛ
К действующим пяти ступеням (13%, 15%, 18%, 20%, 22%) добавляется шестая ставка:

30% - для отдельных категорий физических лиц

4. СТРАХОВЫЕ ВЗНОСЫ ИП НА 2026 ГОД
Фиксированный взнос: 57 390 рублей (была 53 658 в 2025)

Предельный размер дополнительного взноса 1%: 321 818 рублей

Максимальная общая сумма взносов: 379 208 рублей`,
          summary: "Госдума приняла пакет поправок в Налоговый кодекс: повышение НДС до 22%, снижение лимитов для УСН, новая ставка НДФЛ 30%, обновление страховых взносов ИП.",
          imageUrl: "/images/tax-changes-2026.jpg",
          publishedAt: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
          isActive: true,
          categoryId: taxCategoryId,
          tags: JSON.stringify(["налоги", "2026 год", "НДС", "УСН", "НДФЛ", "страховые взносы"]),
          businessForms: JSON.stringify(["НПД", "ИП", "ООО"]),
          priority: 9
        });
        
        console.log("Sample news initialized successfully");
      }
    } else {
      console.log("News already exist");
    }
  } catch (error) {
    console.error("Error initializing sample news:", error);
  }
}

// Run initialization
async function init() {
  await initNewsCategories();
  await initSampleNews();
  console.log("Database initialization completed");
}

init().catch(console.error);