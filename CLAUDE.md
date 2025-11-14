# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application using:
- **TanStack Router** for file-based routing
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **Vitest** for testing
- **Bun** as the package manager and runtime

## Development Commands

```bash
# Development server (runs on port 3000)
bun --bun run dev

# Build for production (runs vite build then TypeScript compiler)
bun --bun run build

# Preview production build
bun --bun run serve

# Run tests
bun --bun run test

# Lint code
bun --bun run lint

# Format code
bun --bun run format

# Format and fix lint issues
bun --bun run check
```

## Architecture

### Feature-First Structure
The project follows a **feature-first architecture** where each domain (articles, tags, lists, locals) has its own directory with:
- `components/` - Domain-specific UI components
- `hooks/` - Custom hooks for the feature
- `services/` - API calls and external services
- `schemas/` - Type definitions and validation schemas
- `index.ts` - Feature exports

### Routing
- **File-based routing** via TanStack Router
- Routes are defined as files in `src/routes/`
- The router automatically generates route configuration from these files
- Root layout is in `src/routes/__root.tsx` which includes the Header component and TanStack devtools
- Router configuration in `src/main.tsx` includes:
  - Intent-based preloading
  - Scroll restoration
  - Structural sharing enabled
  - Redux Provider wrapper
  - RealtimeProvider for Socket.IO connections

### State Management (Redux Toolkit)
- **Normalized state** using EntityAdapter
- **makeCrudSlice factory** in `src/store/slices/makeCrudSlice.ts` creates standardized slices
- Each slice supports: `upsertMany`, `update`, `remove`, `clear` actions
- **eventRouterMiddleware** routes realtime events to Redux
- Store configured in `src/store/index.ts`

Example slice usage:
```ts
store.dispatch({ type: "articles/upsertMany", payload: [{ id: 1, name: "Item" }] });
store.dispatch({ type: "articles/update", payload: { id: 1, name: "Updated" } });
store.dispatch({ type: "articles/remove", payload: 1 });
```

### Realtime Communication
- **Transport interface** in `src/rt/transport.ts` - decoupled from specific implementation
- **SocketIOTransport** implementation in `src/rt/socketio.transport.ts`
- **RealtimeProvider** in `src/rt/RealtimeProvider.tsx`:
  - Automatic reconnection with exponential backoff
  - Routes incoming messages to Redux via `dispatchIncoming`
  - Sends `join_sala` event on connection
  - Configure auth token in RealtimeProvider (currently placeholder)

To switch to MQTT or another transport, implement the `Transport` interface.

### Design System (FarmaConnect Theme)

All reusable UI components live in `src/components/system/` and use **FarmaConnect color palette**:

**Colors:**
- Primary: #0099D8 (Celestial Blue) / #FDA042 (dark mode)
- Secondary: #FDA042 (Sandy Brown)
- Error: #D32F2F
- Warning: #EC9005
- Success: #43A047

**Components:**
- **Button** - CVA variants: primary, secondary, ghost, outline, destructive | sizes: sm, md, lg
- **Input** - CVA sizes: sm, md, lg | supports `invalid` state
- **Select** - CVA sizes: sm, md, lg | supports `invalid` state
- **Textarea** - CVA sizes: sm, md, lg | supports `invalid` state, `resize` option
- **Card** - Container with Header, Title, Description, Content, Footer subcomponents

Components use **CVA (class-variance-authority)** for consistent API:
```tsx
<Button variant="primary" size="md">Guardar</Button>
<Input size="lg" invalid={hasError} placeholder="Email..." />
<Select size="md"><option>...</option></Select>
<Textarea size="md" resize="none" />
```

### Design Tokens

**📘 Ver guía completa:** [DESIGN_TOKENS.md](./DESIGN_TOKENS.md)

**Tokens Semánticos** (en `src/styles.css`):
- Base: `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--destructive`
- Surface: `--surface-primary-95`, `--surface-primary-90`, `--surface-primary-65`
- Charts: `--chart-1` through `--chart-5`

**Control Tokens** (en `src/styles/theme.css`):
- Heights: `--control-h-sm`, `--control-h-md`, `--control-h-lg`
- Colors: `--control-bg`, `--control-border`, `--control-text`, etc.
- Shadows: `--control-shadow`, `--control-shadow-hover`, `--control-shadow-focus`
- Dark mode variants included

**Uso con Tailwind:**
```tsx
// Opacidades nativas (reemplazan variables legacy)
<div className="bg-primary/20 text-primary/70 ring-primary/30">

// Superficies mezcladas
<div className="bg-[--surface-primary-95]">

// Tokens semánticos
<div className="bg-background text-foreground border-border">
```

**Animaciones disponibles:**
- `animate-fade-in` - Aparición gradual
- `animate-wiggle` - Movimiento de lado a lado
- `animate-accordion-down` / `animate-accordion-up` - Para acordeones
- `animate-border` - Animación de borde

**Utilidades CSS:**
- `.tabular-nums` - Números tabulares para tablas
- Scrollbar personalizada con colores primary
- Autofill styling para inputs

### Layout System

The application uses a **collapsible sidebar layout** with automatic breadcrumbs and header, built with animate-ui components.

**Structure:**
```
src/components/system/layout/
├── navigation.constants.ts  # Editable menu data
├── AppSidebar.tsx          # Sidebar component
├── AppLayout.tsx           # Layout wrapper with breadcrumbs
└── index.ts                # Exports
```

**AppLayout** wraps all pages via `src/routes/__root.tsx` and includes:
- **Collapsible sidebar** with team switcher, navigation menu, projects, and user menu
- **Header** with sidebar toggle and automatic breadcrumbs
- **Content area** where route pages render (`<Outlet />`)

**Customizing menus:**
Edit `src/components/system/layout/navigation.constants.ts`:
- `NAV_MAIN` - Main navigation items with nested subitems (collapsible sections)
- `PROJECTS` - Project list with dropdown actions
- `TEAMS` - Available teams for team switcher
- `USER_DATA` - Current user info (name, email, avatar)

Example adding a new nav item:
```ts
{
  title: 'Analytics',
  url: '/analytics',
  icon: BarChart,
  items: [
    { title: 'Dashboard', url: '/analytics' },
    { title: 'Reports', url: '/analytics/reports' },
  ],
}
```

**Breadcrumbs:**
Breadcrumbs are **automatically generated** from the current route using TanStack Router's `useMatches()`. The last segment of the route path is formatted as Title Case. For example:
- `/articles` → "Articles"
- `/users/profile` → "Profile"
- `/settings/billing-info` → "Billing Info"

No manual configuration needed - breadcrumbs update automatically as you navigate.

**Sidebar features:**
- Keyboard shortcut: `Cmd/Ctrl + B` toggles sidebar
- Three states: expanded (desktop), collapsed to icons (desktop), hidden (mobile as sheet)
- Persistent state saved in cookie
- Mobile-responsive with sheet overlay
- Hover effects on menu items (via Highlight component from animate-ui)

### Path Aliases
- `@/*` maps to `./src/*` (configured in both vite.config.ts and tsconfig.json)

### Adding New Features
1. Create feature directory: `src/features/<feature-name>/`
2. Add components, hooks, services, schemas subdirectories
3. Create Redux slice: `makeCrudSlice<EntityType>("featureName")`
4. Add slice to store in `src/store/index.ts`
5. Create routes in `src/routes/<feature-name>/`
6. Export feature components via `index.ts`

### Adding New Routes
1. Create a new file in `src/routes/`
2. TanStack Router will automatically generate the route tree
3. Use `Link` component from `@tanstack/react-router` for navigation

### Build Process
The build command runs **both** `vite build` AND `tsc` - this ensures type checking occurs during production builds.

### Demo Files
Files prefixed with `demo` can be safely deleted - they are examples provided by the TanStack starter template.

## Documentation Rules

**IMPORTANT**: When making significant changes to the project, you MUST update both documentation files:

### Update CLAUDE.md when:
- Adding new architectural patterns or conventions
- Changing build processes or scripts
- Adding new tools or libraries that affect development workflow
- Modifying routing structure or configuration
- Adding path aliases or important configuration changes

### Update README.md when:
- Adding new features that users should know about
- Changing how to run or deploy the application
- Adding new dependencies that require setup
- Modifying the project structure significantly
- Adding new scripts or commands

Keep both files concise and avoid redundancy - CLAUDE.md is for development guidance, README.md is for end-users and getting started.
