# Tribera.ai — Inventory Management System

A production-grade asset inventory app built with **React 18 + TypeScript + Vite**.

Track laptops, access cards, phones, and any equipment — with full issuance history, audit logs, and search.

---

## Features

- **Dashboard** — live stats, asset breakdown, recent activity feed
- **Asset Registry** — laptops, access cards, phones, and other equipment
- **Issue & Return** — assign assets to employees, record who issued and when
- **Return tracking** — expected return dates with visual highlights
- **Edit / Delete** — full CRUD with confirmation dialogs
- **Activity Log** — complete audit trail of every action (issue, return, add, edit, delete)
- **Search** — filter by name, serial, brand, or employee name
- **Sidebar navigation** — filter by asset type or status instantly
- **Form validation** — required fields enforced on all forms
- **Notifications** — toast feedback for every action
- **Keyboard support** — Escape closes modals

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Dashboard.tsx        # Stats + activity overview
│   ├── InventoryTable.tsx   # Main asset table
│   ├── ActivityLog.tsx      # Full audit trail
│   ├── AssetForm.tsx        # Add / Edit asset form
│   ├── IssueForm.tsx        # Issue asset to employee
│   ├── AssetDetail.tsx      # Asset detail panel + history
│   ├── Modal.tsx            # Reusable modal wrapper
│   └── NotificationStack.tsx # Toast notifications
├── hooks/
│   ├── useInventory.ts      # All inventory state & business logic
│   └── useNotification.ts   # Toast notification state
├── types/
│   └── index.ts             # All TypeScript interfaces & types
├── data/
│   └── seed.ts              # Sample data (replace with API)
├── utils/
│   └── helpers.ts           # Pure utility functions
├── App.tsx                  # Root component & modal orchestration
├── main.tsx                 # React entry point
└── index.css                # Global styles (CSS variables, dark theme)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:3000)
npm run dev

# Type check
npm run type-check

# Build for production
npm run build
```

---

## Adding a Backend

The app uses local state via `useInventory`. To connect a real backend:

1. Replace `useState` calls in `src/hooks/useInventory.ts` with API calls
2. Swap `src/data/seed.ts` with your fetch logic
3. Recommended backends: **Supabase**, **Firebase**, or a **Node.js + PostgreSQL** REST API

### Supabase example (drop-in replacement for `useInventory`):

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch assets
const { data } = await supabase.from('assets').select('*');

// Insert
await supabase.from('assets').insert({ ...newAsset });

// Update
await supabase.from('assets').update({ status: 'issued' }).eq('id', assetId);
```

---

## Asset Types

| Type | Icon | Description |
|------|------|-------------|
| `laptop` | 💻 | Laptops and computers |
| `access_card` | 🪪 | HID/proximity/RFID access cards |
| `phone` | 📱 | Mobile phones and tablets |
| `other` | 📦 | Any other equipment |

## Status Values

| Status | Meaning |
|--------|---------|
| `available` | In stock, ready to issue |
| `issued` | Currently assigned to an employee |
| `maintenance` | Under repair or service |
| `retired` | Decommissioned |

---

## Customisation

- **Theme**: Edit CSS variables in `src/index.css` under `:root`
- **Company name**: Update `logo-text` in `Sidebar.tsx`
- **Seed data**: Edit `src/data/seed.ts` or remove it entirely
- **Asset types**: Extend the `AssetType` union in `src/types/index.ts`

---

Built for **Tribera.ai** · React 18 · TypeScript 5 · Vite 5
