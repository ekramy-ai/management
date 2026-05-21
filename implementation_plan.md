# Implementation Plan - VolleyClub Pro

VolleyClub Pro is a professional, enterprise-grade volleyball club management platform designed to streamline operations, tracking, and analytics for volleyball clubs. The platform features dynamic LTR/RTL support (English/Arabic), dark/light mode toggles, a modern sidebar navigation, real-time KPI metrics, rich interactive charts, and modules for managing teams, players, staff, training, matches, attendance, reports, and settings.

## User Review Required

> [!IMPORTANT]
> - **Authentication and Supabase Integration**: The app will include a mock authentication flow and Supabase-ready client architecture (fully typed tables and helper clients). This allows instant transition to a live Supabase project by updating environment variables.
> - **Language Routing & State**: We will use a routing-free client-side or Next.js App Router compatible dynamic translations pattern utilizing `next-intl` or a custom lightweight i18n context provider to guarantee perfect RTL/LTR shifts without page reloading or complex middleware redirects.
> - **Mock Database & State**: We will use `Zustand` to manage global state (theme, language, mock database state for teams, players, matches, etc.) so that all CRUD operations work seamlessly in the live demonstration.

## Open Questions
- None at this stage. We are targeting a fully operational and gorgeous local dev environment that can be pushed to production with a real Supabase backend.

## Proposed Changes

We will construct a Next.js 15 App Router codebase with a modular structure.

### 1. Core Framework Setup
We will initialize Next.js 15 in the workspace root:
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- ESLint

### 2. File Directory Structure
We will establish an enterprise-grade directory layout:
```text
src/
├── app/                  # App router pages & layouts
│   ├── [locale]/         # i18n localization routing (if using next-intl middleware) or general app pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing/Dashboard entry
├── components/           # Reusable UI & Layout components
│   ├── ui/               # Base shadcn-like components (Buttons, Inputs, Dialogs, etc.)
│   ├── layout/           # Sidebar, Navbar, PageWrapper, RTLProvider
│   ├── dashboard/        # KPI Cards, Analytics Charts, Recent Activity
│   ├── teams/            # Teams table, detail cards, creation forms
│   ├── players/          # Players list, performance radar, health tracker
│   ├── staff/            # Staff directory, roles management
│   ├── attendance/       # Daily check-in sheet, calendar view
│   ├── training/         # Drill builder, practice schedule
│   ├── matches/          # Match scheduler, scoreboard editor, rotation tracker
│   └── settings/         # Club info, notification rules, system preferences
├── store/                # Zustand global stores (clubStore, uiStore)
├── locales/              # English & Arabic dictionary files
│   ├── en.json
│   └── ar.json
├── types/                # TypeScript interfaces (Player, Team, Match, User)
├── lib/                  # Helper utilities (Supabase client, utils.ts, charts)
└── styles/               # Global CSS styles (index.css)
```

---

### Component Specifications

#### [NEW] [next.config.mjs](file:///c:/Users/Lenovo/Desktop/Manage/next.config.mjs)
- Configure i18n routing and general configuration.

#### [NEW] [tailwind.config.ts](file:///c:/Users/Lenovo/Desktop/Manage/tailwind.config.ts)
- Configure dynamic themes (Dark/Light), HSL color mappings, and RTL animations.

#### [NEW] [src/styles/globals.css](file:///c:/Users/Lenovo/Desktop/Manage/src/styles/globals.css)
- Custom typography (e.g. Outfit & Cairo), glassmorphism styles, custom scrollbars, and sports-themed gradients.

#### [NEW] [src/store/clubStore.ts](file:///c:/Users/Lenovo/Desktop/Manage/src/store/clubStore.ts)
- Zustand store that acts as a client-side mock database. Features state and CRUD methods for:
  - **Teams**: Title, age group, gender, head coach, roster.
  - **Players**: Name, jersey number, position (Setter, Outside Hitter, Libero, etc.), height, weight, status, stats (aces, blocks, digs, kills).
  - **Staff**: Name, role, contact, specialization.
  - **Matches**: Opponent, date, location, status (scheduled, live, completed), sets score, rotation setups.
  - **Training Sessions**: Title, date, duration, focus area (e.g., defense, reception), attendance log.
  - **Attendance**: Map of player ID to status (Present, Excused, Absent) per date.

#### [NEW] [src/store/uiStore.ts](file:///c:/Users/Lenovo/Desktop/Manage/src/store/uiStore.ts)
- UI state: Language (`en` vs `ar`), Theme (`light` vs `dark`), Sidebar state (open/collapsed/mobile), Active module.

#### [NEW] [src/lib/supabase.ts](file:///c:/Users/Lenovo/Desktop/Manage/src/lib/supabase.ts)
- Initialization file for Supabase client, prepared with type definitions, ready for credentials.

#### [NEW] [src/components/layout/Sidebar.tsx](file:///c:/Users/Lenovo/Desktop/Manage/src/components/layout/Sidebar.tsx)
- Enterprise sidebar containing logo, collapse trigger, search bar, active user profile, and high-quality icons with animations. Supports RTL layout automatically.

#### [NEW] [src/components/layout/Navbar.tsx](file:///c:/Users/Lenovo/Desktop/Manage/src/components/layout/Navbar.tsx)
- Top navbar with language toggle, theme toggle, notifications dropdown, and active page title (en/ar).

#### [NEW] [src/components/dashboard/KPISection.tsx](file:///c:/Users/Lenovo/Desktop/Manage/src/components/dashboard/KPISection.tsx)
- 4 rich cards displaying stats (Active Players, Upcoming Matches, Attendance Rate, Win/Loss Ratio) with mini sparklines or trends.

#### [NEW] [src/components/dashboard/AnalyticsSection.tsx](file:///c:/Users/Lenovo/Desktop/Manage/src/components/dashboard/AnalyticsSection.tsx)
- Recharts-powered interactive cards:
  - Attendance trends (Area chart)
  - Team performance/Win rate (Bar chart)
  - Player positions distribution or stats (Pie / Radar chart)

#### [NEW] [src/components/modules/...](file:///c:/Users/Lenovo/Desktop/Manage/src/components/modules)
- Full implementations for all 10 requested modules:
  1. **Dashboard**: Interactive data-rich landing with real-time club health status.
  2. **Teams Management**: Roster viewing, coach assignments, stats aggregation.
  3. **Players Management**: Complete directory with filters (by team, position), stats view, and addition/edit forms (React Hook Form + Zod).
  4. **Staff Management**: Role assignments (coach, medical, admin) and contact details.
  5. **Attendance System**: Interactive calendar and daily matrix interface to log attendance easily.
  6. **Training Management**: Scheduler, focus areas, and duration tracker.
  7. **Match Management**: Scheduling, score recording, and standard volleyball rotation tracking (Positions 1-6).
  8. **Reports & Analytics**: PDF-ready exportable reports dashboard, win/loss breakdown, drill completion stats.
  9. **Notifications**: System notification panel for match updates, low attendance alerts, or medical status updates.
  10. **Settings**: General club name customization, court properties, and translation preferences.

---

## Verification Plan

### Automated Verification
- Verify that standard TypeScript compilation succeeds (`npm run build`).
- Verify Next.js dev server starts successfully.
- Verify standard Tailwind CSS styles compile without errors.

### Manual Verification
- Render layout in both English (LTR) and Arabic (RTL) mode. Verify that:
  - Sidebar changes sides correctly (left for English, right for Arabic).
  - Fonts load correctly (Cairo for Arabic, Outfit/Inter for English).
  - All text content switches to Arabic context on select.
- Verify theme toggle switches between custom light and dark themes.
- Test interactive features:
  - Add a team, add a player to a team.
  - Record attendance for a training session and observe KPI updates.
  - Log a match result and observe changes in win/loss ratios.
