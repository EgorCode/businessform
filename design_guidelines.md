# Design Guidelines: БизнесФорма - AI-Powered Growth Journey Platform

## Design Philosophy

**Core Concept**: Narrative-First, AI-Orchestrated Experience
- Replace static forms with an immersive "Growth Journey Canvas"
- Blend adaptive storytelling with data-rich interactive workspaces
- Make business decisions feel like exploring a personalized journey, not filling forms

**Differentiation Strategy**:
1. **Cinematic Storytelling** - Real cases of entrepreneurs' growth paths
2. **AI Co-Pilot** - Intelligent assistant analyzing documents and predicting outcomes
3. **Interactive Simulations** - Live stress-testing of business decisions
4. **3D Spatial Navigation** - Immersive archetype selection and journey exploration

---

## Visual Language

### Color System
- **Primary Blue** (217 91% 52%) - Trust, professionalism, AI elements
- **Success Green** (142 76% 58%) - Growth indicators, positive outcomes
- **Warning Amber** (25 95% 63%) - Threshold alerts, decision points
- **Data Purple** (280 87% 68%) - Analytics, projections, simulations
- **Neutral Grays** - Clean background hierarchy

### Typography
- **Primary**: Inter (400, 500, 600, 700) - UI, body text
- **Display**: Inter Bold (700) for headlines with tight tracking
- **Mono**: JetBrains Mono (400, 500, 600) - Numbers, code, data

### Spacing & Layout
- **Canvas-based layout** with floating panels instead of rigid grids
- **Asymmetric spacing** to create visual tension and focus
- **Layered depth** using shadows, blur, and z-index for hierarchy

---

## Core Components

### 1. Archetype Selector (Onboarding)
**3D Carousel Interface**:
- Three rotating cards: Blogger, Freelancer, Marketplace Founder
- Each card shows persona avatar, typical revenue path, common challenges
- Smooth rotation animations (CSS 3D transforms)
- Selection triggers personalized journey configuration

### 2. Growth Journey Canvas (Main Interface)
**Split-Screen Layout**:
- **Left Panel (30%)**: Vertical timeline with milestone markers
  - Icons for key events (first income, hiring, legal form changes)
  - Hover reveals contextual data layers (receipts, contracts, metrics)
  - Scrollable journey from start to current state
  
- **Right Panel (70%)**: Dynamic workspace bay
  - Morphs between: AI Chat, Calculators, Documents, Analytics
  - Smooth transitions using Framer Motion
  - Contextual to timeline position

### 3. AI FormaGPT Copilot
**Floating Chat Interface**:
- Minimized: Pulsing orb in bottom-right with notification badge
- Expanded: Chat panel with document upload, multimodal responses
- Features:
  - Document analysis (upload bank statements, contracts)
  - Scenario predictions with confidence scores
  - Tax structure recommendations
  - Auto-complete forms based on conversation

**Visual Design**:
- Glass-morphism style (backdrop-blur, semi-transparent)
- Message bubbles with syntax highlighting for numbers/dates
- AI responses show "thinking" animation with shimmer effect
- Code blocks for tax calculations with copy button

### 4. Blogger Case Study: "Путь Лены"
**Three-Act Structure**:

**Act 1: НПД Launch**
- Timeline: 0-6 months
- KPI Cards: 5K followers → 50K, 80K₽/month from ads
- Visual: Growth rings showing audience expansion
- Decision Log: "Registered НПД via app, took 1 day"
- Downloadable: НПД startup checklist

**Act 2: ИП Scaling**
- Timeline: 6-18 months  
- KPI Cards: 50K → 200K followers, 300K₽/month, first hire
- Visual: Income streams chart (ads, sponsorships, merch)
- Trigger Alert: "Income exceeded НПД limit (2.4M/year)"
- Decision Log: "Switched to ИП УСН 6%, hired assistant"
- AI Insight: "Tax savings: 120K₽/year vs ИП 15%"

**Act 3: ООО Expansion**
- Timeline: 18-36 months
- KPI Cards: 500K followers, 2M₽/month, team of 8
- Visual: Organizational chart, revenue breakdown
- Trigger Alert: "Multiple partners joined, brand deals require ООО"
- Decision Log: "Founded ООО, separated personal/business assets"
- AI Insight: "Liability protection value: 15M₽ in contracts"

**Interaction Design**:
- Each act is a full-screen scroll section with parallax
- Animated transitions showing growth metrics evolving
- Clickable decision points reveal detailed reasoning
- Compare button: "Посмотреть мой путь vs Лены"

### 5. Live Stress Test Simulator
**Interactive Sliders Interface**:
- **Input Sliders**:
  - Monthly Revenue (0 - 20M₽)
  - Number of Employees (0 - 100)
  - Number of Partners (1 - 10)
  - Annual Expenses (0 - 15M₽)

- **Real-Time Outputs**:
  - Recommended Legal Form (НПД/ИП/ООО) with confidence %
  - Tax Burden Comparison (bar chart animation)
  - Threshold Warnings (visual alerts when crossing limits)
  - Compliance Complexity Score (1-10 gauge)

**Visual Design**:
- Glass card with gradient background
- Animated transitions when thresholds crossed
- Color-coded zones (green=safe, yellow=approaching, red=exceeded)
- Floating tooltips explaining each metric

### 6. Command Palette Navigation
**Keyboard-First Interface** (Cmd/Ctrl + K):
- Search all tools, cases, documents
- Quick actions: "Calculate НПД tax", "Compare ИП vs ООО"
- Recent items and suggestions
- Fuzzy search with highlighted matches

**Radial Quick Actions** (Bottom-right):
- Circular menu with 6 sections
- Icons: Calculator, AI Chat, Cases, Documents, Stress Test, Settings
- Hover expands with labels
- Smooth rotation animation

---

## AI Features Specification

### FormaGPT Copilot Functions
1. **Document Analysis**
   - Upload: Bank statements, contracts, invoices
   - Extract: Income, expenses, business patterns
   - Suggest: Optimal tax structure

2. **Scenario Synthesizer**
   - Monte Carlo projections (revenue growth scenarios)
   - Timeline: When to switch legal forms
   - Risk analysis: What-if simulations

3. **Compliance Sentinel**
   - Track: Registration deadlines, tax filing dates
   - Remind: Upcoming obligations
   - Auto-generate: Reminder calendar

4. **Auto-Doc Composer**
   - Templates: Charters, employment contracts, partnership agreements
   - Auto-fill: From wizard answers and AI chat context
   - Export: PDF/DOCX with e-signature fields

---

## User Journey

**Phase 1: Immersive Onboarding**
1. 3D carousel archetype selection
2. Short animated intro of chosen path
3. AI greeting: "Привет! Я FormaGPT, ваш гид..."

**Phase 2: Growth Journey Exploration**
1. Timeline auto-populated based on archetype
2. Hover milestones to see contextual data
3. AI suggests: "Похоже, вы здесь 👉 [current stage]"

**Phase 3: Decision Mission**
1. AI chat: "Расскажите о вашем бизнесе"
2. Upload documents or manual input
3. Stress test simulator adjustments
4. Recommendation with reasoning

**Phase 4: Case Study Benchmark**
1. "Сравнить с путём Лены (blogger)"
2. Highlight similarities/differences
3. Download custom playbook

**Phase 5: Action Hub**
1. Auto-generate registration documents
2. Create task list with deadlines
3. Set up compliance calendar
4. AI monitoring dashboard

---

## Animation & Interactions

**Micro-interactions**:
- Slider thumb with magnetic snap to thresholds
- Card flip on archetype selection
- Shimmer effect on AI "thinking"
- Confetti on successful form completion
- Pulse animation on threshold breach alerts

**Page Transitions**:
- Fade + slide for timeline scrubbing
- Morph between workspace modes
- Parallax scroll for case study acts
- Smooth zoom for document preview

**Loading States**:
- Skeleton screens with shimmer
- Progress bars for AI analysis
- Animated checkmarks for task completion

---

## Accessibility

- **Keyboard Navigation**: Full command palette access
- **Screen Readers**: ARIA labels on all interactive elements
- **Color Contrast**: WCAG AAA for text, AA for UI elements
- **Motion**: Respect `prefers-reduced-motion`
- **Focus States**: Visible ring indicators

---

## Mobile Considerations

- **Responsive Canvas**: Timeline becomes horizontal carousel on mobile
- **Touch Gestures**: Swipe between workspace modes
- **Simplified Stress Test**: Fewer sliders, larger touch targets
- **Bottom Sheet**: AI chat slides up from bottom
- **Progressive Disclosure**: Expand sections on demand

---

## Technical Notes

- Use Framer Motion for animations
- React Spring for physics-based interactions
- Tailwind for utility styling
- Shadcn components as base
- AI integration via OpenAI API
- Chart.js or Recharts for data visualization
