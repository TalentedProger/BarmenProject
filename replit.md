# Cocktail Constructor (Конструктор Коктейлей)

## Overview

This is a modern full-stack web application for bartenders and cocktail enthusiasts that allows users to create custom cocktails with realistic visualization, taste balance calculation, and recipe sharing. The app features an interactive cocktail constructor with visual glass rendering, ingredient selection, and comprehensive cocktail analytics.

## User Preferences

Preferred communication style: Simple, everyday language.
User language: Russian
Project state: Successfully migrated from Replit Agent to Replit environment
Design preferences: Futuristic minimalism with Rubik + Montserrat fonts, uniform button colors without neon glows, reduced blue accent overload
Project name: "Cocktailo Maker" (updated from "Конструктор Коктейлей")

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

### January 18, 2025 - Complete Authentication Removal & UI Improvements
- ✅ Completely removed authentication system to fix user access issues
- ✅ All pages now work without any authentication requirements
- ✅ Landing page redirects to constructor instead of login
- ✅ API routes simplified to work without user sessions
- ✅ Database seeding with sample ingredients and glass types
- ✅ All authentication errors resolved
- ✅ Updated hero section with split layout (text left, cocktail glass image right)
- ✅ Moved action buttons to bottom of hero section
- ✅ Added SVG cocktail glass illustration with gradient effects
- ✅ Features section with gradient background and dynamic shadows for cards
- ✅ Removed all isLoading checks and auth dependencies from all pages
- ✅ Constructor page improvements: larger top margins, unified container styling, swapped recommendations/ingredients positions
- ✅ Glass selector and visualizer now share same container style with content switching

### Migration Status: COMPLETED
The project has been successfully migrated from Replit Agent to the standard Replit environment. All core functionality is working:
- Landing page with cocktail app introduction
- Constructor page for building cocktails
- Catalog page for browsing recipes
- Generator page for random cocktail creation
- Profile page (demo mode)
- In-memory storage with sample ingredients and glass types
- API endpoints for all cocktail operations
- No authentication required - works as a public demo

### January 18, 2025 - Constructor Page Layout Improvements
- ✅ Reduced center container width by 15% and increased left/right containers accordingly
- ✅ Added animated gradient title that transitions from pink to cyan
- ✅ Repositioned pagination dots below the selection button
- ✅ Made selection button 30% smaller with beautiful glowing shadows
- ✅ Positioned glass navigation arrows at extreme horizontal positions
- ✅ Moved glass name closer to selection button
- ✅ Enlarged glass images to fill available space (w-48 h-56)
- ✅ Added beautiful gradient background from dark purple to dark blue (top-left to bottom-right)
- ✅ Doubled the size of navigation arrows and positioned them at container edges

### January 18, 2025 - Replit Migration Completed
- ✅ Successfully migrated project from Replit Agent to standard Replit environment
- ✅ All required packages installed and verified working
- ✅ Workflow configured and running successfully on port 5000
- ✅ Application tested and confirmed fully functional
- ✅ Landing page hero image updated with new interactive cocktail creation visualization
- ✅ Image positioned in right container, taking 100% height of parent element
- ✅ All core features working: constructor, catalog, generator, and profile pages
- ✅ API endpoints responding correctly (ingredients, recipes, etc.)
- ✅ Migration checklist completed successfully

### January 19, 2025 - Navigation Bar UI Improvements
- ✅ Updated "Начать" button in navigation to match site's futuristic aesthetic
- ✅ Applied gradient styling from neon-turquoise to electric blue with appropriate shadows
- ✅ Added WandSparkles icon to "Начать" button for visual consistency
- ✅ Added new "Вход" (Login) button with outline style using neon-purple theme
- ✅ Both buttons now have hover animations and scale effects matching site design
- ✅ Buttons grouped in flex container for proper spacing and alignment

### January 18, 2025 - Landing Page Improvements
- ✅ Moved 3 cards from "Дополнительные возможности" to "Возможности платформы" section
- ✅ Removed the entire "Дополнительные возможности" section
- ✅ Updated "Возможности платформы" section to display 6 cards in 3-column grid
- ✅ Removed emoji from "Сообщество" card title
- ✅ Updated background colors for cards with distinct colors:
  - Сообщество: red (bg-red-500)
  - Магазин барного инвентаря: orange (bg-orange-500)
  - Специальные курсы: green (bg-green-500)

### January 18, 2025 - New Landing Page Sections
- ✅ Added Newsletter subscription section "Будь в курсе новых рецептов и фишек"
  - Dark graphite background with neon gradients and glowing effects
  - Email input field with dark styling and focus states
  - Gradient subscription button with hover animations
  - Responsive design for mobile devices
- ✅ Added Mobile App section "Cocktailo — теперь в твоём кармане"
  - Two-column layout with content and phone mockup
  - App Store and Google Play download buttons with SVG icons
  - Realistic smartphone mockup with app UI preview
  - Floating animated icons (🍹🧪🍊) around the phone
  - Glowing background effects and hover animations
- ✅ Removed "Готовы начать миксологию?" CTA section

### January 19, 2025 - Authentication Page Implementation
- ✅ Created atmospheric auth page (/auth) with bar background
- ✅ Updated navigation buttons with neon styling and gradients
- ✅ Implemented toggle tabs for login/registration modes
- ✅ Added form validation for email and password fields
- ✅ Integrated futuristic cocktail glass image with dynamic shadows
- ✅ Created multi-layer shadow animation system for visual appeal
- ✅ Added Google OAuth placeholder and guest login options
- ✅ Responsive design with mobile-first approach
- ✅ Rearranged layout: title top, image center, quote bottom

### January 21, 2025 - Migration to Standard Replit Environment Completed
- ✅ Successfully completed migration from Replit Agent to standard Replit environment
- ✅ Fixed PostgreSQL database setup and schema application
- ✅ Resolved API route conflicts (moved /api/recipes/user before /:id route)
- ✅ Fixed TypeScript errors in profile page
- ✅ Profile page UI improvements:
  - Smaller gradient title (dark blue to dark pink) with aligned icon and text
  - Added subtle dynamic shadows to Profile card container
  - Enhanced stats cards with modern gradient backgrounds and icons
  - Improved visual hierarchy and color consistency
- ✅ Header navigation improvements:
  - Removed standalone "Профиль" menu item as requested
  - Added proper hover effects and minimalist styles to navigation buttons
  - Improved button interactions with smooth transitions
- ✅ Database and API stability:
  - All API endpoints working correctly in demo mode
  - User recipes and favorites queries functioning properly
  - Authentication system working without errors

### January 21, 2025 - Profile Avatar & Navigation Improvements
- ✅ Landing page navigation updates:
  - Removed dropdown menu from user avatar
  - Direct navigation to profile page when clicking avatar
  - Avatar displays first letter of nickname on neon gradient background
- ✅ Profile page enhancements:
  - Added photo upload functionality with "Установить фото" button
  - File validation (images only, max 2MB)
  - Updated profile editing UI to include photo upload
  - Consistent footer styling with landing page
- ✅ Backend API improvements:
  - Increased request body limit to 10MB for image uploads
  - Added profileImageUrl support in profile update endpoint
  - Enhanced image validation for base64 data URLs
- ✅ User experience improvements:
  - Unified avatar styling across landing and profile pages
  - Streamlined navigation flow
  - Better error handling for file uploads

### January 24, 2025 - Mobile Hero Image Optimization & Layout Improvements
- ✅ Fixed mobile hero image adaptation issues:
  - Hero image now maintains square proportions on all devices
  - Removed vertical padding that caused stretching on mobile
  - Added pointer-events-none and user-select-none to prevent scaling on touch
  - Implemented responsive max-height with aspect-ratio preservation
  - Minimized vertical spacing around image and adjacent elements
- ✅ Enhanced mobile layout structure:
  - Optimized hero section height for mobile (auto instead of fixed vh)
  - Reduced padding and margins for better mobile spacing
  - Improved text hierarchy with responsive font sizes
  - Centered hero content on mobile devices
- ✅ Added specialized CSS classes:
  - Created .hero-image class with comprehensive mobile optimizations
  - Added touch interaction prevention (no drag, no zoom)
  - Implemented responsive breakpoints for different screen sizes
- ✅ Hero container spacing improvements:
  - Increased all hero container paddings 2-3 times for better content separation
  - Modified button width to 80% of parent container instead of 100%
  - Added additional vertical padding around hero image (py-8, py-6 on mobile)
  - Increased gaps between grid elements and improved overall spacing hierarchy