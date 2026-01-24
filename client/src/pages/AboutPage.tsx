import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Link } from "wouter";
import { useAIAssistant } from "@/contexts/AIAssistantContext";

export default function AboutPage() {
  const { setVisibility, toggleMinimized } = useAIAssistant();
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

            <h2 className="text-2xl font-semibold mt-12 mb-6 text-center">Наша команда</h2>
            <AnimatedTestimonials testimonials={teamMembers} autoplay={true} />

            <h2 className="text-2xl font-semibold mt-32 mb-6">Наши основные инструменты:</h2>

            <Link href="/wizard" className="no-underline block">
              <div className="bg-muted/30 rounded-lg p-6 mb-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">Мастер подбора формы бизнеса</h3>
                <p className="text-lg leading-relaxed text-foreground">
                  это Ваш проводник в мир правовых систем, но простыми словами. Он экономит время, снижает риски и даёт уверенность, что Ваш бизнес стартует на прочной юридической основе.
                </p>
              </div>
            </Link>

            <div
              className="bg-muted/30 rounded-lg p-6 mb-6 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => {
                setVisibility(true);
                toggleMinimized();
              }}
            >
              <h3 className="text-xl font-semibold mb-4 text-primary">ИИ - помощник</h3>
              <p className="text-lg leading-relaxed text-foreground">
                выступает в роли персонального консультанта, который на основе ваших данных даёт структурированные рекомендации и экономит время на анализ законодательства и правовых нюансов.
              </p>
            </div>

            <Link href="/knowledge" className="no-underline block">
              <div className="bg-muted/30 rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">База знаний</h3>
                <p className="text-lg leading-relaxed text-foreground">
                  это обширная библиотека авторских статей, практических руководств и актуальных новостей законодательства. Мы регулярно публикуем разборы сложных ситуаций, шаблоны документов и инструкции, которые помогут вам разобраться во всех тонкостях ведения бизнеса.
                </p>
              </div>
            </Link>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const teamMembers = [
  {
    name: "Баканина Анастасия",
    designation: "Идеолог, автор статей",
    quote: "Отвечает за авторские материалы и делает много полезного для развития платформы.",
    src: "/team/anastasia.jpg",
  },
  {
    name: "Гончаренко Егор",
    designation: "Лентяй-вайбкодер",
    quote: "Отвечает за техническую работу нашего проекта и создает ту самую атмосферу.",
    src: "/team/egor.jpg",
  },
  {
    name: "Горланова Валентина",
    designation: "Идеолог, Специалист поддержки",
    quote: "Поможет Вам ответить на все вопросы и найти правильное решение в любой ситуации.",
    src: "/team/valentina.jpg",
  },
  {
    name: "Гусев Антон",
    designation: "Ведущий Аналитик-тестировщик",
    quote: "Наш идеолог, который следит за качеством и продумывает каждую деталь.",
    src: "/team/anton.jpg",
  },
  {
    name: "Каракозова Ксения",
    designation: "Идеолог, Специалист поддержки",
    quote: "Всегда на связи, чтобы помочь Вам ответить на все вопросы и разобраться с сервисом.",
    src: "/team/ksenia.jpg",
  },
  {
    name: "Протаева Вера",
    designation: "Идеолог, Специалист поддержки",
    quote: "Поможет Вам ответить на все вопросы и поддержит на старте вашего бизнеса.",
    src: "/team/vera.jpg",
  },
  {
    name: "Разговоров Юрий",
    designation: "Юрист",
    quote: "Который всегда с нами в команде, но не всегда на месте. Эксперт по сложным вопросам.",
    src: "/team/yuri.jpg",
  },
];