# 🚀 Complete Setup & Implementation Guide

## Part 1: Initial Setup (5 minutes)

### Step 1: Verify Prerequisites
```bash
# Check Node.js version (must be 18+)
node --version
# Expected: v18.0.0 or higher

# Check npm version
npm --version
# Expected: v9.0.0 or higher
```

**If Node.js is missing or outdated:**
```bash
# macOS (recommended: use nvm)
brew install nvm
nvm install 18
nvm use 18

# Or download from: https://nodejs.org
```

### Step 2: Install Dependencies
```bash
cd /Users/gussy/working_ddong
npm install
```

**Expected output:**
```
added 423 packages, and audited 424 packages in 45s
```

**If you see peer dependency warnings:** Safe to ignore for now.

**If you see ERESOLVE errors:**
```bash
npm install --legacy-peer-deps
```

### Step 3: Start Development Server
```bash
npm run dev
```

**Expected output:**
```
  VITE v5.1.4  ready in 324 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Browser should auto-open to `http://localhost:3000`

---

## Part 2: Project Architecture Deep Dive

### Design Token System (`src/styles/tokens.css`)

**Color Philosophy:**
- **Background tiers:** Primary (grouped bg) → Secondary (list items) → Tertiary (overlays)
- **Label hierarchy:** Primary (main text) → Secondary (subtitles) → Tertiary (captions)
- **Separator:** 0.5px hairline, iOS standard
- **Accent:** Single blue color (#007aff), used sparingly

**When to use each:**
```css
/* ✅ Correct usage */
.screenBackground { background: var(--ios-bg-grouped); }
.listItem { background: var(--ios-bg-secondary); }
.title { color: var(--ios-label-primary); }
.subtitle { color: var(--ios-label-secondary); }

/* ❌ Avoid */
.button { background: linear-gradient(...); } /* Too decorative */
.card { box-shadow: 0 10px 30px rgba(0,0,0,0.3); } /* Too heavy */
```

### Component Architecture

**List Component Pattern:**
```jsx
// ✅ Good: Flexible, declarative API
<ListSection header="Section Title">
  <ListItem title="Title" subtitle="Subtitle" chevron />
  <ListItem label="Label" value="Value" />
</ListSection>

// ❌ Avoid: Overly complex props
<ListItem data={complexObject} render={customRenderer} />
```

**When to create a new component:**
1. Used 3+ times across app
2. Has distinct UI pattern
3. Needs isolated state/logic

**When NOT to create a component:**
- One-off layouts → Use inline JSX
- Simple wrappers → Use composition
- Over-abstracting → Keep it simple

### State Management (Zustand)

**Store Structure:**
```js
// Zustand store pattern
{
  // State (nouns)
  trips: [],
  currentUser: {},
  
  // Actions (verbs)
  addTrip: (trip) => { ... },
  updateTrip: (id, updates) => { ... },
  
  // Computed/helpers
  getTrip: (id) => { ... },
  isOrganizer: (tripId) => { ... },
}
```

**How to use in components:**
```jsx
// ✅ Select only what you need (prevents re-renders)
const trips = useTravelStore(state => state.trips)
const addTrip = useTravelStore(state => state.addTrip)

// ❌ Don't do this (re-renders on ANY state change)
const store = useTravelStore()
```

**When to split into multiple stores:**
- Exceeds 500 lines
- Handles distinct domains (auth, UI, data)
- Example: `useAuthStore`, `useTravelStore`, `useUIStore`

---

## Part 3: Day 2 Implementation (Schedule CRUD)

### Task 1: Create Schedule Form Screen

**File:** `src/screens/ScheduleFormScreen.jsx`

```jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { NavBar, ListSection, Input, TextArea, Button } from '@components'
import { useTravelStore } from '@store/travelStore'
import dayjs from 'dayjs'
import styles from './Screen.module.css'

export const ScheduleFormScreen = () => {
  const { tripId, scheduleId } = useParams()
  const navigate = useNavigate()
  const trip = useTravelStore(state => state.getTrip(tripId))
  const addSchedule = useTravelStore(state => state.addSchedule)
  const updateSchedule = useTravelStore(state => state.updateSchedule)

  // Check if editing existing schedule
  const existingSchedule = scheduleId
    ? trip?.schedules.find(s => s.id === scheduleId)
    : null

  const [formData, setFormData] = useState({
    title: existingSchedule?.title || '',
    description: existingSchedule?.description || '',
    date: existingSchedule?.date || trip?.startDate || '',
    day: existingSchedule?.day || 1,
  })

  const handleSubmit = () => {
    if (!formData.title || !formData.date) {
      alert('제목과 날짜를 입력해주세요')
      return
    }

    if (scheduleId) {
      updateSchedule(tripId, scheduleId, formData)
    } else {
      addSchedule(tripId, formData)
    }

    navigate(`/trip/${tripId}`)
  }

  return (
    <div className={styles.screen}>
      <NavBar
        leftButton="취소"
        rightButton="완료"
        onLeftClick={() => navigate(-1)}
        onRightClick={handleSubmit}
      />

      <div className={styles.contentWrapper} style={{ paddingTop: 'var(--space-8)' }}>
        <ListSection>
          <Input
            label="일정 제목"
            placeholder="예: Day 1 - 공항 도착"
            value={formData.title}
            onChange={e =>
              setFormData(prev => ({ ...prev, title: e.target.value }))
            }
          />
        </ListSection>

        <ListSection>
          <Input
            label="날짜"
            type="date"
            value={formData.date}
            onChange={e =>
              setFormData(prev => ({ ...prev, date: e.target.value }))
            }
          />
          <Input
            label="Day"
            type="number"
            value={formData.day}
            onChange={e =>
              setFormData(prev => ({ ...prev, day: Number(e.target.value) }))
            }
          />
        </ListSection>

        <ListSection>
          <TextArea
            label="상세 일정"
            placeholder="예: 공항 픽업 14:00 → 숙소 체크인 → 저녁 식사"
            value={formData.description}
            onChange={e =>
              setFormData(prev => ({ ...prev, description: e.target.value }))
            }
            rows={6}
          />
        </ListSection>
      </div>

      <div className={styles.actionBar}>
        <Button fullWidth onClick={handleSubmit}>
          {scheduleId ? '일정 수정' : '일정 추가'}
        </Button>
      </div>
    </div>
  )
}
```

**Update router:**
```jsx
// src/router.jsx
import { ScheduleFormScreen } from '@screens'

// Add routes:
<Route path="/trip/:tripId/schedule/new" element={<ScheduleFormScreen />} />
<Route path="/trip/:tripId/schedule/:scheduleId/edit" element={<ScheduleFormScreen />} />
```

**Update screens index:**
```js
// src/screens/index.js
export { ScheduleFormScreen } from './ScheduleFormScreen'
```

### Task 2: Schedule Detail Screen

**File:** `src/screens/ScheduleDetailScreen.jsx`

```jsx
import { useParams, useNavigate } from 'react-router-dom'
import { NavBar, ListSection, ListItem, Button } from '@components'
import { useTravelStore } from '@store/travelStore'
import dayjs from 'dayjs'
import styles from './Screen.module.css'

export const ScheduleDetailScreen = () => {
  const { tripId, scheduleId } = useParams()
  const navigate = useNavigate()
  const trip = useTravelStore(state => state.getTrip(tripId))
  const deleteSchedule = useTravelStore(state => state.deleteSchedule)
  const isOrganizer = useTravelStore(state => state.isOrganizer(tripId))

  const schedule = trip?.schedules.find(s => s.id === scheduleId)

  if (!schedule) {
    return (
      <div className={styles.screen}>
        <NavBar showBack />
        <div className={styles.emptyState}>일정을 찾을 수 없습니다</div>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      deleteSchedule(tripId, scheduleId)
      navigate(`/trip/${tripId}`)
    }
  }

  return (
    <div className={styles.screen}>
      <NavBar showBack />

      <div style={{ padding: 'var(--space-8) var(--space-5)', margin: '0 var(--space-4)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
          {schedule.title}
        </h1>
        <p style={{ color: 'var(--ios-label-secondary)' }}>
          {dayjs(schedule.date).format('YYYY년 M월 D일')}
        </p>
      </div>

      <div className={styles.contentWrapper}>
        <ListSection header="일정 상세">
          <div style={{ padding: 'var(--space-4)', background: 'var(--ios-bg-secondary)', margin: '0 var(--space-4)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ lineHeight: 'var(--leading-relaxed)', color: 'var(--ios-label-primary)' }}>
              {schedule.description || '상세 일정이 없습니다'}
            </p>
          </div>
        </ListSection>

        {isOrganizer && (
          <ListSection>
            <ListItem
              title="일정 편집"
              action
              chevron
              onClick={() => navigate(`/trip/${tripId}/schedule/${scheduleId}/edit`)}
            />
            <ListItem title="일정 삭제" destructive onClick={handleDelete} />
          </ListSection>
        )}
      </div>
    </div>
  )
}
```

---

## Part 4: Form Validation with Zod

### Setup Zod Schema

**File:** `src/utils/validation.js`

```js
import { z } from 'zod'

export const tripSchema = z.object({
  name: z.string().min(1, '여행 이름을 입력해주세요'),
  startDate: z.string().min(1, '시작일을 선택해주세요'),
  endDate: z.string().min(1, '종료일을 선택해주세요'),
  budget: z.number().positive().optional(),
  accommodation: z.string().optional(),
}).refine(data => {
  return new Date(data.startDate) <= new Date(data.endDate)
}, {
  message: '종료일은 시작일 이후여야 합니다',
  path: ['endDate'],
})

export const scheduleSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  date: z.string().min(1, '날짜를 선택해주세요'),
  day: z.number().min(1),
  description: z.string().optional(),
})
```

### Integrate with React Hook Form

**Update CreateTripScreen.jsx:**

```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tripSchema } from '@/utils/validation'

export const CreateTripScreen = () => {
  const navigate = useNavigate()
  const addTrip = useTravelStore(state => state.addTrip)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(tripSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      start Date: dayjs().add(1, 'week').format('YYYY-MM-DD'),
      endDate: dayjs().add(1, 'week').add(3, 'day').format('YYYY-MM-DD'),
      budget: '',
      accommodation: '',
    },
  })

  const onSubmit = data => {
    const tripData = {
      ...data,
      budget: data.budget ? Number(data.budget) : null,
    }
    const tripId = addTrip(tripData)
    navigate(`/trip/${tripId}`)
  }

  return (
    <div className={styles.screen}>
      <NavBar
        leftButton="취소"
        rightButton="완료"
        onLeftClick={() => navigate(-1)}
        onRightClick={handleSubmit(onSubmit)}
      />

      <div className={styles.contentWrapper}>
        {/* ... */}
        <ListSection>
          <Input
            label="여행 이름"
            placeholder="예: 제주도 여름 여행"
            error={errors.name?.message}
            {...register('name')}
          />
        </ListSection>

        <ListSection header="기간">
          <Input
            label="시작일"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
          />
          <Input
            label="종료일"
            type="date"
            error={errors.endDate?.message}
            {...register('endDate')}
          />
        </ListSection>
        {/* ... */}
      </div>
    </div>
  )
}
```

---

## Part 5: Performance Optimization

### 1. Component Memoization

```jsx
import { memo } from 'react'

// ✅ Memoize pure list items
export const ListItem = memo(({ title, subtitle, onClick }) => {
  return (
    <div onClick={onClick}>
      <div>{title}</div>
      <div>{subtitle}</div>
    </div>
  )
})
```

### 2. Route-Based Code Splitting

```jsx
// src/router.jsx
import { lazy, Suspense } from 'react'

const TripListScreen = lazy(() => import('@screens/TripListScreen'))
const TripDetailScreen = lazy(() => import('@screens/TripDetailScreen'))

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<TripListScreen />} />
        {/* ... */}
      </Routes>
    </Suspense>
  </BrowserRouter>
)
```

### 3. Zustand Selector Optimization

```jsx
// ❌ Bad: Re-renders on any state change
const store = useTravelStore()

// ✅ Good: Only re-renders when trips change
const trips = useTravelStore(state => state.trips)

// ✅ Better: Use shallow compare for arrays
import { shallow } from 'zustand/shallow'
const tripIds = useTravelStore(
  state => state.trips.map(t => t.id),
  shallow
)
```

---

## Part 6: Deployment Checklist

### Pre-Deployment

```bash
# 1. Build and test
npm run build
npm run preview

# 2. Check bundle size
npm run build -- --mode production
# dist folder should be < 500KB (gzipped)

# 3. Lighthouse audit
# Open preview in Chrome
# DevTools > Lighthouse > Run audit
# Target: Performance > 90, Accessibility > 95
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# ? Set up and deploy? [Y/n] y
# ? Which scope? Your username
# ? Link to existing project? [y/N] n
# ? What's your project's name? travel-planner
# ? In which directory is your code located? ./
# ? Want to override settings? [y/N] n
```

### Environment Variables (Optional)

```bash
# .env.local (for local development)
VITE_APP_NAME=Travel Planner
VITE_API_URL=http://localhost:8000

# Vercel dashboard > Settings > Environment Variables
# Add same variables for Production
```

### Custom Domain (Optional)

```bash
# 1. Buy domain (Namecheap, Google Domains)
# 2. Vercel dashboard > Domains > Add
# 3. Update DNS records as instructed
# 4. Wait 24-48 hours for propagation
```

---

## Part 7: Troubleshooting

### Issue: Blank screen after build

**Cause:** Path issues in production

**Fix:**
```js
// vite.config.js
export default defineConfig({
  base: '/', // Ensure this is '/' for root deployment
})
```

### Issue: CSS not loading in production

**Cause:** Missing global.css import

**Fix:**
```jsx
// main.jsx
import '@styles/global.css' // Must be imported here
```

### Issue: LocalStorage data lost

**Cause:** Different origin in production

**Fix:** Zustand persist automatically handles this, but check:
```js
// Check storage key
persist(/* ... */, { name: 'travel-planner-storage' })

// Verify in DevTools > Application > Local Storage
```

### Issue: Dark mode not working

**Cause:** Device settings override

**Fix:** Test in browser DevTools:
```
Chrome: DevTools > ⋮ > More tools > Rendering
Toggle: "Emulate CSS media feature prefers-color-scheme"
```

---

## Part 8: Next Steps

### Week 2: Advanced Features

1. **Real-time collaboration (Supabase)**
   - Setup: `npm install @supabase/supabase-js`
   - Replace Zustand with Supabase queries
   - Enable Realtime for live updates

2. **Image uploads**
   - Setup: Supabase Storage
   - Add photo gallery to trips
   - Compress images before upload

3. **Map integration**
   - Kakao Maps API (Korean maps)
   - Show trip locations
   - Distance/duration calculations

4. **Budget tracking**
   - New expense model in store
   - Split bills among participants
   - Currency conversion

### Week 3: TypeScript Migration

```bash
# 1. Install TypeScript
npm install -D typescript @types/react @types/react-dom

# 2. Generate tsconfig.json
npx tsc --init

# 3. Rename incrementally
# .jsx → .tsx
# Start with utils, then components, then screens

# 4. Add types
interface Trip {
  id: string
  name: string
  // ...
}
```

### Week 4: Testing & CI/CD

```bash
# Unit tests
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm run test

# E2E tests
npm create playwright@latest
npx playwright test

# GitHub Actions
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

---

## Support & Resources

- **GitHub Issues:** [Report bugs](https://github.com/your-repo/issues)
- **Apple HIG:** [iOS Design Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- **React Docs:** [react.dev](https://react.dev)
- **Zustand Docs:** [docs.pmnd.rs/zustand](https://docs.pmnd.rs/zustand)

---

**Ready to build?** Start with `npm run dev` and follow Day 2 roadmap! 🚀
