# 🍎 iOS-Style Group Travel Planner (React)

A production-ready, mobile-first group travel planner built with React + Vite, following Apple's iOS design language and Human Interface Guidelines.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.1-646CFF) ![Zustand](https://img.shields.io/badge/Zustand-4.5-orange)

---

## 📱 Demo & Features

**Core Features (MVP):**
- ✅ Trip list with upcoming/past organization
- ✅ Trip detail with full information display
- ✅ Create new trips with form validation
- ✅ Schedule management (CRUD operations)
- ✅ Participant management with role distinction
- ✅ Organizer-only edit controls
- ✅ LocalStorage persistence via Zustand
- ✅ Fully responsive (mobile-first, desktop-aware)

**Design Quality:**
- iOS Settings app-style list layouts
- Subtle glassmorphism on hero sections
- Hairline separators (0.5px)
- System font stack (San Francisco-like)
- Full dark mode support
- No colorful icons or decorative UI

---

## 🛠 Tech Stack & Why

| Package | Version | Purpose |
|---------|---------|---------|
| **React** | 18.3 | Component architecture, hooks, virtual DOM |
| **Vite** | 5.1 | Lightning-fast dev server, optimized builds |
| **React Router** | 6.22 | Client-side routing, navigation |
| **Zustand** | 4.5 | Minimal state management (vs Redux: less boilerplate) |
| **React Hook Form** | 7.50 | Performant form handling, less re-renders |
| **Zod** | 3.22 | Type-safe schema validation |
| **Day.js** | 1.11 | Lightweight date manipulation (vs Moment: 97% smaller) |
| **CSS Modules** | native | Scoped styling, no utility clutter |

**Why Zustand over Redux Toolkit?**
- 90% less boilerplate code
- Smaller bundle size (~1KB vs ~10KB)
- Simpler mental model (no actions/reducers split)
- Built-in middleware (persist, immer)
- Perfect for small-medium apps
- Still scalable with slices pattern

**Why CSS Modules over Tailwind?**
- Better control for custom iOS design system
- Cleaner JSX without utility spam
- Component-scoped styles
- Better for precise pixel-perfect iOS aesthetics
- No "template-like" appearance

---

## 📦 Installation & Setup

### Prerequisites
```bash
Node.js: v18.0.0 or higher
npm: v9.0.0 or higher (or yarn/pnpm)
```

### Quick Start (3 commands)
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser (auto-opens at http://localhost:3000)
```

### Available Scripts
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

---

## 📁 Project Structure

```
travel-planner/
├── src/
│   ├── components/          # Reusable iOS-style components
│   │   ├── List/
│   │   │   ├── List.jsx
│   │   │   └── List.module.css
│   │   ├── Hero/
│   │   ├── Button/
│   │   ├── NavBar/
│   │   ├── Input/
│   │   └── index.js        # Barrel exports
│   ├── screens/            # Screen-level components
│   │   ├── TripListScreen.jsx
│   │   ├── TripDetailScreen.jsx
│   │   ├── CreateTripScreen.jsx
│   │   ├── Screen.module.css
│   │   └── index.js
│   ├── store/              # Zustand state management
│   │   └── travelStore.js
│   ├── styles/             # Global design tokens
│   │   ├── tokens.css      # iOS color system, spacing, typography
│   │   └── global.css      # Reset & base styles
│   ├── router.jsx          # React Router configuration
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── .eslintrc.cjs           # ESLint rules
├── .prettierrc             # Prettier config
└── README.md               # This file
```

---

## 🎨 iOS Design System

### Color Tokens
```css
/* Light Mode */
--ios-bg-primary: #f2f2f7        /* Grouped background */
--ios-bg-secondary: #ffffff      /* List items */
--ios-label-primary: #000000     /* Main text */
--ios-label-secondary: #3c3c43   /* Subtitles */
--ios-label-tertiary: #8e8e93    /* Captions */
--ios-separator: rgba(60,60,67,0.18)  /* Hairlines */
--ios-blue: #007aff              /* Accent */

/* Dark Mode (auto-adapts via prefers-color-scheme) */
--ios-bg-primary: #000000
--ios-bg-secondary: #1c1c1e
--ios-label-primary: #ffffff
/* ... */
```

### Spacing Scale
```css
--space-1: 4px   /* xs */
--space-2: 8px   /* sm */
--space-3: 12px  /* md */
--space-4: 16px  /* lg */
--space-5: 20px  /* xl */
--space-8: 32px  /* 2xl */
--space-10: 48px /* 3xl */
```

### Typography Scale
```css
--text-xs: 11px   /* Fine print */
--text-sm: 13px   /* Section headers */
--text-base: 15px /* Body */
--text-md: 17px   /* Default iOS size */
--text-2xl: 28px  /* Form titles */
--text-3xl: 34px  /* Hero titles */
```

### Component Patterns

**List Item (Settings-style):**
```jsx
<ListItem
  title="Main text"
  subtitle="Secondary text"
  chevron
  onClick={handleClick}
/>
```

**Glassmorphism Hero:**
```jsx
<Hero
  title="Large Title"
  subtitle="Subtitle text"
/>
```

**iOS Button:**
```jsx
<Button variant="primary" fullWidth>
  Action Text
</Button>
```

---

## 🗺 Implementation Roadmap

### Day 1: MVP Core (4-6 hours)
- [x] Project setup (Vite + React)
- [x] Design tokens & global styles
- [x] iOS-style components (List, Hero, Button, NavBar, Input)
- [x] Zustand store with mock data
- [x] Trip list screen
- [x] Trip detail screen
- [x] Create trip screen
- [x] Basic routing

### Day 2: Feature Completion (4-6 hours)
- [ ] Schedule CRUD screens
- [ ] Edit trip functionality
- [ ] Delete trip with confirmation
- [ ] Participant invite flow
- [ ] Date-based filtering
- [ ] Participant-based filtering
- [ ] Form validation with Zod
- [ ] Error handling & loading states

### Day 3: Polish & Optimization (3-4 hours)
- [ ] Animations (page transitions, list item interactions)
- [ ] Empty states for all screens
- [ ] Accessibility audit (ARIA labels, keyboard nav)
- [ ] Performance optimization (React.memo, lazy loading)
- [ ] Mobile gestures (swipe to delete)
- [ ] Share functionality (Web Share API)
- [ ] PWA setup (manifest, service worker)

### Day 4: Production Ready (2-3 hours)
- [ ] Unit tests (Vitest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Bundle size optimization
- [ ] Lighthouse audit (95+ score)
- [ ] Deployment (Vercel)
- [ ] Documentation finalization

---

## ⚠️ Top 5 Common Errors & Fixes

### 1. **Module path alias not working**
```bash
Error: Cannot find module '@components'
```
**Fix:** Ensure `vite.config.js` has correct path aliases:
```js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@components': path.resolve(__dirname, './src/components'),
  }
}
```

### 2. **CSS variables not applied**
```bash
Style shows var(--ios-bg-primary) as literal text
```
**Fix:** Import `global.css` in `main.jsx`:
```jsx
import '@styles/global.css'
```

### 3. **Zustand persist not working**
```bash
Data lost on page refresh
```
**Fix:** Wrap store creator with `persist` middleware:
```js
create(persist((set, get) => ({ ... }), { name: 'storage-key' }))
```

### 4. **Date input shows wrong format**
```bash
Date picker displays MM/DD/YYYY instead of YYYY-MM-DD
```
**Fix:** Always use ISO format for input[type="date"]:
```js
value={dayjs(date).format('YYYY-MM-DD')}
```

### 5. **Dark mode not activating**
```bash
Styles stick to light mode
```
**Fix:** Check device settings OR add manual toggle:
```js
// Test dark mode in dev tools:
// Chrome DevTools > Rendering > Emulate CSS media > prefers-color-scheme: dark
```

---

## 🚀 Deployment (Vercel)

### Step 1: Prepare for Production
```bash
# Test production build locally
npm run build
npm run preview

# Check bundle size
npx vite-bundle-visualizer
```

### Step 2: Deploy to Vercel
```bash
# Option A: Vercel CLI
npm i -g vercel
vercel

# Option B: GitHub Integration
# 1. Push to GitHub
# 2. Import project on vercel.com
# 3. Auto-detects Vite, zero config needed
```

### Step 3: Environment Variables (if needed)
```bash
# vercel.json (for future API integration)
{
  "env": {
    "VITE_API_URL": "https://api.example.com"
  }
}

# Access in code:
const apiUrl = import.meta.env.VITE_API_URL
```

### Deployment Checklist
- [ ] `npm run build` succeeds
- [ ] `npm run preview` works locally
- [ ] No console errors in production
- [ ] Mobile viewport tested
- [ ] Dark mode tested
- [ ] Performance > 90 (Lighthouse)

---

## 📋 Today's Action Checklist

**Copy-paste this into your task tracker:**

1. [ ] Run `npm install` to install all dependencies
2. [ ] Run `npm run dev` to start development server
3. [ ] Test trip list screen on mobile viewport (DevTools)
4. [ ] Create a new trip via UI
5. [ ] Edit trip details (when implemented)
6. [ ] Test dark mode (System Preferences or DevTools)
7. [ ] Review all component files in `src/components/`
8. [ ] Understand Zustand store structure in `src/store/travelStore.js`
9. [ ] Plan Day 2 features (schedule CRUD, filters)
10. [ ] Push to GitHub and deploy to Vercel

---

## 🔮 Future Enhancements

**Backend Integration:**
- [ ] Supabase for PostgreSQL + Auth
- [ ] Real-time updates via Supabase Realtime
- [ ] Image uploads for trip photos
- [ ] Invite system via email

**Advanced Features:**
- [ ] Budget tracking & expense splitting
- [ ] Map integration (Kakao Maps API)
- [ ] Weather forecast API
- [ ] Flight/accommodation booking links
- [ ] Export itinerary as PDF

**Performance:**
- [ ] Image lazy loading
- [ ] Route-based code splitting
- [ ] Service Worker for offline support
- [ ] IndexedDB for large datasets

**TypeScript Migration:**
```bash
# When ready to migrate:
npm install -D typescript @types/react @types/react-dom
# Rename .jsx → .tsx gradually
# Add tsconfig.json
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest + React Testing Library)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```js
// Example: List.test.jsx
import { render, screen } from '@testing-library/react'
import { ListItem } from './List'

test('renders list item with title', () => {
  render(<ListItem title="Test" />)
  expect(screen.getByText('Test')).toBeInTheDocument()
})
```

### E2E Tests (Playwright)
```bash
npm create playwright@latest
```

```js
// Example: trip-flow.spec.js
test('create and view trip', async ({ page }) => {
  await page.goto('/')
  await page.click('text=새로운 여행 만들기')
  await page.fill('input[placeholder*="여행 이름"]', '제주도')
  await page.click('text=완료')
  await expect(page.locator('text=제주도')).toBeVisible()
})
```

---

## 🤝 Contributing Guidelines

### Code Style
- Use functional components + hooks (no class components)
- Follow Airbnb React style guide
- Prefer named exports over default exports
- Keep components under 200 lines
- One component per file

### CSS Modules Naming
```css
/* PascalCase for component root */
.listItem { }

/* camelCase for variants */
.listItemActive { }

/* Avoid deep nesting (max 2 levels) */
.list .item .title { } /* ❌ Too deep */
.itemTitle { }         /* ✅ Better */
```

### Commit Convention
```bash
feat: add schedule CRUD screens
fix: correct date format in trip detail
style: adjust hero padding for notch devices
refactor: extract useTrip custom hook
docs: update deployment guide
```

---

## 📚 Learning Resources

**React + Vite:**
- [Vite Documentation](https://vitejs.dev)
- [React Hooks Reference](https://react.dev/reference/react)

**iOS Design:**
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)
- [iOS Design Themes](https://developer.apple.com/design/human-interface-guidelines/foundations/app-icons)

## 🎯 Design Philosophy

This project strictly follows **Apple iOS aesthetics**:
- Clean, minimal, breathable layouts
- iOS Settings app as the primary design reference
- No Material Design, no Android-style UI
- No colorful icons, no decorative elements
- System fonts and native-feeling interactions

## 🎨 Key Design Principles

### 1. Visual Hierarchy
- **Large titles**: 34px, bold, confident
- **Body text**: 17px, regular weight
- **Secondary text**: 15px, gray, subordinate
- Minimal use of bold except for titles

### 2. Glassmorphism (Used Sparingly)
Applied **only** to hero sections:
```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(28px);
border: 1px solid rgba(255, 255, 255, 0.25);
```
- Feels like thin iOS sheet overlay
- Not used for cards or list items
- Fallback for non-supporting browsers included

### 3. List-Based Layouts
Every screen uses iOS Settings-style lists:
- White background (`#ffffff`)
- Hairline separators (0.5px)
- 10px corner radius
- Large tap targets (min 44px height)
- Chevrons for navigable items

### 4. Color Palette
```
Background:      #f2f2f7 (iOS grouped background)
Elevated:        #ffffff (list backgrounds)
Primary Text:    #000000
Secondary Text:  #3c3c43
Tertiary Text:   #8e8e93
Blue Accent:     #007aff (iOS system blue)
Separator:       rgba(60, 60, 67, 0.18)
```

### 5. Spacing System
```
xs:  4px
sm:  8px
md:  12px
lg:  16px
xl:  20px
xxl: 32px
```
Large vertical spacing between sections (32px+).

### 6. Typography
```
Font Stack: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text"
Hero Title: 34px / 700
Form Title: 28px / 700
Body:       17px / 400
Caption:    15px / 400
Label:      13px / 400
```

## 📱 Screens Included

1. **Home (Trip List)**
   - Hero section with "여행" large title
   - List of upcoming trips
   - Past trips section
   - Primary action button at bottom

2. **Trip Detail**
   - Back navigation
   - Trip hero with name and dates
   - Segmented information sections:
     - Trip info (participants, budget, accommodation)
     - Schedule (daily itinerary)
     - Participants list
     - Actions (share, settings)

3. **Create Trip**
   - Modal-style presentation
   - Cancel / Done navigation
   - Form inputs for trip details
   - Date pickers
   - Invite participants action

4. **Join Trip**
   - Centered hero layout
   - Single input for invite code
   - Info card with instructions
   - Call-to-action button

## 🛠 Technical Implementation

### HTML Structure
- Semantic, accessible markup
- `data-navigate` attributes for routing
- Viewport meta tags for mobile
- Apple-specific meta tags for web app mode

### CSS Architecture
1. **Reset & Base**: Minimal reset, system font setup
2. **Screen Management**: Fade-in animations
3. **Navigation**: Sticky nav bar with blur effect
4. **Glassmorphism**: Hero sections only
5. **List Components**: iOS Settings-style cells
6. **Form Elements**: Native iOS input styling
7. **Buttons**: iOS-style rounded buttons
8. **Dark Mode**: Full support via `prefers-color-scheme`

### JavaScript
- Minimal navigation controller
- Screen transitions
- Optional haptic feedback
- Pull-to-refresh prevention

## 🚀 Usage

Simply open `index.html` in a mobile browser:

```bash
open index.html
```

Or serve locally:
```bash
python3 -m http.server 8000
# Visit: http://localhost:8000
```

For best experience:
- View on iPhone or in mobile simulator
- Use Safari for optimal rendering
- Enable "Add to Home Screen" for app-like feel

## 📐 Layout Rules

### Do's ✅
- Use hairline dividers (0.5px solid)
- Maintain 16px horizontal margins
- Apply 44px minimum tap target height
- Group related items in sections
- Add section headers in uppercase
- Use chevrons (`›`) for navigation items
- Keep glassmorphism subtle and minimal

### Don'ts ❌
- No colorful icons or badges
- No heavy shadows or depth effects
- No card-based layouts for lists
- No floating action buttons
- No material ripples or waves
- No decorative UI elements
- No complex gradients

## 🎭 Animation Guidelines

All animations should be:
- **Short**: 200-300ms maximum
- **Soft**: ease-out timing
- **Subtle**: gentle fades, no bouncing
- **Purposeful**: only when enhancing UX

Example:
```css
transition: opacity 0.15s ease, transform 0.1s ease;
```

## 📱 Responsive Behavior

- **< 428px**: Full mobile (default)
- **428px+**: Slightly increased margins
- **768px+**: Centered viewport with max-width constraint

## 🌙 Dark Mode

Automatically adapts via `prefers-color-scheme: dark`:
- Background: Pure black (`#000000`)
- Elevated: Dark gray (`#1c1c1e`)
- Text colors inverted appropriately
- Glassmorphism adjusted for dark backgrounds

## 🔧 Extending the Design

### Adding a New Screen
1. Add screen div with unique ID
2. Include status bar and nav bar
3. Use existing components (hero, lists)
4. Register in `app.js` screens object
5. Add navigation triggers

### Creating New List Items
```html
<div class="list-item" data-navigate="screen-id">
    <div class="list-item-content">
        <div class="list-item-title">Title</div>
        <div class="list-item-subtitle">Subtitle</div>
    </div>
    <div class="list-item-chevron">›</div>
</div>
```

### Label + Value Layout
```html
<div class="list-item">
    <div class="list-item-content">
        <div class="list-item-label">Label</div>
        <div class="list-item-value">Value</div>
    </div>
</div>
```

## 🎯 Core Philosophy Recap

> "Would Apple ship this?"

If any design choice feels:
- Decorative rather than functional
- Colorful without purpose
- Complex when simple would work
- Different from iOS Settings app style

**Then don't use it.**

This app prioritizes:
1. **Clarity** over complexity
2. **Content** over decoration
3. **Familiarity** over novelty
4. **Calmness** over excitement

## 📚 References

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- iOS Settings app (built-in reference)
- SF Pro font family
- Apple.com design patterns

## 📄 License

This project is a design reference and learning resource. Use freely for your projects.

---

**Built with iOS design principles in mind.**  
For questions or improvements, consider how Apple would solve the problem first.
