# Portfolio Deployment Documentation
**Date:** February 2, 2026  
**Project:** portfolio (React + TypeScript + Vite)  
**Repository:** https://github.com/polak008/polak008-01  
**Live URL:** https://polak008.github.io/polak008-01/

---

## Executive Summary
This document details the complete process of setting up a React portfolio project with GitHub Pages deployment via GitHub Actions. The project uses Tailwind CSS for styling and is automatically deployed to GitHub Pages on push to the `release-prod` branch.

---

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Tailwind CSS Integration](#tailwind-css-integration)
3. [App Content Creation](#app-content-creation)
4. [GitHub Actions Workflow Setup](#github-actions-workflow-setup)
5. [GitHub Pages Configuration](#github-pages-configuration)
6. [Troubleshooting & Fixes](#troubleshooting--fixes)
7. [Final Deployment](#final-deployment)
8. [Key Decisions & Rationale](#key-decisions--rationale)

---

## Initial Setup

### Project Structure
The project started as a Vite + React + TypeScript template with the following structure:
```
portfolio/
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   ├── index.css
│   └── assets/
├── public/
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── README.md
```

### Technology Stack
- **Framework:** React 19.2.0
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 4.1.18
- **Deployment:** GitHub Pages
- **CI/CD:** GitHub Actions

---

## Tailwind CSS Integration

### Step 1: Added Tailwind CSS Imports to App.css
**File:** `src/App.css`

**What was done:**
Added three `@import` statements at the top of the file to import Tailwind's base styles, components, and utilities:

```css
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

**Why:**
- Tailwind CSS requires these imports to provide its complete styling system
- **Base:** Resets and defaults for HTML elements
- **Components:** Pre-built utility component classes
- **Utilities:** Utility classes for styling (text-3xl, font-bold, underline, etc.)
- These must be placed at the very top of the CSS file, before any other rules

**Purpose:** To make Tailwind CSS available throughout the application for styling components

---

## App Content Creation

### Step 2: Updated App.tsx with Sample Content
**File:** `src/App.tsx`

**What was done:**
Replaced the empty React component with meaningful content:

```tsx
export default function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </>
  )
}
```

**Decision Made:**
- Chose to add content to the React component (App.tsx) rather than the static HTML file
- Used React's className attribute with Tailwind utility classes

**Rationale:**
- React components are the idiomatic way to manage content in React applications
- Direct static HTML modification would bypass React's component system
- Using className with Tailwind classes maintains the React development workflow
- This approach allows for easy future component expansion and state management

**Tailwind Classes Used:**
- `text-3xl` — Large text size (1.875rem)
- `font-bold` — Bold font weight
- `underline` — Text underline decoration

---

## GitHub Actions Workflow Setup

### Step 3: Created GitHub Actions Deployment Workflow
**File:** `.github/workflows/deploy.yml`

**Initial Implementation:**
Created a workflow that triggers on push to the `release-prod` branch:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches:
      - release-prod
```

**What the Workflow Does:**
1. **Checkout Code** — Clones the repository
2. **Setup Node.js** — Installs Node.js 18 with npm caching
3. **Install Dependencies** — Runs `npm install`
4. **Build Project** — Runs `npm run build` (creates dist/ folder)
5. **Upload Artifact** — Uploads built files as GitHub Pages artifact
6. **Deploy** — Uses `actions/deploy-pages@v4` to deploy to GitHub Pages

**Trigger Decision:**
- Only triggers on **push** to `release-prod` branch (not on pull requests)
- This ensures only reviewed and approved code reaches production
- Manual pull request builds were initially included but removed to keep deployments clean

---

## Vite Base Path Configuration

### Step 4: Updated vite.config.ts
**File:** `vite.config.ts`

**What was changed:**
```typescript
export default defineConfig({
  base: '/polak008-01/',
  plugins: [react(), tailwindcss()],
})
```

**Why This Matters:**
- GitHub Pages serves the site at `github.com/<username>/<repo>/`
- The `base` configuration tells Vite to use `/polak008-01/` as the root path
- Without this, assets and links would break on the deployed site
- The trailing slash is critical for correct URL routing

**Decision Rationale:**
- Used the repository name (`polak008-01`) as the base path
- This is the standard approach for project sites (not user/organization sites)
- Alternative: If this was a user site (e.g., polak008.github.io), base would be `/`

---

## GitHub Pages Configuration

### Step 5: Manual GitHub Pages Settings
**Location:** Repository Settings → Pages

**Configuration:**
- **Source:** GitHub Actions (selected after initial workflow runs)
- **Branch:** Automatically managed by the workflow (deploys to gh-pages branch internally)

**Why GitHub Actions Source:**
- Modern GitHub Pages deployments use GitHub Actions
- The old "Deploy from a branch" option is less flexible
- GitHub Actions provides more control and better integration with build processes

---

## Troubleshooting & Fixes

### Issue 1: peaceiris/actions-gh-pages Permission Error
**Error Message:**
```
remote: Permission to polak008/polak008-01.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/polak008/polak008-01.git/': The requested URL returned error: 403
```

**Root Cause:**
- The `peaceiris/actions-gh-pages@v3` action required explicit `github_token` configuration
- Default GitHub token didn't have sufficient permissions
- Third-party action had limitations with authentication

**Solution:**
- Replaced `peaceiris/actions-gh-pages` with official GitHub actions:
  - `actions/upload-pages-artifact@v3`
  - `actions/deploy-pages@v4`
- These are officially maintained by GitHub and have proper permission handling

---

### Issue 2: Missing ACTIONS_ID_TOKEN_REQUEST_URL
**Error Message:**
```
Error: Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable
Error: Ensure GITHUB_TOKEN has permission "id-token: write".
```

**Root Cause:**
- The `actions/deploy-pages@v4` action uses OpenID Connect (OIDC) token authentication
- Required explicit permissions declaration in the workflow
- Default permissions were insufficient

**Solution:**
Added permissions block to the workflow:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**Permission Explanation:**
- `contents: read` — Read access to repository contents
- `pages: write` — Write access to GitHub Pages
- `id-token: write` — Generate OIDC tokens for secure authentication

**Why This Approach:**
- OIDC is more secure than long-lived tokens
- Permissions are explicitly stated and auditable
- No manual token creation or storage needed
- GitHub automatically provides these tokens during workflow execution

---

## Final Deployment

### Step 6: Git Repository Setup
**Commands Executed:**
```bash
cd /home/test/portfolio
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/polak008/polak008-01.git
git branch -M main
git checkout -b release-prod
git push -u origin release-prod
```

**Process:**
1. Initialized git repository
2. Added all files and committed
3. Added GitHub remote using SSH (git@github.com format)
4. Renamed default branch to `main`
5. Created `release-prod` branch
6. Pushed to GitHub

**Branch Strategy:**
- **main:** Development/default branch
- **release-prod:** Production-ready branch that triggers deployments
- This allows for staging before deployment

---

### Step 7: Workflow Execution
**Actions Taken:**
1. Pushed code to `release-prod` branch
2. GitHub Actions workflow triggered automatically
3. Built React application with Vite
4. Deployed to GitHub Pages

**Result:**
✅ Successful deployment to: https://polak008.github.io/polak008-01/

---

## Key Decisions & Rationale

### 1. **Why Vite instead of Create React App?**
- Vite is significantly faster (near-instant HMR)
- Better build optimization for production
- Native ES modules support
- Built-in TypeScript support
- Smaller bundle sizes

### 2. **Why Tailwind CSS?**
- Utility-first approach reduces CSS writing
- Built-in responsive design utilities
- Excellent autocomplete support in IDEs
- Smaller final bundle with PurgeCSS
- Modern CSS development experience
- Lower maintenance vs custom CSS

### 3. **Why GitHub Pages?**
- Free hosting for static sites
- Tight integration with GitHub
- No additional services or costs
- Automatic HTTPS
- Easy to set up and maintain
- Perfect for portfolios and documentation

### 4. **Why GitHub Actions?**
- Integrated into GitHub ecosystem
- No additional CI/CD platform needed
- Free for public repositories
- Native GitHub Secrets support
- Clear workflow visibility
- Community-maintained actions library

### 5. **Why release-prod branch?**
- Separates development from production deployments
- Allows for code review before deployment
- Prevents accidental deployments
- Enables team collaboration with clear deployment process
- Could be extended to include PR checks, tests, etc.

### 6. **Why official GitHub actions over peaceiris?**
- Official GitHub support and maintenance
- Better security practices (OIDC tokens)
- No manual token management
- Reduced external dependencies
- Better integration with GitHub Pages

---

## Future Improvements

### Potential Enhancements:
1. **Add Tests:** Implement Jest/Vitest tests in workflow
2. **Linting:** Add ESLint validation before deployment
3. **Environment Variables:** Support multiple deployment environments
4. **Custom Domain:** Configure custom domain in GitHub Pages
5. **Pull Request Previews:** Deploy PR previews to temporary URLs
6. **Build Cache:** Optimize build speed with dependency caching
7. **Performance Metrics:** Add lighthouse reports to PRs
8. **Staging Environment:** Create staging branch for pre-production testing

---

## Deployment Checklist

- [x] Install dependencies (npm install)
- [x] Configure Tailwind CSS imports
- [x] Create App content with React components
- [x] Configure Vite base path
- [x] Create GitHub Actions workflow
- [x] Fix workflow permissions
- [x] Initialize git repository
- [x] Add GitHub remote
- [x] Create release-prod branch
- [x] Push to GitHub
- [x] Configure GitHub Pages settings
- [x] Verify deployment success
- [x] Test live URL

---

## References

- [Vite Documentation](https://vite.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [OIDC Token Authentication](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

---

## Contact & Support

**Repository:** https://github.com/polak008/polak008-01  
**Live Site:** https://polak008.github.io/polak008-01/  
**Documentation Created:** February 2, 2026
