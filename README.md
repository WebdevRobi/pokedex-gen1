# Gen 1 Pokédex - Front End Exam

A high-performance, responsive **Generation 1 Pokédex** web application built with **React**, **TypeScript**, **Vite**, **TailwindCSS**, **TanStack Query**, and **React Router**.

---

## 🌟 Features & Specifications

### 1. Gen 1 Pokédex Catalog
- Lists all original **Gen 1 Pokémon (#1 to #151)** using the official PokéAPI REST endpoints:
  - List endpoint: `https://pokeapi.co/api/v2/pokemon/?limit={limit}&offset={offset}`
  - Sprites: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`
  - High-res artwork fallback: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`
- **Toggle for List / Grid view** matching the exam wireframe design.

### 2. Pagination & "Load More" (Bonus: Infinite Pagination)
- Uses `limit` and `offset` pagination through TanStack Query (`useInfiniteQuery`).
- "Load more" button with remaining count indicator to smoothly append batches.

### 3. Client-Side Instant Searching
- Instant search filter by Pokémon name (e.g. `pikachu`, `char`) or ID (e.g. `25`, `#025`).
- Pre-caches Gen 1 catalog (`limit: 151`) to allow zero-latency client-side search across all 151 Pokémon.

### 4. "Tag as Captured" Feature
- Capture system allowing trainers to tag any Pokémon with:
  - **Nickname** (`string`)
  - **Date** (`when`, formatted date with "Set to Today" shortcut)
- Stored persistently in browser `localStorage`.
- **Pokédex View**: Captured Pokémon are clearly marked with a `✓` badge.
- **Captured Tab**: Dedicated view showing:
  - Pokémon Photo
  - Pokémon Name
  - `Nickname: <nickname>`
  - `Date: <date>`
  - Release action button (`X`) to remove the Pokémon from your collection with confirmation.
- **Detail View**: Full status section to tag, edit nickname/date, or release.

### 5. Pokémon Details View (`/pokemon/:id`)
- `< Go Back` navigation button.
- Official artwork and sprite display.
- Elemental types with authentic color palettes (Fire, Water, Grass, Electric, Psychic, etc.).
- Physical metrics: Height (meters) and Weight (kilograms).
- Abilities with hidden ability indicators.
- Base stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) with animated progress bars.
- Status section for capturing and managing Pokémon.

### 6. Bonus Features
- 🌓 **Dark / Light Mode Toggle**: Smooth theme switcher with system preference detection and `localStorage` persistence.
- 📱 **Mobile & Desktop Responsive**: Clean UI adapted for all screen sizes.
- ⚡ **Zero-Latency Navigation & Caching**: Powered by TanStack Query for optimal request deduplication and caching.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router (`react-router-dom` v7)
- **Data Fetching & Cache**: TanStack Query (`@tanstack/react-query` v5)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & JetBrains Mono

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm or yarn

### Installation
```bash
# 1. Clone repository or open project folder
cd /path/to/EXAM

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open your browser at `http://localhost:5173` to explore the Pokédex!

### Production Build & Linting
```bash
# Typecheck and production bundle
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

---

## 📦 Deployment Instructions (Bonus)

### Deploy to Vercel (Recommended)
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your GitHub repository.
4. Framework Preset will be automatically detected as **Vite**.
5. Click **Deploy**.

*(Single Page Application rewrite rule is supported out-of-the-box by Vite/Vercel).*

---

## 📋 Exam Specifications Checklist

- [x] React TypeScript
- [x] Vite
- [x] TailwindCSS
- [x] React Router
- [x] TanStack Query
- [x] Axios
- [x] Gen 1 Pokédex REST API list
- [x] Toggle for List / Grid view
- [x] Pagination with `limit` and `offset` (Bonus: load more / infinite query)
- [x] Client side searching across 151 Gen 1 Pokémon
- [x] "Tag as Captured" with `nickname` and `when` (date) stored in `localStorage`
- [x] Wireframe sample UI layout matched (All tab, Captured tab, Details page with Status form and `X` release)
- [x] Bonus: Dark / Light Mode Toggle
- [x] Bonus: Deploy ready with clear instructions
