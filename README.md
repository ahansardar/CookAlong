# Cook-Along 🍳

A modern, responsive recipe browsing and cook-along companion app built with **Next.js**, **Supabase**, and real-time timer functionality.

**Created by Ahan Sardar ❤️**

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Browser & Device Support](#browser--device-support)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Features
- **Recipe Discovery** with search and category filters  
- **Featured Recipes** for highlighted picks  
- **Cook-Along Mode** with step-by-step instructions and timers  
- **Multi-Device Support**: Fully responsive  
- **Dark/Light Theme** with system preference detection  
- **Installable PWA**: Use on mobile like a native app  

### Recipe Details
- Ingredients with quantities  
- Step-by-step instructions with timers  
- Optional YouTube videos per step  
- Total cooking time display  

### Cook-Along Mode
- Automatic countdown timers per step  
- Pause/resume and manual skip  
- Audio alerts for completion and warnings  
- Visual progress indicators and fullscreen mode  

### Search & Filter
- Real-time search with URL persistence  
- Category filtering with dynamic options  

### Language Support
- English (Fully supported)  
- Indian Languages (Future support for 28 languages including Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Punjabi, Urdu, and more)  

---

## 🛠 Tech Stack

**Frontend**
- Next.js 16 + App Router  
- React 19.2 + Framer Motion  
- Tailwind CSS v4 + shadcn/ui components  
- SWR for data fetching  

**Backend & Database**
- Supabase (PostgreSQL)  
- Next.js API Routes  
- Ready for authentication integration  

**Deployment & Dev**
- Turbopack (Next.js default)  
- npm / yarn  
- Vercel recommended  

---

## 📁 Project Structure

cook-along/
├── app/                    # Pages & layouts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── recipe/
│   │   └── [id]/page.tsx
│   └── cook-along/
│       └── [id]/page.tsx
├── components/             # UI components
│   ├── recipe-card.tsx
│   ├── recipe-list-client.tsx
│   └── cook-along-player.tsx
├── context/                # Language context
│   └── LanguageContext.tsx
├── lib/                    # Supabase client & utils
│   ├── supabase.ts
│   └── utils.ts
├── public/                 # Static assets
│   ├── icon.svg
│   ├── icon-light-32x32.jpg
│   └── apple-icon.jpg
├── data/                   # Recipe JSON data
│   ├── recipes.json
│   └── recipes-hi.json
├── .env.local              # Environment variables
├── tailwind.config.ts      # Tailwind config
├── next.config.mjs         # Next.js config
├── package.json            # Dependencies
└── README.md               # Project documentation

---

## 🌍 Browser & Device Support

**Browsers:** Chrome, Firefox, Safari, Edge (latest versions)  
**Mobile:** Fully responsive, touch-friendly  
**Accessibility:** ARIA labels, keyboard navigation, WCAG AA compliant

---

## 🤝 Contributing

1. Fork → feature branch → commit → push → PR  
2. Follow existing code style  
3. Test responsiveness and accessibility  
4. Document new features  

---

## Try Out at [CookAlong](https://cookalong.vercel.app/)

## 📄 License

MIT License © 2026 Ahan Sardar
