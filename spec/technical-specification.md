# Technical Architecture & Stack Specification

**Portfolio:** DevOps/SRE Engineer Portfolio  
**Date:** February 2, 2026  

---

## 1. Technology Stack Overview

```
┌─────────────────────────────────────────────────────┐
│           FRONTEND (React/TypeScript)                │
│  - React 19.2.0 (UI Framework)                      │
│  - TypeScript 5.9.3 (Type Safety)                   │
│  - Tailwind CSS 4.1.18 (Styling)                    │
│  - Vite 7.2.4 (Build/Dev Server)                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│          CI/CD & DEPLOYMENT (GitHub)                 │
│  - GitHub Actions (Automation)                      │
│  - GitHub Pages (Static Hosting)                    │
│  - Release-prod Branch (Deployment Trigger)         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         CONTAINERIZATION & ORCHESTRATION             │
│  - Docker (Containerization)                        │
│  - Docker Compose (Local Orchestration)             │
│  - Nginx (Web Server - Production)                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         HOSTING & DELIVERY                           │
│  - GitHub Pages CDN                                 │
│  - HTTPS with Let's Encrypt                         │
│  - Global Content Delivery                          │
└─────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 React Component Hierarchy

```
<App>
  ├── <Header>
  │   ├── <Logo>
  │   ├── <Navigation>
  │   └── <MobileMenu>
  ├── <Routes>
  │   ├── <HomePage>
  │   ├── <ProjectsPage>
  │   ├── <ProjectDetailPage>
  │   ├── <AboutPage>
  │   ├── <ContactPage>
  │   └── <BlogPage> (optional)
  ├── <Footer>
  └── <ScrollToTop>
```

### 2.2 Component Categories

**Layout Components**
- App.tsx (main wrapper)
- Header.tsx (top navigation)
- Footer.tsx (bottom footer)
- Container.tsx (max-width wrapper)
- Section.tsx (spacing wrapper)

**Page Components**
- HomePage.tsx
- ProjectsPage.tsx
- ProjectDetailPage.tsx
- AboutPage.tsx
- ContactPage.tsx

**Feature Components**
- ProjectCard.tsx
- SkillCard.tsx
- ExperienceTimeline.tsx
- ContactForm.tsx
- CodeBlock.tsx

**UI Components**
- Button.tsx
- Badge.tsx
- Card.tsx
- Modal.tsx
- Toast.tsx

### 2.3 State Management
- React Hooks (useState, useEffect, useContext)
- No external state library (keep it simple)
- Context API for theme/user preferences if needed

### 2.4 Routing
- React Router v6 for client-side routing
- Lazy loading for route components
- Dynamic route generation from data

---

## 3. Styling Architecture

### 3.1 Tailwind CSS Setup
```
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

### 3.2 Color Palette
- Primary: Blue (for tech/dev theme)
- Secondary: Green (for success/devops)
- Accent: Orange (for important CTAs)
- Neutral: Gray scale (text, backgrounds)
- Dark mode: Inverted colors (future)

### 3.3 Responsive Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+
- Ultra-wide: 1280px+

### 3.4 Typography
- Headings: Inter or similar sans-serif
- Body: Inter or similar sans-serif
- Code: Monospace (Monaco, Menlo)
- Font sizes: 12px to 48px scale

---

## 4. Build & Development Workflow

### 4.1 Vite Configuration
```typescript
export default defineConfig({
  base: '/polak008-01/', // GitHub Pages base path
  plugins: [react(), tailwindcss()],
  build: {
    target: 'ES2020',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 5173,
    open: true
  }
})
```

### 4.2 Build Process
1. TypeScript compilation
2. React transformation (JSX → JS)
3. Tailwind CSS processing
4. Code splitting by route
5. Asset optimization
6. Source map generation (dev only)
7. Output to `/dist` folder

### 4.3 Development Workflow
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (HMR enabled)
npm run build        # Create optimized build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 5. Deployment Architecture

### 5.1 CI/CD Pipeline
```
Push to release-prod
         ↓
GitHub Actions Triggered
         ↓
├─ Checkout Code
├─ Setup Node 18
├─ npm install
├─ npm run lint (optional)
├─ npm run build
└─ Deploy to GitHub Pages
         ↓
Build artifacts uploaded to gh-pages branch
         ↓
GitHub Pages serves from gh-pages branch
         ↓
Live at: https://polak008.github.io/polak008-01/
```

### 5.2 Permissions & Security
```yaml
permissions:
  contents: read        # Read repo contents
  pages: write          # Write to GitHub Pages
  id-token: write       # OIDC token generation
```

### 5.3 Environment Variables
- `NODE_ENV`: development | production
- `VITE_BASE_URL`: /polak008-01/
- No sensitive secrets needed

---

## 6. Docker Architecture

### 6.1 Development Docker Setup

**Dockerfile.dev:**
- Base: node:18-alpine
- Exposes: Port 5173
- Volumes: src/, public/, config files
- Command: npm run dev --host
- Purpose: Local development with hot reload

**docker-compose.dev.yml:**
```yaml
services:
  app:
    build: docker/Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - ../src:/app/src
      - ../public:/app/public
```

### 6.2 Production Docker Setup

**Dockerfile.prod (Multi-stage):**
```
Stage 1: Builder
- Base: node:18-alpine
- Builds React app (npm run build)
- Outputs to /dist

Stage 2: Runtime
- Base: nginx:alpine
- Copies /dist to nginx html
- Minimal image size (~50MB)
```

**docker-compose.prod.yml:**
```yaml
services:
  app:
    build: docker/Dockerfile.prod
    ports:
      - "80:80"
    healthcheck:
      test: curl http://localhost/health
```

### 6.3 Nginx Configuration
```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  
  # Gzip compression
  gzip on;
  
  # Cache busting for hashed assets
  location ~* \.(js|css|png|jpg)$ {
    expires 1y;
  }
  
  # SPA routing - serve index.html for all routes
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 7. Performance Optimization

### 7.1 Frontend Optimizations
- Code splitting by route
- Lazy loading of components
- Image optimization (WebP, responsive)
- CSS-in-JS removal (use Tailwind)
- Tree shaking of unused code
- Minification of assets

### 7.2 Caching Strategy
- Browser cache: 1 year for hashed assets
- Service Worker (PWA): Future enhancement
- CDN cache: 30 minutes for HTML

### 7.3 Metrics Targets
- Lighthouse Score: >90
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- Total Bundle Size: <100KB (gzipped)

---

## 8. Security Specifications

### 8.1 Frontend Security
- Content Security Policy (CSP) headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### 8.2 Code Security
- TypeScript strict mode enabled
- ESLint security plugin active
- Dependency scanning with GitHub Dependabot
- No hardcoded credentials

### 8.3 HTTPS & TLS
- Automatic HTTPS via GitHub Pages
- Let's Encrypt certificates
- TLS 1.2+

---

## 9. Monitoring & Observability

### 9.1 GitHub Actions Logs
- All workflow runs logged
- Available in Actions tab
- 90-day retention

### 9.2 Analytics (Optional)
- Google Analytics or Plausible
- Track page views
- Monitor bounce rate
- Identify popular projects

### 9.3 Error Tracking
- Browser console monitoring (future)
- Sentry or similar integration

---

## 10. Testing Strategy

### 10.1 Unit Tests
- Jest framework
- Component testing
- Utility function testing
- Target: >80% coverage

### 10.2 E2E Tests
- Playwright or Cypress
- Critical user paths
- Cross-browser testing

### 10.3 Manual Testing
- Responsive design testing
- Cross-browser compatibility
- Accessibility testing
- Form validation

---

## 11. Database & Backend

**Currently:** None (Static site)

**Future Enhancements:**
- Contact form submissions: Firebase, Supabase, or serverless
- Blog comments: Disqus or custom solution
- Analytics: Google Analytics or self-hosted

---

## 12. Scalability

### 12.1 Current Setup
- GitHub Pages CDN: Global distribution
- Static content: Infinitely scalable
- No server bottlenecks

### 12.2 Future Scaling
- If adding backend: Serverless (Lambda, Cloud Functions)
- Database: DynamoDB, Firestore, or managed PostgreSQL
- API Gateway for rate limiting

---

## 13. Disaster Recovery

### 13.1 Backup Strategy
- Git repository: Primary backup
- GitHub automatic backups
- Local git clone as secondary

### 13.2 Recovery Procedure
1. Clone repository: `git clone <repo>`
2. Install: `npm install`
3. Deploy: Push to release-prod branch
4. Verify: Check GitHub Pages URL

**Recovery Time:** <5 minutes
**Recovery Point:** Every commit to main/release-prod

---

## 14. Cost Analysis

| Component | Cost | Notes |
|-----------|------|-------|
| GitHub Pages | Free | Included with GitHub |
| GitHub Actions | Free | First 2,000 minutes/month free |
| Domain | $0 | Using GitHub Pages domain |
| Docker | Free | Open source |
| Tailwind CSS | Free | Open source |
| React | Free | Open source |
| **Total** | **$0/month** | Completely free tier! |

---

## 15. Version Control Strategy

### 15.1 Branches
- **main:** Development branch
- **release-prod:** Production-ready, triggers deployment
- **feature/*:** Feature branches for new work

### 15.2 Commit Messages
```
Format: <type>(<scope>): <subject>

Example:
feat(projects): add kubernetes deployment project
fix(header): navigation link styling
docs(readme): update setup instructions
```

### 15.3 Pull Requests
- Code review required before merge
- Automated checks: linting, tests
- Deployment only after PR approval

---

## 16. Tools & Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x | Runtime |
| npm | 9.x | Package manager |
| React | 19.2.0 | UI Framework |
| TypeScript | 5.9.3 | Type checking |
| Vite | 7.2.4 | Build tool |
| Tailwind CSS | 4.1.18 | Styling |
| ESLint | 9.39.1 | Code quality |
| Docker | Latest | Containerization |

---

**This specification is a living document and will be updated as the project evolves.**
