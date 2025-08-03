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