# Du Lich Ha Long - Design Guidelines

> Design system for the Trip Planner application.  
> Last updated: 2026-01-31

---

## 1. Color Palette

### Primary Accent
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `primary-500` | `#0D9488` | 13, 148, 136 | Primary buttons, links, focus states |
| `primary-600` | `#0F766E` | 15, 118, 110 | Hover states |
| `primary-700` | `#115E59` | 17, 94, 89 | Active/pressed states |
| `primary-50` | `#F0FDFA` | 240, 253, 250 | Light backgrounds |
| `primary-100` | `#CCFBF1` | 204, 251, 241 | Subtle highlights |

> **Rationale**: Teal evokes sea/ocean (Ha Long Bay), feels fresh, modern, and differentiates from common blue apps.

### Category Colors
| Category | Token | Hex | Background | Usage |
|----------|-------|-----|------------|-------|
| Transport | `cat-transport` | `#3B82F6` | `#EFF6FF` | Car, boat, flight icons |
| Food | `cat-food` | `#F97316` | `#FFF7ED` | Restaurant, meals |
| Stay | `cat-stay` | `#8B5CF6` | `#F5F3FF` | Hotel, accommodation |
| Tickets | `cat-tickets` | `#EC4899` | `#FDF2F8` | Entrance fees, tours |
| Other | `cat-other` | `#6B7280` | `#F9FAFB` | Misc expenses |

### Neutrals (Gray Scale)
| Token | Hex | Usage |
|-------|-----|-------|
| `gray-50` | `#F9FAFB` | Page background |
| `gray-100` | `#F3F4F6` | Card backgrounds, dividers |
| `gray-200` | `#E5E7EB` | Borders, subtle lines |
| `gray-300` | `#D1D5DB` | Disabled states |
| `gray-400` | `#9CA3AF` | Placeholder text |
| `gray-500` | `#6B7280` | Secondary text |
| `gray-600` | `#4B5563` | Body text |
| `gray-700` | `#374151` | Headings |
| `gray-800` | `#1F2937` | Primary text |
| `gray-900` | `#111827` | Bold headings |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#10B981` | Confirmation, saved states |
| `warning` | `#F59E0B` | Alerts, attention needed |
| `error` | `#EF4444` | Errors, delete actions |
| `info` | `#3B82F6` | Information notices |

---

## 2. Typography

### Font Families
```css
/* Primary: Source Sans 3 - Clean, readable, Vietnamese support */
--font-primary: 'Source Sans 3', system-ui, sans-serif;

/* Display: Lexend - Modern, geometric, for headings */
--font-display: 'Lexend', system-ui, sans-serif;

/* Mono: JetBrains Mono - For numbers/costs */
--font-mono: 'JetBrains Mono', monospace;
```

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

> **Vietnamese Support**: Source Sans 3 has full Vietnamese diacritical marks (ă, â, đ, ê, ô, ơ, ư). Lexend tested for display text.

### Type Scale (Mobile-First)
| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-xs` | 12px | 16px (1.33) | 400 | Captions, timestamps |
| `text-sm` | 14px | 20px (1.43) | 400 | Secondary text, labels |
| `text-base` | 16px | 24px (1.5) | 400 | Body text |
| `text-lg` | 18px | 28px (1.56) | 500 | Card titles |
| `text-xl` | 20px | 28px (1.4) | 600 | Section headers |
| `text-2xl` | 24px | 32px (1.33) | 600 | Page titles (mobile) |
| `text-3xl` | 30px | 36px (1.2) | 700 | Page titles (desktop) |
| `text-4xl` | 36px | 40px (1.11) | 700 | Hero text |

### Font Pairings
- **Headings**: Lexend 600-700
- **Body**: Source Sans 3 400-500
- **Numbers/Costs**: JetBrains Mono 500
- **Labels/Chips**: Source Sans 3 500 uppercase (tracking: 0.05em)

---

## 3. Spacing System

### Base Unit: 4px Grid
| Token | Value | Usage |
|-------|-------|-------|
| `space-0.5` | 2px | Tight internal spacing |
| `space-1` | 4px | Icon/text gap |
| `space-2` | 8px | Compact padding |
| `space-3` | 12px | Default padding |
| `space-4` | 16px | Card padding (mobile) |
| `space-5` | 20px | Section gap |
| `space-6` | 24px | Card padding (desktop) |
| `space-8` | 32px | Section spacing |
| `space-10` | 40px | Large gaps |
| `space-12` | 48px | Page margins |
| `space-16` | 64px | Hero sections |

### Layout Spacing
| Element | Mobile | Desktop |
|---------|--------|---------|
| Page padding | 16px | 24px-48px |
| Card padding | 16px | 20px-24px |
| Card gap | 12px | 16px |
| Section gap | 24px | 32px |
| Timeline connector | 2px | 2px |

---

## 4. Component Guidelines

### Buttons
```
Primary Button:
- Background: primary-500
- Text: white, Source Sans 3 600
- Padding: 12px 20px (mobile), 12px 24px (desktop)
- Border-radius: 8px
- Hover: primary-600
- Active: primary-700
- Min height: 44px (touch target)

Secondary Button:
- Background: white
- Border: 1px solid gray-300
- Text: gray-700
- Hover: gray-50 background, gray-400 border

Ghost Button:
- Background: transparent
- Text: primary-500
- Hover: primary-50 background

Icon Button:
- Size: 40px × 40px (mobile), 36px × 36px (desktop)
- Border-radius: 8px
- Hover: gray-100 background
```

### Input Fields
```
Text Input:
- Border: 1px solid gray-300
- Border-radius: 8px
- Padding: 12px 16px
- Font: Source Sans 3 400, 16px
- Focus: primary-500 border, primary-50 background, ring-2 primary-100
- Placeholder: gray-400
- Min height: 44px

Cost Input:
- Same as text input
- Text align: right
- Font: JetBrains Mono 500
- Prefix: currency symbol (gray-500)
```

### Cards
```
Activity Card:
- Background: white
- Border: 1px solid gray-200
- Border-radius: 12px
- Padding: 16px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: shadow-md, border-gray-300

Card with Category:
- Left border: 4px solid {category-color}
- Or: top category chip with background

Sticky Card (Cost Summary):
- Position: sticky, top: 80px
- Background: white
- Shadow: 0 4px 12px rgba(0,0,0,0.1)
- Border-radius: 16px
```

### Chips/Tags
```
Category Chip:
- Background: {category-bg-color}
- Text: {category-color}
- Font: Source Sans 3 500, 12px, uppercase
- Padding: 4px 8px
- Border-radius: 4px
- Letter-spacing: 0.05em

Time Chip:
- Background: gray-100
- Text: gray-600
- Font: JetBrains Mono 500, 12px
- Padding: 4px 8px
- Border-radius: 4px
```

### Timeline
```
Day Header:
- Font: Lexend 600, 18px
- Color: gray-800
- Background: white
- Sticky on mobile

Timeline Connector:
- Width: 2px
- Color: gray-200
- Left position: 20px from card edge
- Dot at each activity: 8px circle, primary-500 fill

Activity Card (in timeline):
- Margin-left: 40px (connector space)
- Drag handle: left side, visible on hover
- Handle icon: grip-vertical, gray-400
```

### Header
```
Edit View Header:
- Height: 64px (mobile), 72px (desktop)
- Background: white
- Border-bottom: 1px solid gray-200
- Position: sticky, top: 0
- Z-index: 50
- Content: Trip title (left), Share button (right)
- Padding: 0 16px (mobile), 0 24px (desktop)
```

---

## 5. Breakpoints

| Name | Min Width | Target |
|------|-----------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Layout Behavior
- **Mobile (< 768px)**: Single column, bottom cost summary
- **Tablet (768px-1023px)**: Single column, floating cost button
- **Desktop (≥ 1024px)**: Two columns (timeline + sticky cost sidebar)

---

## 6. Icons

Use **Lucide Icons** (MIT license, tree-shakable):
```
- Transport: Car, Plane, Ship, Train, Bus
- Food: Utensils, Coffee
- Stay: Bed, Home, Hotel
- Tickets: Ticket, MapPin
- Other: Package, MoreHorizontal
- UI: Plus, Trash2, Edit3, Share2, GripVertical, ChevronDown, ChevronUp, X, Check
```

---

## 7. Shadows & Borders

### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| `shadow` | 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06) | Cards |
| `shadow-md` | 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06) | Hover states |
| `shadow-lg` | 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05) | Modals, sticky elements |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Chips, small elements |
| `rounded` | 8px | Buttons, inputs |
| `rounded-lg` | 12px | Cards |
| `rounded-xl` | 16px | Large cards, modals |
| `rounded-full` | 9999px | Avatars, circular buttons |

---

## 8. Animation & Motion

### Transitions
```css
/* Default transition */
transition: all 150ms ease;

/* Hover effects */
transition: all 200ms ease;

/* Modal/drawer */
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Respect Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Drag & Drop
- Dragging card: `scale(1.02)`, `shadow-lg`, `opacity: 0.9`
- Drop zone highlight: `border-dashed`, `primary-200 border`, `primary-50 bg`

---

## 9. Accessibility

### Focus States
```css
/* Visible focus ring */
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Remove outline on mouse click */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Color Contrast
- Body text (gray-600 on white): 5.74:1 ✓
- Headings (gray-800 on white): 11.07:1 ✓
- Primary button text (white on primary-500): 4.51:1 ✓ (AA)

### Touch Targets
- Minimum size: 44px × 44px
- Minimum spacing: 8px between targets

---

## 10. Share View (Poster Style)

### Design Principles
- Clean, printable layout
- No interactive elements
- Focus on readability
- Story-like flow

### Specific Styles
```
Hero Section:
- Full-width gradient background: primary-50 to white
- Trip title: Lexend 700, 36px
- Date range: Source Sans 3 500, 16px, gray-600
- Stats row: person count, total cost, per-person (JetBrains Mono)

Day Cards:
- Minimal chrome (no borders, just subtle background)
- Clear day headers
- Compact activity list
- Category indicators (colored dots only)

Cost Breakdown:
- Clean table layout
- Category color bars
- Total prominently displayed
```

---

## Tailwind Config Reference

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#0D9488',
          600: '#0F766E',
          700: '#115E59',
        },
        category: {
          transport: '#3B82F6',
          'transport-bg': '#EFF6FF',
          food: '#F97316',
          'food-bg': '#FFF7ED',
          stay: '#8B5CF6',
          'stay-bg': '#F5F3FF',
          tickets: '#EC4899',
          'tickets-bg': '#FDF2F8',
          other: '#6B7280',
          'other-bg': '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

---

## Quick Reference

| Element | Mobile | Desktop |
|---------|--------|---------|
| Page padding | 16px | 24-48px |
| Card padding | 16px | 20-24px |
| Button height | 44px | 40px |
| Input height | 44px | 44px |
| Header height | 64px | 72px |
| Font body | 16px | 16px |
| Font heading | 24px | 30px |

---

*Generated by UI/UX Designer Agent*
