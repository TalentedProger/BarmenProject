# Cocktail Constructor (Конструктор Коктейлей)

## Overview

This is a modern full-stack web application for bartenders and cocktail enthusiasts that allows users to create custom cocktails with realistic visualization, taste balance calculation, and recipe sharing. The app features an interactive cocktail constructor with visual glass rendering, ingredient selection, and comprehensive cocktail analytics.

## User Preferences

Preferred communication style: Simple, everyday language.
User language: Russian
Project state: Successfully migrated from Replit Agent to Replit environment

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: Zustand for cocktail constructor state
- **Styling**: Tailwind CSS with custom nightclub theme (dark blues, neon colors)
- **UI Components**: Radix UI components with shadcn/ui styling
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM for database operations
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store

### Key Design Decisions
- **Monorepo Structure**: Organized into `client/`, `server/`, and `shared/` directories
- **Type Safety**: Full TypeScript coverage with shared schema definitions
- **Modern UI**: Dark theme with neon accents for nightclub aesthetic
- **Real-time Calculations**: Live cocktail statistics (ABV, cost, taste balance)

## Key Components

### Database Schema
Located in `shared/schema.ts`:
- **Users**: Authentication and profile data
- **Ingredients**: Comprehensive ingredient database with color, ABV, price, taste profile
- **Glass Types**: Different glass shapes and capacities
- **Recipes**: User-created cocktail recipes
- **Recipe Ingredients**: Junction table for recipe-ingredient relationships
- **User Favorites**: User's favorited recipes
- **Recipe Ratings**: Rating system for recipes

### Core Features

#### 1. Cocktail Constructor (`/constructor`)
- Interactive glass selection with different shapes (martini, highball, shot, etc.)
- Ingredient selection by category (alcohol, juice, syrup, fruit, ice)
- Real-time visual cocktail rendering with layered ingredients
- Live calculations: volume, ABV, cost, taste balance
- Recipe saving and sharing functionality

#### 2. Recipe Generator (`/generator`)
- Multiple generation modes (classic, crazy, seasonal)
- Random cocktail creation with various parameters
- Generated recipes can be saved and edited

#### 3. Recipe Catalog (`/catalog`)
- Browse all recipes with search and filtering
- Categories, difficulty levels, and popularity sorting
- Recipe favoriting and rating system

#### 4. User Profile (`/profile`)
- View user's created recipes
- Manage favorites
- User statistics and achievements

## Data Flow

### Authentication Flow
1. User authenticates via Replit Auth (OpenID Connect)
2. Session stored in PostgreSQL with automatic cleanup
3. Protected routes check authentication middleware
4. User data cached in React Query

### Cocktail Creation Flow
1. User selects glass type from available options
2. Adds ingredients with specified amounts
3. Zustand store manages cocktail state
4. Real-time calculations update display
5. Visual renderer shows layered cocktail in glass
6. Recipe can be saved to database with metadata

### Recipe Management
1. Recipes stored with ingredients, instructions, and metadata
2. Search and filtering handled server-side
3. Favorites and ratings update user preferences
4. Recipe sharing through URL generation

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database operations
- **Connection Pooling**: Managed through Neon's connection pooling

### Authentication
- **Replit Auth**: OpenID Connect authentication
- **Session Storage**: PostgreSQL-backed sessions
- **Passport.js**: Authentication middleware

### Frontend Libraries
- **React Query**: Server state management and caching
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **React Hook Form**: Form management

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public/`
2. **Backend**: esbuild bundles server code to `dist/`
3. **Database**: Drizzle migrations applied on deployment

### Environment Configuration
- **Development**: `npm run dev` - concurrent frontend/backend development
- **Production**: `npm run build && npm start` - optimized production build
- **Database**: Migrations with `npm run db:push`

### Replit Integration
- **Authentication**: Integrated with Replit's OAuth system
- **Database**: Automatic provisioning of Neon PostgreSQL
- **Development**: Hot reload and error overlay in development mode

### Production Considerations
- **Static Assets**: Served from `dist/public/`
- **API Routes**: Prefixed with `/api/`
- **Error Handling**: Comprehensive error middleware
- **Security**: HTTPS enforcement, secure session cookies
- **Performance**: Asset optimization and caching headers

The application follows modern full-stack development practices with a focus on type safety, user experience, and maintainable code architecture.

## Recent Changes

### January 17, 2025 - Migration from Replit Agent to Replit Environment
- ✅ Fixed authentication system to work without mandatory login
- ✅ Added database seeding with sample ingredients and glass types
- ✅ Simplified API routes to work in demo mode
- ✅ Removed broken OAuth configuration
- ✅ Updated session management for better compatibility
- ✅ All pages now accessible without authentication errors

### Migration Status: COMPLETED
The project has been successfully migrated from Replit Agent to the standard Replit environment. All core functionality is working:
- Landing page with cocktail app introduction
- Constructor page for building cocktails
- Catalog page for browsing recipes
- Generator page for random cocktail creation
- Profile page (demo mode)
- Database with sample ingredients and glass types
- API endpoints for all cocktail operations