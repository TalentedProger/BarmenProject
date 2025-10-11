# Cocktail Constructor (Cocktailo Maker)

## Overview

This is a modern full-stack web application for bartenders and cocktail enthusiasts, enabling users to create custom cocktails with realistic visualization, taste balance calculation, and recipe sharing. The app features an interactive cocktail constructor, a recipe generator, and a comprehensive recipe catalog. It aims to be a public demo for creative cocktail exploration.

## User Preferences

Preferred communication style: Simple, everyday language.
User language: Russian
Design preferences: Futuristic minimalism with Rubik + Montserrat fonts, uniform button colors without neon glows, reduced blue accent overload
Project name: "Cocktailo Maker" (updated from "Конструктор Коктейлей")

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: Zustand
- **Styling**: Tailwind CSS with a custom nightclub theme (dark blues, neon colors)
- **UI Components**: Radix UI with shadcn/ui styling
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect (Note: currently set to public demo mode without active authentication)
- **Session Management**: Express sessions with PostgreSQL store

### Key Design Decisions
- **Monorepo Structure**: Organized into `client/`, `server/`, and `shared/`
- **Type Safety**: Full TypeScript coverage with shared schema definitions
- **Modern UI**: Dark theme with neon accents for a nightclub aesthetic
- **Real-time Calculations**: Live cocktail statistics (ABV, cost, taste balance)
- **Core Features**:
    - **Cocktail Constructor (`/constructor`)**: Interactive glass selection, ingredient layering, real-time visual rendering, and live calculations.
    - **Recipe Generator (`/generator`)**: Random cocktail creation based on various parameters.
    - **Recipe Catalog (`/catalog`)**: Browsing, searching, and filtering recipes with categorization and rating.
    - **User Profile (`/profile`)**: Viewing user's created recipes and managing favorites (currently in demo mode without full user management).
- **UI/UX**: Emphasis on futuristic design, gradient effects, animated elements, and responsive layouts for both desktop and mobile, with high-quality 3D renders for cocktail visuals.

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database.
- **Drizzle ORM**: Type-safe database operations.

### Authentication
- **Replit Auth**: OpenID Connect authentication (though currently not actively used in public demo mode).

### Frontend Libraries
- **React Query**: Server state management and caching.
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first styling.
- **Lucide React**: Icon library.
- **React Hook Form**: Form management.

### Development Tools
- **Vite**: Development server and build tool.
- **TypeScript**: Static type checking.
- **ESLint**: Code linting.
- **Prettier**: Code formatting.

## Project Documentation

Comprehensive documentation has been created in the `docs/` folder:

### 1. Database Implementation (`docs/database-implementation.md`)
- Complete PostgreSQL database schema
- All table structures with relationships
- Drizzle ORM interface documentation
- SQL query examples and best practices
- Migration guidelines

### 2. Technical Stack (`docs/tech-stack.md`)
- Complete list of backend and frontend technologies
- All dependencies with versions
- Project structure and architecture
- Environment variables configuration
- Build and deployment instructions

### 3. Recipe Page Template (`docs/recipe-page-template.md`)
- Complete template for creating cocktail recipe pages
- Section-by-section breakdown with code examples
- API integration guidelines
- Interactive elements implementation
- SEO optimization tips

### 4. Authentication & Storage Issues (`docs/auth-and-storage-issues.md`)
- Critical issues analysis: MemoryStorage vs PostgreSQL
- Google OAuth configuration problems
- Session management issues
- Step-by-step solutions and migration roadmap
- Code examples for proper implementation

## Current Status & Known Issues

### ✅ Working Features
- Frontend application fully functional
- Cocktail constructor with real-time visualization
- Recipe generator with multiple modes
- Recipe catalog and search
- Email/Password authentication (temporary - in-memory)
- User interface and design system

### ⚠️ Critical Issues (Documented in `docs/auth-and-storage-issues.md`)

1. **Data Persistence Problem**
   - Currently using MemoryStorage instead of PostgreSQL
   - All cocktails, recipes, and user data are lost on server restart
   - Database exists and is configured, but not being used

2. **Google OAuth Not Configured**
   - Missing GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Google login button redirects with error
   - Alternative: Can use Replit Auth or Email/Password only

3. **Session Management**
   - Sessions stored in memory instead of PostgreSQL
   - Users logged out on server restart
   - SSL certificate issues with database connection

4. **API Endpoints**
   - Favorites and ratings endpoints are demo stubs
   - Not saving to database

### 📋 Migration Roadmap

**Phase 1: Database Integration (High Priority)**
- [ ] Implement PostgresStorage class with Drizzle ORM
- [ ] Replace MemoryStorage with PostgresStorage
- [ ] Apply database migrations
- [ ] Test all CRUD operations

**Phase 2: Authentication**
- [ ] Configure Google OAuth credentials OR use Replit Auth
- [ ] Fix PostgreSQL session store
- [ ] Test login/logout functionality

**Phase 3: Features**
- [ ] Implement real favorites endpoints
- [ ] Implement real ratings system
- [ ] Add password recovery
- [ ] Add email verification

## Recent Updates (October 11, 2025)

### Design Improvements
- Platform features: Changed from 4-column to 2x2 grid layout on desktop
- Recipe page: Standardized section spacing (mb-16)
- Recipe page: Fixed step-by-step card height to match "Что потребуется?" container
- Modal dialog: Removed duplicate close button
- App Store/Google Play buttons: Fixed icon jumping on hover

### Documentation
- Created comprehensive technical documentation (4 MD files)
- All issues documented with solutions
- Migration roadmap established
- Ready for continuation in another development environment