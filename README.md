# Du Lịch Hạ Long - Trip Planner

A mobile-first trip planning application for Ha Long Bay with day-based timeline, cost tracking, and shareable view-only links.

## Features

- **Trip Management** - Create trips with dates, people count, currency (VND default)
- **Day Timeline** - Visual day-by-day itinerary with activity cards
- **Drag & Drop** - Reorder activities within and across days
- **Cost Calculator** - Real-time totals, per-person split, category breakdowns
- **Share Links** - URL-encoded view-only links (no backend required)
- **Offline First** - Data persisted to localStorage

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State**: Zustand with localStorage persistence
- **DnD**: @dnd-kit/core + @dnd-kit/sortable
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home - trip list
│   ├── (main)/trip/
│   │   ├── new/           # Create new trip
│   │   └── [id]/          # Edit trip (timeline view)
│   └── share/[hash]/      # Read-only share view
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── trip/              # Trip header, forms
│   ├── timeline/          # Day columns, activity cards
│   └── cost/              # Cost summary, breakdowns
├── stores/
│   └── trip-store.ts      # Zustand store with persistence
├── types/
│   └── index.ts           # TypeScript definitions
├── lib/
│   ├── utils.ts           # Formatting helpers
│   ├── share.ts           # URL encode/decode for sharing
│   └── constants.ts       # App constants
└── hooks/
    └── use-mounted.ts     # SSR hydration hook
```

## Data Model

```
Trip
├── title, startDate, endDate
├── currency, numberOfPeople
├── costSettings (splitMode)
└── days[]
    └── Day
        ├── date, orderIndex
        └── activities[]
            └── Activity
                ├── title, category
                ├── timeStart, timeEnd
                ├── locationText, mapLink
                ├── costEstimate, notes
                └── orderIndex
```

## Activity Categories

| Category | Vietnamese | Color |
|----------|-----------|-------|
| transport | Di chuyển | Blue |
| food | Ăn uống | Orange |
| stay | Lưu trú | Purple |
| tickets | Vé tham quan | Pink |
| other | Khác | Gray |

## Share Feature

Trips can be shared via URL-encoded links:
- No database required
- Viewer sees read-only "poster" view
- Link contains full trip data (base64 encoded)

Example: `https://yoursite.com/share/{encoded-trip-data}`

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Run production build
pnpm lint     # Run ESLint
```

## Documentation

- [Design Guidelines](./docs/design-guidelines.md) - Colors, typography, components
- [Wireframes](./docs/wireframes/) - HTML prototypes
- [Implementation Plan](./plans/2026-01-31-bootstrap-trip-planner/) - Phase breakdown

## License

Private project.
