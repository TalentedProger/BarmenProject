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

### January 24, 2025 - Mobile Hero Image Optimization
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
- ✅ Hero container layout improvements:
  - Doubled external container padding (px-8 instead of px-4)
  - Increased internal gaps between elements (gap-12, py-24)
  - Made buttons occupy 80% container width with max-width constraints
  - Centered buttons with improved vertical spacing

### January 25, 2025 - Mobile App Section Responsive Improvements
- ✅ Optimized mobile layout for "Cocktailo mobile app" section
- ✅ On mobile devices, content now flows vertically: title → image → buttons
- ✅ Desktop layout remains unchanged with side-by-side positioning
- ✅ Mobile buttons now display in full-width column layout for better accessibility
- ✅ Maintained all visual styling and hover effects without changes
- ✅ Improved responsive behavior with proper spacing and centering

### January 24, 2025 - Recipe Page Implementation for Mojito
- ✅ Created comprehensive recipe page component (RecipePage.tsx) with futuristic design
- ✅ Implemented all technical requirements from user's specification:
  - Hero section with 3D cocktail image and gradient background
  - Ingredients list with automatic calculations (ABV, volume, calories, cost)
  - Interactive video section with YouTube integration
  - Step-by-step recipe with interactive progress tracking
  - Equipment section with shopping links
  - Taste analysis radar chart with 5 parameters
  - Social functions (rating, favorites, sharing)
  - Recommendations section with related cocktails
- ✅ Added routing for recipe pages (/recipe/:id)
- ✅ Connected recipe cards to navigate to detailed recipe pages
- ✅ Styled with dark theme, neon accents, and smooth animations
- ✅ Fully responsive design with mobile optimizations
- ✅ Data populated for Mojito cocktail with authentic recipe information

### January 24, 2025 - Final Migration to Standard Replit Environment Completed
- ✅ Successfully completed final migration from Replit Agent to standard Replit environment
- ✅ PostgreSQL database provisioned and configured with DATABASE_URL
- ✅ Applied database schema using Drizzle ORM push command
- ✅ All required packages installed and working correctly
- ✅ Server successfully running on port 5000 with complete functionality
- ✅ Database seeding working correctly with sample ingredients and glass types
- ✅ All API endpoints responding correctly
- ✅ Preview and application fully functional in Replit environment
- ✅ Migration checklist completed with all items marked as done

### January 24, 2025 - Complete Migration and Popular Recipes Update
- ✅ Successfully completed migration from Replit Agent to standard Replit environment
- ✅ Set up PostgreSQL database with all required tables and relationships
- ✅ Applied database schema using Drizzle ORM push command
- ✅ Successfully seeded database with sample ingredients and glass types
- ✅ All API endpoints working correctly with proper error handling
- ✅ Updated popular recipes section with 15 new authentic cocktail cards:
  - Created cards for classic cocktails: Маргарита, Мохито, Дайкири, Манхэттен, Негрони
  - Added popular drinks: Пина Колада, Космополитен, Белый русский, Лонг Айленд Айс Ти
  - Included refreshing options: Сангрия, Апероль шприц, Мартини Фиеро Тоник, Куба либре
  - Featured specialty drinks: Б-52, Текила Санрайз
  - Preserved exact design structure: images, descriptions, tags, ABV, volume, price, ratings
  - Maintained consistent styling and layout across all cards
- ✅ Fixed card symmetry issues:
  - Increased image height from h-48 to h-56 (h-36 to h-44 on mobile)
  - Added fixed height container for descriptions with 2-line text clamp
  - Implemented line-clamp-2 CSS utility for consistent text truncation
  - All cards now maintain uniform dimensions and visual consistency
- ✅ Replaced all cocktail images with custom high-quality 3D renders:
  - Updated all 15 cocktail cards with matching custom images provided by user
  - Maintained exact design structure and card layout consistency
  - Images properly matched to corresponding cocktails by filename analysis
  - All new images are high-resolution 3D renders with atmospheric bar backgrounds
- ✅ Redesigned card layout with full-background images:
  - Images now cover entire card area instead of just top portion
  - Content (title, description, stats) overlaid on top of background image
  - Enhanced gradient overlay (from-black/80 via-black/40 to-black/20) for better text readability
  - Improved text contrast with white text and drop shadows
  - Tags redesigned with black/40 background and white borders for better visibility
  - Button enhanced with backdrop-blur and semi-transparent background
- ✅ Improved card content positioning and blur effects:
  - Added blur background container for title and description at top of card
  - Repositioned stats section to bottom area above button
  - Button moved to very bottom with proper margin spacing
  - Title/description container has backdrop-blur-md with black/30 background
  - Maintained card dimensions while optimizing content layout distribution
- ✅ Enhanced header container design and symmetry:
  - Expanded title/description container to full width (100%) of card
  - Reduced blur intensity from backdrop-blur-md to backdrop-blur-sm
  - Increased background opacity from black/30 to black/40 for better readability
  - Applied rounded-t-2xl only to top corners with border-b separator
  - Aligned all section padding symmetrically (py-4) for visual balance
  - Removed side margins to achieve edge-to-edge container coverage
- ✅ Optimized vertical space distribution:
  - Added dual flex-1 spacers for equal space distribution above and below stats
  - Title/description fixed at top, stats centered in middle, button fixed at bottom
  - Eliminated empty space concentration by balancing layout proportions
  - Improved visual hierarchy with symmetric vertical spacing throughout card
- ✅ Typography and spacing refinements:
  - Increased stats text size from text-base to text-lg for better readability
  - Enlarged star icons from w-4 h-4 to w-5 h-5 to match larger text
  - Reduced top container padding from p-4 to p-3 for more compact design
  - Decreased title-description margin from mb-2 to mb-1 and description size from text-base to text-sm
  - Made header container more streamlined while preserving readability