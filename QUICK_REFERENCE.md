# 📝 Quick Reference: iOS Design Patterns

## Component Usage Cheat Sheet

### List Components

```jsx
// Basic list with header
<ListSection header="Section Title">
  <ListItem title="Title only" />
  <ListItem title="Title" subtitle="Subtitle" />
  <ListItem label="Label" value="Value" />
  <ListItem title="Navigate" chevron onClick={handleClick} />
  <ListItem title="Action" action onClick={handleAction} />
  <ListItem title="Delete" destructive onClick={handleDelete} />
</ListSection>

// Without header
<ListSection>
  <ListItem title="Item 1" />
  <ListItem title="Item 2" />
</ListSection>
```

### Hero Section

```jsx
// Standard hero
<Hero title="Large Title" subtitle="Subtitle text" />

// Centered hero
<Hero title="Title" subtitle="Subtitle" centered />
```

### Navigation Bar

```jsx
// With back button
<NavBar showBack backLabel="뒤로" />

// With custom buttons
<NavBar
  leftButton="취소"
  rightButton="완료"
  onLeftClick={handleCancel}
  onRightClick={handleDone}
/>

// With title
<NavBar title="Screen Title" showBack />
```

### Buttons

```jsx
// Primary (blue)
<Button variant="primary" fullWidth>Primary Action</Button>

// Secondary (gray)
<Button variant="secondary">Secondary</Button>

// Ghost (transparent)
<Button variant="ghost">Ghost</Button>

// Destructive (red)
<Button variant="destructive">Delete</Button>

// Small size
<Button size="small">Small Button</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Form Inputs

```jsx
// Text input
<Input
  label="Label"
  placeholder="Placeholder"
  value={value}
  onChange={e => setValue(e.target.value)}
  error={error}
/>

// Date input
<Input type="date" label="Date" value={date} onChange={handleChange} />

// Number input
<Input type="number" label="Amount" value={amount} onChange={handleChange} />

// Textarea
<TextArea
  label="Description"
  rows={6}
  value={text}
  onChange={e => setText(e.target.value)}
/>
```

---

## Zustand Store Patterns

### Read State

```jsx
// Select specific value
const trips = useTravelStore(state => state.trips)

// Select multiple values
const { trips, currentUser } = useTravelStore(state => ({
  trips: state.trips,
  currentUser: state.currentUser,
}))

// Select computed value
const tripCount = useTravelStore(state => state.trips.length)
```

### Call Actions

```jsx
const addTrip = useTravelStore(state => state.addTrip)
const updateTrip = useTravelStore(state => state.updateTrip)
const deleteTrip = useTravelStore(state => state.deleteTrip)

// Use in handlers
const handleCreate = () => {
  const tripId = addTrip({ name: 'New Trip', /* ... */ })
  navigate(`/trip/${tripId}`)
}

const handleUpdate = () => {
  updateTrip(tripId, { name: 'Updated Name' })
}

const handleDelete = () => {
  deleteTrip(tripId)
  navigate('/')
}
```

---

## Router Patterns

### Navigation

```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// Navigate to path
navigate('/trip/new')

// Navigate with params
navigate(`/trip/${tripId}`)

// Go back
navigate(-1)

// Replace current entry
navigate('/login', { replace: true })
```

### Get URL Params

```jsx
import { useParams } from 'react-router-dom'

const { tripId, scheduleId } = useParams()
```

### Get Query Params

```jsx
import { useSearchParams } from 'react-router-dom'

const [searchParams] = useSearchParams()
const filter = searchParams.get('filter') // ?filter=upcoming
```

---

## Date Formatting (Day.js)

```jsx
import dayjs from 'dayjs'

// Format date
dayjs('2026-08-15').format('YYYY년 M월 D일')
// → "2026년 8월 15일"

// Relative time
dayjs().add(7, 'day')   // 7 days from now
dayjs().subtract(1, 'month') // 1 month ago

// Comparison
const isFuture = dayjs(date).isAfter(dayjs())
const isPast = dayjs(date).isBefore(dayjs())

// ISO format for inputs
dayjs().format('YYYY-MM-DD') // → "2026-02-07"
```

---

## CSS Token Reference

### Colors (Light Mode)

```css
--ios-bg-primary: #f2f2f7      /* Screen background */
--ios-bg-secondary: #ffffff    /* List items */
--ios-label-primary: #000000   /* Main text */
--ios-label-secondary: #3c3c43 /* Subtitles */
--ios-label-tertiary: #8e8e93  /* Captions */
--ios-blue: #007aff            /* Actions */
--ios-red: #ff3b30             /* Destructive */
--ios-separator: rgba(60,60,67,0.18) /* Hairlines */
```

### Spacing

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px   /* Default margin */
--space-5: 20px
--space-8: 32px   /* Section spacing */
--space-10: 48px  /* Large gaps */
```

### Typography

```css
--text-sm: 13px    /* Section headers */
--text-base: 15px  /* Body text */
--text-md: 17px    /* iOS default */
--text-2xl: 28px   /* Form titles */
--text-3xl: 34px   /* Hero titles */

--weight-regular: 400
--weight-semibold: 600
--weight-bold: 700
```

### Border Radius

```css
--radius-md: 10px   /* List sections */
--radius-lg: 12px   /* Buttons */
--radius-2xl: 20px  /* Hero cards */
```

---

## Common Layouts

### Screen Container

```jsx
<div className={styles.screen}>
  <NavBar showBack />
  <Hero title="Title" subtitle="Subtitle" />
  <div className={styles.contentWrapper}>
    {/* Content */}
  </div>
  <div className={styles.actionBar}>
    <Button fullWidth>Action</Button>
  </div>
</div>
```

### Empty State

```jsx
<div className={styles.emptyState}>
  <div className={styles.emptyStateTitle}>No Items</div>
  <div className={styles.emptyStateText}>
    Create your first item to get started
  </div>
</div>
```

### Info Card

```jsx
<div className={styles.infoCard}>
  <p className={styles.infoText}>
    Helpful information or tips for the user.
  </p>
</div>
```

---

## iOS Design Rules (Quick Checklist)

### ✅ Do:
- Use hairline separators (0.5px)
- Maintain 16px horizontal margins
- Apply 44px minimum tap targets
- Group related items in sections
- Use chevrons for navigation
- Keep glassmorphism subtle
- Prefer white/gray/blue only
- Make primary action obvious

### ❌ Don't:
- Colorful icons or badges
- Heavy shadows or gradients
- Card-based list layouts
- Floating action buttons
- Material Design patterns
- Decorative UI elements
- Over-bold text everywhere
- Complex animations

---

## Debugging Tips

### Check Component Props

```jsx
// Add to any component for debugging
console.log('Props:', props)

// Or use React DevTools
// Chrome Extension: React Developer Tools
```

### Check Zustand State

```jsx
// In component
const state = useTravelStore()
console.log('Full state:', state)

// Or in browser console
// Zustand exposes state via devtools
```

### Check CSS Variables

```js
// In browser console
getComputedStyle(document.documentElement)
  .getPropertyValue('--ios-blue')
// → "#007aff"
```

### Mobile Viewport Testing

```
Chrome DevTools:
1. Cmd+Opt+I (Mac) / F12 (Windows)
2. Click device toolbar icon (Cmd+Shift+M)
3. Select "iPhone 14 Pro" from dropdown
4. Test interactions
```

---

## Performance Optimization Checklist

- [ ] Use `React.memo` for list items
- [ ] Implement route-based code splitting
- [ ] Optimize Zustand selectors (shallow compare)
- [ ] Lazy load heavy components
- [ ] Compress images before upload
- [ ] Enable gzip compression (Vercel auto-handles)
- [ ] Check bundle size: `npm run build`
- [ ] Run Lighthouse audit: Score > 90

---

## Git Workflow

```bash
# Daily workflow
git pull origin main
git checkout -b feature/schedule-crud
# ... make changes ...
git add .
git commit -m "feat: add schedule CRUD screens"
git push origin feature/schedule-crud

# Merge to main
git checkout main
git merge feature/schedule-crud
git push origin main
```

---

## Useful VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier - Code formatter
- Auto Rename Tag
- Color Highlight
- Path Intellisense
- CSS Modules

---

## Quick Commands

```bash
# Development
npm run dev            # Start dev server
npm run build          # Production build
npm run preview        # Preview build
npm run lint           # Check code quality
npm run format         # Format code

# Git
git status             # Check changes
git log --oneline      # View commits
git diff               # See unstaged changes

# Package management
npm install <package>  # Add dependency
npm uninstall <package> # Remove dependency
npm outdated           # Check for updates
npm update             # Update packages
```

---

**Print this page and keep it handy while coding!** 📄✨
