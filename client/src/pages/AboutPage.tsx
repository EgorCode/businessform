import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">О нас</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Мы - организация, специализирующаяся на поддержке начинающих предпринимателей, помогающая Вам грамотно выбрать оптимальную организационно‑правовую форму бизнеса. 
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Наша миссия — создать надёжный фундамент для старта и устойчивого развития Вашего бизнеса, избавив от типичных ошибок на любом из этапов ведения бизнеса. 
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Мы детально проанализируем специфику проекта, финансовые ожидания и долгосрочные цели клиента, чтобы предложить наиболее подходящий вариант.
            </p>
            
            <p className="text-lg leading-relaxed mb-8">
              Наша цель — не просто подобрать форму бизнеса, а заложить основу для его стабильного роста, обеспечив начинающего предпринимателя ясностью и уверенностью с первых шагов.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-6">Наши основные инструменты:</h2>
            
            <div className="bg-muted/30 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Мастер подбора формы бизнеса</h3>
              <p className="text-lg leading-relaxed">
                это Ваш проводник в мир правовых систем, но простыми словами. Он экономит время, снижает риски и даёт уверенность, что Ваш бизнес стартует на прочной юридической основе.
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">ИИ - помощник</h3>
              <p className="text-lg leading-relaxed">
                выступает в роли персонального консультанта, который на основе ваших данных даёт структурированные рекомендации и экономит время на анализ законодательства и правовых нюансов.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}