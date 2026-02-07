# ⚡️ IMMEDIATE START GUIDE

## 🚨 Prerequisites Installation (5 minutes)

### Step 1: Install Node.js

**Node.js is NOT currently installed on your system.** You need it to run this React app.

#### macOS Installation (Recommended: Homebrew)

```bash
# Option A: Install via Homebrew (recommended)
# If Homebrew not installed:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node.js:
brew install node@18

# Verify installation:
node --version  # Should show v18.x.x or higher
npm --version   # Should show v9.x.x or higher
```

#### Alternative: Direct Download

1. Visit: https://nodejs.org/en/download/
2. Download "LTS" version for macOS
3. Run the installer
4. Restart Terminal
5. Verify: `node --version`

---

## 🏃 Quick Start (After Node.js is installed)

### 1. Install Dependencies

```bash
cd /Users/gussy/working_ddong
npm install
```

**Expected time:** 1-2 minutes  
**Expected output:** "added 423 packages"

### 2. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.1.4  ready in 324 ms
  ➜  Local:   http://localhost:3000/
```

Browser will auto-open to `http://localhost:3000`

### 3. Verify It Works

You should see:
- ✅ "여행" hero section with glassmorphism
- ✅ List of trips (제주도, 부산, 강릉)
- ✅ Blue "새로운 여행 만들기" button at bottom
- ✅ iOS-style design (Settings app look)

---

## 📂 Project Structure Overview

```
working_ddong/
├── src/
│   ├── components/      # Reusable iOS-style UI components
│   │   ├── List/        # ListSection, ListItem
│   │   ├── Hero/        # Hero with glassmorphism
│   │   ├── Button/      # iOS-style buttons
│   │   ├── NavBar/      # Navigation bar
│   │   └── Input/       # Form inputs
│   ├── screens/         # Full screen components
│   │   ├── TripListScreen.jsx        # Home screen
│   │   ├── TripDetailScreen.jsx      # Trip info
│   │   └── CreateTripScreen.jsx      # New trip form
│   ├── store/
│   │   └── travelStore.js  # Zustand state management
│   ├── styles/
│   │   ├── tokens.css      # iOS design tokens
│   │   └── global.css      # Global styles
│   ├── router.jsx          # React Router setup
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── index.html              # HTML template
├── vite.config.js          # Build configuration
├── package.json            # Dependencies
├── README.md               # Full documentation
├── SETUP_GUIDE.md          # Detailed implementation guide
├── QUICK_REFERENCE.md      # Component usage cheat sheet
├── PACKAGES.md             # Package explanations
└── THIS FILE               # Quick start instructions
```

---

## 🎯 What You Have Right Now (MVP)

### ✅ Completed Features:

1. **Trip List Screen**
   - Hero section with glassmorphism
   - Upcoming trips list
   - Past trips section
   - "Create Trip" button

2. **Trip Detail Screen**
   - Hero with trip name and dates
   - Trip info (participants, budget, accommodation)
   - Schedule list
   - Participant list
   - Organizer-only edit controls

3. **Create Trip Screen**
   - Form with validation
   - Name, dates, budget, accommodation inputs
   - Creates trip and navigates to detail

4. **iOS Design System**
   - All design tokens (colors, spacing, typography)
   - Reusable components (List, Hero, Button, NavBar, Input)
   - Dark mode support
   - Hairline separators
   - Glassmorphism on heroes only

5. **State Management**
   - Zustand store with localStorage persistence
   - CRUD operations for trips
   - CRUD operations for schedules
   - Participant management
   - Role-based UI (organizer vs participant)

---

## 📋 TODAY'S CHECKLIST (Copy & Paste)

**Copy this into your notes app:**

- [ ] 1. Install Node.js (if not installed)
- [ ] 2. Run `npm install` in project directory
- [ ] 3. Run `npm run dev` to start server
- [ ] 4. Open browser to http://localhost:3000
- [ ] 5. Test creating a new trip
- [ ] 6. Test viewing trip details
- [ ] 7. Toggle dark mode in system settings (verify it works)
- [ ] 8. Resize browser to mobile width (test responsive design)
- [ ] 9. Review component files in `src/components/`
- [ ] 10. Read README.md "Day 2 Roadmap" section

---

## 🚀 Next Steps (Day 2)

Once the MVP is running, implement these features:

### Priority 1: Schedule CRUD (4 hours)
- [ ] Create `ScheduleFormScreen.jsx` (add/edit schedule)
- [ ] Create `ScheduleDetailScreen.jsx` (view schedule)
- [ ] Add delete schedule functionality
- [ ] Update router with new routes

**File location:** `src/screens/ScheduleFormScreen.jsx`  
**Reference:** See `SETUP_GUIDE.md` Part 3 for full code

### Priority 2: Form Validation (2 hours)
- [ ] Create `src/utils/validation.js` with Zod schemas
- [ ] Integrate React Hook Form in CreateTripScreen
- [ ] Add error display for all inputs
- [ ] Test validation rules

### Priority 3: Additional Screens (2 hours)
- [ ] Edit Trip screen (reuse CreateTripScreen with edit mode)
- [ ] Invite Participants screen
- [ ] Delete confirmation dialog

---

## 🎨 Design System Quick Reference

### Colors (Already Defined)
```css
Background:     #f2f2f7 (light) / #000000 (dark)
List Items:     #ffffff (light) / #1c1c1e (dark)
Primary Text:   #000000 (light) / #ffffff (dark)
Secondary Text: #3c3c43 (light) / #ebebf5 (dark)
Blue Accent:    #007aff
Red Destructive: #ff3b30
```

### Spacing
```css
4px / 8px / 12px / 16px / 20px / 32px / 48px
Default margin: 16px
Section gap: 32px
```

### Component Patterns
```jsx
// List with items
<ListSection header="Header">
  <ListItem title="Title" subtitle="Subtitle" chevron />
</ListSection>

// Hero
<Hero title="Large Title" subtitle="Subtitle" />

// Button
<Button variant="primary" fullWidth>Action</Button>

// Input
<Input label="Label" value={value} onChange={onChange} />
```

---

## ⚠️ Common First-Run Issues

### Issue 1: npm not found
**Solution:** Install Node.js (see Step 1 above)

### Issue 2: Port 3000 already in use
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### Issue 3: Blank screen
**Solution:** Check browser console for errors
- Open DevTools (Cmd+Opt+I)
- Check Console tab
- Most likely: path alias not resolved (restart dev server)

### Issue 4: CSS not loading
**Solution:** Hard refresh
- Chrome: Cmd+Shift+R
- Or clear cache and reload

---

## 📚 Documentation Map

| File | Purpose | Read When |
|------|---------|-----------|
| **START.md** | This file, quick start | Right now |
| **README.md** | Full documentation, roadmap | After first run |
| **SETUP_GUIDE.md** | Detailed implementation guide | When building Day 2 features |
| **QUICK_REFERENCE.md** | Component API cheat sheet | While coding |
| **PACKAGES.md** | Package explanations | When adding features |

---

## 🌐 Deployment (When Ready)

### Vercel (Recommended, Free)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Follow prompts (takes 2 minutes)
# Your app will be live at: https://your-app.vercel.app
```

**No configuration needed** - Vercel auto-detects Vite projects.

---

## 🐛 Getting Help

**If something doesn't work:**

1. Check Terminal output for error messages
2. Check Browser Console (DevTools → Console)
3. Verify Node.js version: `node --version` (must be 18+)
4. Try clean install: `rm -rf node_modules && npm install`
5. Restart dev server: Ctrl+C then `npm run dev`

**Still stuck?**
- Check `SETUP_GUIDE.md` Part 7: Troubleshooting
- Review error messages carefully
- Google the exact error message

---

## 💡 Pro Tips

1. **Use Mobile Viewport in DevTools**
   - Cmd+Opt+I → Device Toolbar (Cmd+Shift+M)
   - Select "iPhone 14 Pro"
   - Test all screens in mobile view

2. **Hot Module Replacement**
   - Save any file → browser auto-updates
   - No need to refresh manually

3. **Component Isolation**
   - Test components individually
   - Use QUICK_REFERENCE.md for syntax

4. **Dark Mode Testing**
   - DevTools → Rendering → Emulate CSS media
   - Toggle `prefers-color-scheme: dark`

5. **Git Workflow**
   ```bash
   git add .
   git commit -m "feat: add schedule CRUD"
   git push
   ```

---

## 🎯 Success Criteria

**Your MVP is successful when:**

- ✅ App loads in browser at http://localhost:3000
- ✅ Hero section shows glassmorphism effect
- ✅ Lists use iOS Settings-style design
- ✅ No colorful icons or decorative elements
- ✅ Creating a trip works and persists
- ✅ Viewing trip details shows all information
- ✅ Dark mode adapts automatically
- ✅ Mobile viewport looks native iOS
- ✅ No console errors in DevTools

---

## 📞 What to Do First (Literal Steps)

**Open Terminal and run these commands in order:**

```bash
# 1. Check if Node.js is installed
node --version

# If it says "command not found":
# → Install Node.js from https://nodejs.org

# 2. Navigate to project
cd /Users/gussy/working_ddong

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev

# 5. Browser should auto-open
# If not, open manually: http://localhost:3000

# 6. Test the app!
```

**That's it! You're now running a production-ready iOS-style travel planner.** 🎉

---

**Questions? Check README.md for full documentation.** 📖
