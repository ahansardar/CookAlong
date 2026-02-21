# Cook-Along 🍳

A modern, responsive recipe browsing and step-by-step cooking companion application built with Next.js, Supabase, and real-time timer functionality.

**Made by Ahan Sardar with ❤️**

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Features In Detail](#features-in-detail)
- [Browser Support](#browser-support)
- [Device Optimization](#device-optimization)
- [Language Support](#language-support)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Features
- **Recipe Discovery**: Browse recipes with search and category filtering
- **Featured Recipes**: Highlighted premium recipes section
- **Cook-Along Mode**: Interactive timer with step-by-step instructions
- **Multi-Device Support**: Fully responsive design for mobile, tablet, and desktop
- **Dark/Light Theme**: Theme toggle with system preference detection
- **Progressive Web App**: Installable on mobile devices

### Recipe Management
- **Advanced Search**: Real-time search with URL parameters persistence
- **Category Filtering**: Filter recipes by cuisine type or category
- **Recipe Details**: Comprehensive recipe information including:
  - Title and description
  - Total cooking time
  - Ingredients list with quantities
  - Step-by-step instructions
  - Step durations for timer functionality
  - YouTube video support per step

### Cook-Along Features
- **Smart Timer**: Automatic countdown with step duration
- **Audio Alerts**: Warning sounds at different intervals
- **Fullscreen Mode**: Immersive cooking experience
- **Step Navigation**: Skip, complete, or revisit steps
- **Progress Tracking**: Visual indication of completed steps
- **Video Integration**: Embedded YouTube videos for visual guidance

### Language Support
- **English**: Full support
- **Indian Languages** (22 languages available):
 - Assamese
 - Bengali
 - Bodo
 - Dogri
 - Gujarati
 - Hindi
 - Kannada
 - Kashmiri
 - Konkani
 - Maithili
 - Malayalam
 - Manipuri
 - Marathi
 - Nepali
 - Odia
 - Punjabi
 - Sanskrit
 - Santali
 - Sindhi
 - Tamil
 - Telugu
 - Urdu

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19.2 with Framer Motion
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Components**: shadcn/ui with Radix UI primitives
- **State Management**: React Hooks + SWR for data fetching
- **Icons**: Lucide React

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Real-time Queries**: Supabase Client JS
- **Authentication**: (Ready for integration)
- **API**: Next.js Route Handlers with Server Actions

### Development & Deployment
- **Bundler**: Turbopack (default in Next.js 16)
- **Package Manager**: npm
- **Deployment**: Vercel (recommended)
- **Analytics**: Vercel Analytics integration

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cook-along
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure Supabase credentials**
   - Get your Supabase URL and Anon Key from [supabase.com](https://supabase.com)
   - Update `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Create database tables** (see Database Schema section)

6. **Run development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

---

## ⚙️ Configuration

### Environment Variables

**Required Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser for client-side access.

### Database Schema

The application uses three main tables in PostgreSQL:

#### 1. `recipes` Table
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_time TEXT,
  image_url TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_recipes_slug ON recipes(slug);
CREATE INDEX idx_recipes_category ON recipes(category);
```

#### 2. `ingredients` Table
```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  quantity TEXT,
  unit TEXT,
  name TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);
```

#### 3. `steps` Table
```sql
CREATE TABLE steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  duration_in_seconds INTEGER,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_steps_recipe_id ON steps(recipe_id);
CREATE INDEX idx_steps_step_number ON steps(step_number);
```

---

## 📁 Project Structure

```
cook-along/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles & theme
│   ├── recipe/
│   │   └── [id]/
│   │       └── page.tsx           # Recipe detail page
│   └── cook-along/
│       └── [id]/
│           └── page.tsx           # Cook-along player page
├── components/
│   ├── recipe-card.tsx            # Recipe card component
│   ├── recipe-list-client.tsx     # Search & filter UI
│   ├── recipe-page-client.tsx     # Recipe detail client
│   ├── cook-along-player.tsx      # Timer & cooking interface
│   ├── cook-along-page-client.tsx # Cook-along wrapper
│   ├── language-selector.tsx      # Language switcher
│   ├── theme-toggle.tsx           # Dark/light mode toggle
│   ├── animated-logo.tsx          # Animated brand logo
│   ├── loading-skeleton.tsx       # Loading state
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── supabase.ts               # Supabase client & queries
│   └── utils.ts                  # Utility functions
├── context/
│   └── LanguageContext.tsx       # Language provider & translations
├── public/
│   ├── icon.svg                  # Logo
│   ├── icon-light-32x32.jpg      # Light mode favicon
│   ├── icon-dark-32x32.jpg       # Dark mode favicon
│   └── apple-icon.jpg            # Apple touch icon
├── data/
│   ├── recipes.json              # Fallback recipe data
│   └── recipes-hi.json           # Hindi translations (example)
├── .env.local                     # Environment variables
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
├── SUPABASE_SETUP.md             # Supabase setup guide
└── README.md                     # This file
```

---

## 🎯 Features In Detail

### Search Functionality
- **Text Search**: Search by recipe name or description
- **URL Parameters**: Search state persists in URL (`/?search=query`)
- **Page Refresh**: Full page reload on search submission for clean state
- **Mobile Optimized**: Touch-friendly search interface

### Category Filtering
- **Dynamic Categories**: Auto-generated from Supabase data
- **Single Selection**: Choose one category at a time
- **URL Persistence**: Selected category stored in URL (`/?category=Dessert`)
- **Clear Filters**: "All Recipes" button to reset filters

### Featured Recipes
- **Prominent Display**: Displayed separately at the top
- **Admin Controlled**: Set `is_featured = true` in Supabase
- **Responsive Grid**: 1 column on mobile, up to 3 columns on desktop
- **Automatic Hiding**: Hidden when category filters are applied

### Cook-Along Mode
- **Intelligent Timer**: 
  - Automatic countdown based on step duration
  - Pause/resume functionality
  - Manual skip to next step
- **Audio Alerts**:
  - 60-second warning tone
  - Completion sound when step finishes
  - Interval alarms every 5 minutes for steps > 10 min
- **Visual Progress**:
  - Step completion checkmarks
  - Progress bar for current step
  - Fullscreen mode for immersive experience
- **Video Support**:
  - YouTube video playback in dedicated modal
  - Click-to-play video for visual guidance

### Responsive Design
- **Mobile (< 640px)**: Single column layout, compact spacing
- **Tablet (640px - 1024px)**: Two column layouts where appropriate
- **Desktop (> 1024px)**: Three column recipe grid, optimal readability
- **Touch Optimization**: Larger tap targets, better spacing
- **Performance**: Optimized images, lazy loading where applicable

---

## 🌍 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest 2 | ✅ Full support |
| Firefox | Latest 2 | ✅ Full support |
| Safari | Latest 2 | ✅ Full support |
| Edge | Latest 2 | ✅ Full support |
| iOS Safari | Latest 2 | ✅ Full support |
| Chrome Mobile | Latest 2 | ✅ Full support |

**Minimum Supported Versions:**
- ES2020 JavaScript support required
- CSS Grid and Flexbox support required
- Web Audio API for timer sounds

---

## 📱 Device Optimization

### Mobile-First Approach
- Base styles optimized for mobile screens
- Progressive enhancement for larger screens
- Touch-friendly UI with adequate spacing

### Responsive Breakpoints (Tailwind CSS)
- **sm**: 640px (tablets)
- **md**: 768px (larger tablets)
- **lg**: 1024px (desktops)
- **xl**: 1280px (wide desktops)
- **2xl**: 1536px (ultra-wide)

### Performance Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with dynamic sizing
- **Lazy Loading**: Components load on-demand
- **Caching**: SWR for efficient data fetching
- **Minification**: Automatic CSS/JS minification in production

### Accessibility Features
- **ARIA Labels**: Semantic HTML with proper ARIA attributes
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant color ratios
- **Screen Reader Support**: Descriptive alt text and labels

---

## 🌐 Language Support

### English
- **Status**: ✅ Fully supported
- **Translation Coverage**: 100%

### Indian Languages (28 Total)
- **Status**: 🚀 Coming Soon
- **Currently Available**: English only
- **When Selected**: Shows "Development in Progress" alert
- **Future Implementation**: Full multilingual UI, content, and translations

**Supported Languages:**
Hindi, Tamil, Telugu, Kannada, Malayalam, Gujarati, Marathi, Bengali, Punjabi, Urdu, Odia, Assamese, Sanskrit, Konkani, Manipuri, Mizo, Nepali, Sindhi, Tibetan, Dogri, Kashmiri, Tripuri, Bodo, Angika, Magahi, Maithili, Santali, and Kokborok.

### Language Context
The app uses a React Context Provider for language management. Add translations in:
- `context/LanguageContext.tsx` - Language switching logic
- `data/recipes-[lang_code].json` - Recipe translations (example: `recipes-hi.json`)

---

## 🔌 API Integration

### Supabase Client
Located in `/lib/supabase.ts`, provides these functions:

```typescript
// Fetch all recipes
getAllRecipes(): Promise<Recipe[]>

// Get featured recipes only
getFeaturedRecipes(): Promise<Recipe[]>

// Filter by category
getRecipesByCategory(category: string): Promise<Recipe[]>

// Get unique categories
getAllCategories(): Promise<string[]>

// Get recipe with full details
getRecipeBySlug(slug: string): Promise<RecipeWithDetails | null>

// Transform JSON to Supabase format
transformJsonRecipeToSupabaseFormat(jsonRecipe): RecipeWithDetails
```

### Data Flow
1. Components call Supabase functions in `useEffect` hooks
2. SWR handles caching and revalidation
3. Data stored in React state
4. Filtered/sorted on client-side for instant UX
5. Fallback to JSON data if Supabase unavailable

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - Go to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

4. **Domain Configuration**
   - Go to Settings → Domains
   - Add your custom domain (optional)
   - Configure DNS records

### Manual Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm run start

# Deploy to any Node.js hosting
# (Vercel, Netlify, Railway, etc.)
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add descriptive commit messages
- Test on multiple devices
- Update documentation if needed
- Ensure responsive design on all breakpoints

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Created by**: Ahan Sardar
- **Built with**: Next.js, React, Tailwind CSS, Supabase
- **Inspired by**: Modern cooking apps and culinary experiences
- **UI Components**: shadcn/ui and Radix UI

---

## 📞 Support

For issues, questions, or suggestions:
1. Open an issue on GitHub
2. Check existing documentation
3. Review Supabase setup guide at `SUPABASE_SETUP.md`

---

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Recipe browsing and search
- ✅ Category filtering
- ✅ Cook-Along timer mode
- ✅ Multi-device responsive design
- ✅ Dark/Light theme
- ✅ Supabase integration
- ✅ 28 Indian languages UI support (translations coming)
- 🚀 English fully supported

### Upcoming Features
- 🚀 Multilingual recipe content
- 🚀 User favorites & collections
- 🚀 Shopping list generator
- 🚀 Recipe rating & reviews
- 🚀 Meal planning calendar
- 🚀 Dietary preferences filters
- 🚀 Social sharing features

---

**Made with ❤️ by Ahan Sardar**
