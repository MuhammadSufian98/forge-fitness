# GYM-BOT: Elite Fitness Management Platform

A modern, full-featured fitness management application built with **Next.js 16**, **Zustand** state management, and **Tailwind CSS**. Provides personalized training plans, AI-powered coaching, class scheduling, and performance tracking.

## 🚀 Features

### User Dashboard
- **Personalized Home Dashboard** - Overview of user activity and quick stats
- **Training Plans** - Browse and select from tiered fitness programs
- **Class Scheduling** - Book fitness classes with calendar interface
- **Professional Trainers** - Browse coach profiles, leave verified ratings
- **7-Day Trial** - Frictionless onboarding signup flow
- **AI Coach Chat** - Interactive AI-powered fitness assistant
- **Contact Support** - Direct inquiry channel to support team
- **User Profile** - View and manage personal training metrics

### Admin Dashboard
- Parallel admin shell structure ready for analytics and management

### Authentication
- User login with email/password
- User signup with fitness goal selection
- Session management with Zustand stores

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16.2.5 (App Router)
- **State Management**: Zustand 5.0.13 (Centralized per-section stores)
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion 12.38.0
- **Icons**: Lucide React 1.14.0 + Material Symbols
- **Design System**: Material Design 3 principles with custom theme

### State Management Layer
All application state managed through Zustand stores in `/src/stores/`:

```
/stores/
├── home/
│   ├── useHomeShellStore.js      (Navigation: activeSection, sidebar state)
│   ├── usePlansStore.js          (Training tier selection)
│   ├── useScheduleStore.js       (Class booking calendar)
│   ├── useTrainersStore.js       (Coach browsing and ratings)
│   ├── useTrialStore.js          (Trial signup form)
│   ├── useChatStore.js           (AI coach input)
│   ├── useContactStore.js        (Contact form)
│   └── useProfileStore.js        (User profile data)
├── auth/
│   └── useAuthStore.js           (Login, signup, logout)
└── admin/
    └── useAdminShellStore.js     (Admin dashboard shell)
```

### Component Structure
```
/components/
├── layout/
│   ├── Header.js           (Mobile top bar)
│   ├── DesktopHeader.js    (Context-aware sticky header)
│   └── MobileNav.js        (Bottom navigation)
├── home/
│   ├── Sidebar.js          (Left navigation)
│   ├── HomeSection.js      (Dashboard overview)
│   ├── PlansSection.js     (Training plans)
│   ├── ScheduleSection.js  (Class scheduling)
│   ├── TrainersSection.js  (Coach profiles)
│   ├── TrialSection.js     (Trial signup)
│   ├── ChatSection.js      (AI assistant)
│   ├── ContactUsSection.js (Support contact)
│   └── ProfileSection.js   (User profile)
└── admin/
    ├── AdminSidebar.js
    ├── AdminHeader.js
    └── [admin components...]
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Zustand (already in package.json)
npm install zustand@5.0.13
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

**Routes:**
- `/` - Home dashboard (requires auth)
- `/auth/login` - User login
- `/auth/signup` - User registration
- `/admin/dashboard` - Admin panel

### Build & Deploy

```bash
npm run build
npm start
```

## 📝 State Management Pattern

All components use Zustand stores for centralized state:

```javascript
// Store definition
const usePlansStore = create((set) => ({
  selectedPlan: null,
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  closePlan: () => set({ selectedPlan: null }),
}));

// Component usage
export default function PlansSection() {
  const { selectedPlan, setSelectedPlan, closePlan } = usePlansStore();
  return (
    <button onClick={() => setSelectedPlan(plan)}>
      Select Plan
    </button>
  );
}
```

## 🔌 Backend Integration

Each store has action creators ready for API integration:

```javascript
submitTrialForm: async () => {
  set({ isLoading: true });
  try {
    const response = await fetch('/api/trials/signup', {
      method: 'POST',
      body: JSON.stringify(get().form),
    });
    // Handle response
    set({ isSubmitted: true });
  } catch (err) {
    set({ error: err.message });
  } finally {
    set({ isLoading: false });
  }
}
```

## 🎨 Design System

Custom Material Design 3 theme with:
- **Primary Color**: #088395 (Teal)
- **Secondary Color**: #35a29f (Mint)
- **Surface**: #f2f3f6 (Light Gray)
- **Text**: #071952 (Dark Navy)
- **Typography**: Inter, Manrope, Work Sans fonts
- **Corner Radius**: 8px, 12px, 16px, full options

## 📱 Responsive Design

- **Mobile First** - Optimized for small screens
- **Tablet** - Medium screen optimizations
- **Desktop** - Full layout with sidebar + desktop header
- Material Design 3 breakpoints

## ✅ Quality Metrics

- **100%** of interactive components use Zustand stores
- **Zero** prop drilling patterns
- **10** stores created with complete action creators
- **13** components fully integrated with state management
- Error state handling on auth pages
- Loading state feedback on form submissions

## 📚 Documentation

- See [STORE_MIGRATION_COMPLETE.md](STORE_MIGRATION_COMPLETE.md) for detailed store architecture
- See [AGENTS.md](AGENTS.md) for agent customization rules

## 🔄 Development Workflow

1. **Feature Branches** - Create feature/ branches for new work
2. **Store Updates** - Modify relevant store in /stores/
3. **Component Updates** - Update components to use new store actions
4. **Testing** - Test form flows and state transitions
5. **PR Review** - Submit PR with store changes documented

## 🚀 Next Steps

- [ ] Connect stores to backend API endpoints
- [ ] Implement localStorage persistence
- [ ] Add real-time notifications with WebSocket
- [ ] Create admin analytics dashboard
- [ ] Add offline support with service workers
- [ ] Implement payment integration for premium plans

## 📄 License

This project is proprietary software for fitness management.

---

**Last Updated**: May 7, 2026 | **Current Version**: 1.0.0-zustand-complete
