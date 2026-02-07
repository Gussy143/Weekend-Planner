# 📦 Package Installation Commands

## Required Dependencies (Production)

```bash
npm install react@^18.3.1 react-dom@^18.3.1
```
**Why:** Core React library for building UI components

```bash
npm install react-router-dom@^6.22.0
```
**Why:** Client-side routing and navigation between screens

```bash
npm install zustand@^4.5.0
```
**Why:** Lightweight state management (vs Redux: 90% less boilerplate, ~1KB bundle)

```bash
npm install react-hook-form@^7.50.1
```
**Why:** Performant form handling with minimal re-renders

```bash
npm install zod@^3.22.4 @hookform/resolvers@^3.3.4
```
**Why:** Type-safe schema validation for forms

```bash
npm install dayjs@^1.11.10
```
**Why:** Lightweight date library (vs Moment: 97% smaller, ~2KB)

---

## Development Dependencies

```bash
npm install -D vite@^5.1.4 @vitejs/plugin-react@^4.2.1
```
**Why:** Fast build tool and dev server (vs CRA: 10-100x faster)

```bash
npm install -D @types/react@^18.3.1 @types/react-dom@^18.3.0
```
**Why:** TypeScript type definitions (useful even for JS projects)

```bash
npm install -D eslint@^8.57.0
npm install -D eslint-plugin-react@^7.34.0
npm install -D eslint-plugin-react-hooks@^4.6.0
npm install -D eslint-plugin-react-refresh@^0.4.5
```
**Why:** Code quality and best practices enforcement

```bash
npm install -D prettier@^3.2.5
```
**Why:** Consistent code formatting (integrates with ESLint)

---

## One-Command Install (Fastest)

Copy and paste this single command:

```bash
npm install react@^18.3.1 react-dom@^18.3.1 react-router-dom@^6.22.0 react-hook-form@^7.50.1 zod@^3.22.4 @hookform/resolvers@^3.3.4 dayjs@^1.11.10 zustand@^4.5.0 && npm install -D @types/react@^18.3.1 @types/react-dom@^18.3.0 @vitejs/plugin-react@^4.2.1 vite@^5.1.4 eslint@^8.57.0 eslint-plugin-react@^7.34.0 eslint-plugin-react-hooks@^4.6.0 eslint-plugin-react-refresh@^0.4.5 prettier@^3.2.5
```

---

## Optional: Testing Libraries

### Unit Testing (Vitest + React Testing Library)

```bash
npm install -D vitest@^1.3.1
npm install -D @testing-library/react@^14.2.1
npm install -D @testing-library/jest-dom@^6.4.2
npm install -D @testing-library/user-event@^14.5.2
npm install -D jsdom@^24.0.0
```

**Add to package.json:**
```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "coverage": "vitest --coverage"
}
```

### E2E Testing (Playwright)

```bash
npm create playwright@latest
```

**Auto-installs:**
- @playwright/test
- Browsers (Chromium, Firefox, WebKit)

---

## Optional: Advanced Features

### Supabase (Backend as a Service)

```bash
npm install @supabase/supabase-js@^2.39.7
```

**Why:** PostgreSQL database + Auth + Storage + Realtime subscriptions

**Setup:**
```js
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Firebase (Alternative Backend)

```bash
npm install firebase@^10.8.1
```

**Why:** Real-time database + Auth + Cloud Storage + Hosting

### Image Compression

```bash
npm install browser-image-compression@^2.0.2
```

**Why:** Compress images before upload (reduce storage costs)

### Map Integration (Kakao Maps for Korea)

```bash
npm install react-kakao-maps-sdk@^1.1.24
```

**Why:** Korean-optimized map with places/routing API

---

## Verification Commands

After installation, verify everything works:

```bash
# Check package versions
npm list react react-dom react-router-dom zustand

# Check for vulnerabilities
npm audit

# Fix auto-fixable vulnerabilities
npm audit fix

# Check outdated packages
npm outdated
```

---

## Package Size Comparison

| Package | Size (minified + gzipped) | Alternative | Alt Size |
|---------|---------------------------|-------------|----------|
| Zustand | 1.2 KB | Redux Toolkit | 12 KB |
| Day.js | 2.9 KB | Moment.js | 67 KB |
| Zod | 14 KB | Yup | 45 KB |
| React Hook Form | 9 KB | Formik | 21 KB |

**Total bundle savings: ~110 KB** (faster load time on mobile)

---

## Troubleshooting Install Issues

### Issue: `npm ERR! ERESOLVE unable to resolve dependency tree`

**Fix 1:** Use legacy peer deps
```bash
npm install --legacy-peer-deps
```

**Fix 2:** Update npm
```bash
npm install -g npm@latest
```

### Issue: `Cannot find module 'node:path'`

**Fix:** Update Node.js to v18+
```bash
# macOS (with nvm)
nvm install 18
nvm use 18

# Check version
node --version
```

### Issue: `Permission denied` errors

**Fix:** Don't use sudo, fix npm permissions
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### Issue: Slow install on macOS

**Fix:** Use npm v9+ (faster than yarn/pnpm on M1/M2)
```bash
npm install -g npm@latest
```

---

## Clean Install (Fresh Start)

If something goes wrong, start fresh:

```bash
# Remove old files
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

---

## Bundle Size Analysis

After building, analyze what's taking up space:

```bash
# Install analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
})

# Build and view
npm run build
# Opens stats.html in browser
```

---

## Migration Path: JavaScript → TypeScript (Later)

When ready to add TypeScript:

```bash
# Install TypeScript
npm install -D typescript@^5.3.3

# Generate config
npx tsc --init

# Update vite.config.js → vite.config.ts
# Rename .jsx → .tsx gradually
# Start with utility files, then components
```

**Recommended tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

**All packages installed?** Run `npm run dev` to start building! 🚀
