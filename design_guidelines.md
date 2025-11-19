# Design Guidelines: Russian Business Formation Platform

## Design Approach

**Selected System**: Material Design 3 with Stripe-inspired trust elements and Linear's clarity
**Rationale**: This utility-focused platform requires professional credibility (tax/legal domain) combined with exceptional clarity for information-dense content. Material Design provides robust data visualization components while Stripe's aesthetic communicates trustworthiness.

**Core Principles**:
1. Professional Trust - Clean, authoritative design befitting financial/legal content
2. Guided Simplicity - Complex decisions made approachable through clear progressive disclosure
3. Data Clarity - Tables, comparisons, and calculators must be instantly scannable
4. Action-Oriented - Clear paths from research to decision-making

---

## Typography

**Font Families** (Google Fonts via CDN):
- **Primary**: Inter (400, 500, 600, 700) - UI, body text, tables
- **Display**: Cal Sans or similar geometric sans (700) - Hero headlines only
- **Monospace**: JetBrains Mono (400, 500) - Calculator outputs, numerical data

**Hierarchy**:
- Hero Headline: text-5xl/text-6xl, font-bold, tracking-tight
- Section Headers: text-3xl/text-4xl, font-semibold
- Subsections: text-xl/text-2xl, font-semibold
- Body Text: text-base/text-lg, font-normal, leading-relaxed
- Labels/Meta: text-sm, font-medium, uppercase tracking-wide
- Calculator Results: text-2xl/text-3xl, font-mono, font-semibold

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 8, 12, 16** (e.g., p-4, gap-8, my-12)

**Container Strategy**:
- Full-width sections with inner `max-w-7xl mx-auto px-4`
- Content sections: `max-w-6xl` for balanced reading
- Forms/Calculators: `max-w-4xl` for focused interaction
- Comparison tables: Full `max-w-7xl` for data breathing room

**Grid Patterns**:
- Feature cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- Comparison elements: `grid-cols-1 lg:grid-cols-2 gap-12`
- Document library: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`

---

## Component Library

### Navigation
**Primary Header**: Sticky top navigation with logo left, main links center, CTA button right. Include subtle border-bottom. On mobile, collapse to hamburger menu.

### Hero Section
Full-width section (min-h-[600px]) with two-column layout:
- **Left Column (60%)**: Headline, subheadline, dual CTAs ("Начать опрос" primary, "Сравнить формы" secondary), trust indicators (e.g., "2000+ предпринимателей выбрали форму бизнеса")
- **Right Column (40%)**: Hero image showing dashboard preview or illustration of business decision-making

### Interactive Wizard Component
**Multi-step form** with:
- Progress indicator (step numbers or progress bar at top)
- Question card with generous padding (p-8)
- Radio buttons or card-based selection (visual cards preferred for options)
- Navigation: "Назад" subtle button, "Далее" primary button
- Results page with clear recommendation card, comparison table, downloadable summary

### Comparison Table
**Advanced data table**:
- Sticky header row
- Three columns (НПД, ИП, ООО) with clear visual separation
- Row categories with subtle background alternation
- Icons for checkmarks/crosses (Heroicons)
- Expandable rows for detailed information
- Filter sidebar with checkbox filters

### Calculator Cards
**Card-based calculators** (shadow-lg, rounded-xl):
- Input section: Form fields with clear labels, helper text, input validation
- Calculation trigger: Prominent "Рассчитать" button
- Results section: Large monospace numbers, breakdown table, visual progress bars for tax burden
- "Сохранить результат" option

### Document Library Grid
**Card grid layout**:
- Document cards with icon, title, category tag, "Скачать" button
- Category filter tabs at top
- Search input with icon
- Hover state: Subtle lift (shadow-md to shadow-xl)

### Knowledge Base
**Article cards** in masonry or standard grid:
- Featured image thumbnail (16:9 ratio)
- Category badge
- Title (text-xl font-semibold)
- Excerpt (text-sm line-clamp-3)
- Read time indicator
- "Читать далее" link

### Footer
**Comprehensive footer** (py-16):
- Four-column grid: Product links, Resources, Company, Contact
- Newsletter signup form
- Social media links
- Trust badges (if applicable - e.g., "Информация актуальна на 2024")
- Copyright and legal links

---

## Section Structure (Landing Page)

1. **Header**: Navigation with logo and CTAs
2. **Hero**: Two-column with headline, CTAs, and dashboard preview image
3. **Value Proposition**: Three-column feature grid (icons from Heroicons: DocumentCheck, Calculator, BookOpen) - "Мастер выбора", "Калькуляторы", "База знаний"
4. **How It Works**: Timeline or numbered steps (1-2-3 process)
5. **Comparison Preview**: Teaser of comparison table with CTA to full comparison
6. **Tools Showcase**: Two-column split - Calculator preview left, Document library preview right
7. **Social Proof**: Testimonial cards if available, or stats (e.g., "1000+ документов скачано")
8. **Final CTA**: Centered CTA block with primary action
9. **Footer**: Comprehensive footer as described

---

## Images

**Hero Image**: Dashboard mockup or illustration showing the wizard interface in action - professional, clean, with visible UI elements. Place in right column of hero (40% width).

**Section Illustrations**: Consider adding subtle illustrations or icons to break up text-heavy sections, particularly in "How It Works" and feature sections.

**Document Thumbnails**: Generic document icons or preview thumbnails for the library section.

---

## Icons

**Library**: Heroicons (via CDN) for all interface icons
- Navigation: Bars3Icon (menu), XMarkIcon (close)
- Features: DocumentCheckIcon, CalculatorIcon, BookOpenIcon, ShieldCheckIcon
- Actions: ArrowRightIcon, CheckCircleIcon, DownloadIcon

---

## Animations

**Minimal, purposeful animations**:
- Smooth scroll behavior for anchor links
- Fade-in on scroll for section reveals (intersection observer)
- Hover transitions on cards and buttons (transition-all duration-200)
- Wizard step transitions (slide/fade between questions)

---

## Accessibility

- Semantic HTML throughout (`<header>`, `<nav>`, `<main>`, `<section>`)
- ARIA labels for interactive elements
- Form inputs with proper labels and error states
- Keyboard navigation support for wizard and tables
- Focus states visible (ring-2 ring-offset-2)
- High contrast text (WCAG AA minimum)