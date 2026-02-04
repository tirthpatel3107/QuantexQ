# QuantexQ

Industrial drilling operations dashboard built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui. The app renders KPI cards, pressure/flow charts, pump and choke status, and notifications in a dark monitoring-friendly layout.

## Features

- Drilling overview with draggable KPI cards and depth gauge
- Pressure/flow charts with thresholds and responsive grid layout (Recharts)
- Pump status grid with skeleton placeholders for initial load
- Choke and operational status panels with inline pie/legend display
- Notifications panel and floating action toolbar for quick actions

## Project structure

- `src/pages/Index.tsx` — main dashboard composition
- `src/components/dashboard/` — feature panels (charts, KPIs, pump cards, status)
- `src/data/mockData.ts` — static/mock data feeding charts and panels
- `src/hooks/` — utilities such as `useInitialSkeleton` and responsive helpers
- `src/components/ui/` — shadcn/ui primitives used across the dashboard

## Getting started

Requirements: Node 18+ and npm.

```sh
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
- `npm run test` — run Vitest once
- `npm run test:watch` — run Vitest in watch mode

## Tooling & styling

- Tailwind theme and chart colors are defined in `tailwind.config.ts`.
- Component styling relies on shadcn/ui primitives plus custom dashboard classes in `src/App.css` and `src/index.css`.
