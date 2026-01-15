import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "../shared/schema";

// Use SQLite for local development
const sqlite = new Database('./local.db');
export const db = drizzle(sqlite, { schema });

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Split news ID 2 into 4 separate news items
async function splitNews2() {
  try {
    // Get the tax category ID
    const categories = await db.select().from(schema.newsCategories);
    const taxCategoryId = categories.find(c => c.slug === "tax-changes")?.id;
    
    if (!taxCategoryId) {
      throw new Error("Tax category not found");
    }

    // Delete the original news ID 2
    await db.delete(schema.news).where(eq(schema.news.id, 2));

    const baseTimestamp = Math.floor(Date.now() / 1000);
    
    // Create 4 separate news items
    await db.insert(schema.news).values([
      {
        title: "ПОВЫШЕНИЕ НДС С 2026 ГОДА",
        content: `Госдума приняла поправки в Налоговый кодекс, повышающие ставку НДС с 1 января 2026 года:

Базовая ставка НДС: 20% → 22% (с 1 января 2026)

Льготная ставка 10% сохраняется для социально значимых товаров

Расчётная ставка изменится с 20/120 на 22/122

Это изменение затронет все категории товаров и услуг, кроме тех, что подпадают под льготную ставку 10%.`,
        summary: "Базовая ставка НДС повышается с 20% до 22% с 1 января 2026 года. Льготная ставка 10% сохраняется для социально значимых товаров.",
        imageUrl: "/images/vat-increase-2026.jpg",
        publishedAt: baseTimestamp - 86400, // 1 day ago
        isActive: true,
        categoryId: taxCategoryId,
        tags: JSON.stringify(["налоги", "2026 год", "НДС"]),
        businessForms: JSON.stringify(["НПД", "ИП", "ООО"]),
        priority: 9
      },
      {
        title: "СНИЖЕНИЕ ЛИМИТОВ НДС НА УСН",
        content: `Поэтапное снижение порогов доходов для начала уплаты НДС для компаний на УСН:

2026 год: 60 млн → 20 млн рублей

2027 год: 20 млн → 15 млн рублей

2028 год: 15 млн → 10 млн рублей

Изменения вводятся постепенно, чтобы бизнес мог адаптироваться к новым требованиям. Компании, превышающие установленные лимиты, будут обязаны уплачивать НДС по пониженным ставкам.`,
        summary: "Порог доходов для уплаты НДС на УСН будет снижаться поэтапно: с 60 млн до 20 млн рублей в 2026 году, далее до 15 млн в 2027 и 10 млн в 2028.",
        imageUrl: "/images/usn-vat-limits.jpg",
        publishedAt: baseTimestamp - 86400 - 3600, // 1 day ago + 1 hour
        isActive: true,
        categoryId: taxCategoryId,
        tags: JSON.stringify(["налоги", "2026 год", "УСН", "НДС"]),
        businessForms: JSON.stringify(["ИП", "ООО"]),
        priority: 8
      },
      {
        title: "НОВАЯ СТАВКА НДФЛ 30%",
        content: `К действующей пятиступенчатой прогрессивной шкале НДФЛ добавляется шестая ставка:

30% - для отдельных категорий физических лиц

Действующие ставки сохраняются:
13%, 15%, 18%, 20%, 22%

Новая ставка 30% будет применяться к доходам, превышающим установленные пороги для высокодоходных категорий граждан.`,
        summary: "В прогрессивной шкале НДФЛ появляется новая ставка 30% для отдельных категорий физических лиц с высокими доходами.",
        imageUrl: "/images/ndfl-new-rate.jpg",
        publishedAt: baseTimestamp - 86400 - 7200, // 1 day ago + 2 hours
        isActive: true,
        categoryId: taxCategoryId,
        tags: JSON.stringify(["налоги", "2026 год", "НДФЛ"]),
        businessForms: JSON.stringify(["НПД", "ИП"]),
        priority: 7
      },
      {
        title: "СТРАХОВЫЕ ВЗНОСЫ ИП НА 2026 ГОД",
        content: `Обновлены размеры страховых взносов для индивидуальных предпринимателей на 2026 год:

Фиксированный взнос: 57 390 рублей (была 53 658 в 2025)

Предельный размер дополнительного взноса 1%: 321 818 рублей

Максимальная общая сумма взносов: 379 208 рублей

Изменения учитывают индексацию и рост средней заработной платы в стране.`,
        summary: "Фиксированные страховые взносы ИП увеличены до 57 390 рублей. Максимальная общая сумма взносов составит 379 208 рублей.",
        imageUrl: "/images/ip-insurance-2026.jpg",
        publishedAt: baseTimestamp - 86400 - 10800, // 1 day ago + 3 hours
        isActive: true,
        categoryId: taxCategoryId,
        tags: JSON.stringify(["налоги", "2026 год", "страховые взносы", "ИП"]),
        businessForms: JSON.stringify(["ИП"]),
        priority: 6
      }
    ]);
    
    console.log("News ID 2 successfully split into 4 separate news items");
  } catch (error) {
    console.error("Error splitting news:", error);
  }
}

// Import eq function for where clause
import { eq } from 'drizzle-orm';

// Run the split operation
splitNews2().catch(console.error);