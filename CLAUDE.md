# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React Native loyalty points application** built with Expo and Supabase. The app enables businesses to manage customer loyalty programs with point accumulation and reward redemption. It features role-based access control separating admin store management from customer experiences.

## Development Commands

### Essential Commands
- **Start development server**: `npx expo start`
- **Run tests**: `npm test`
- **Lint code**: `npm run lint`
- **Install dependencies**: `npm install`

### Platform-specific
- **Android**: `npm run android`
- **iOS**: `npm run ios` 
- **Web**: `npm run web`

## Architecture Overview

### Authentication & Authorization
- **Supabase Auth** with email/password authentication
- **Role-based routing**: Admin users access `/admin/*` routes, regular users access `/user/*` routes
- **AuthProvider** manages session state and role determination via React Context
- **Role check**: `isUserAdmin()` API call queries `profiles.role` field after authentication

### Database Schema (Supabase)
- **`profiles`**: User profiles with role field (auto-created via trigger)
- **`stores`**: Business entities owned by admin users
- **`user_stores`**: Junction table tracking user-store relationships and loyalty points
- **`rewards`**: Configurable reward definitions with JSON config validation
- **`user_rewards`**: Redeemed rewards tracking with status management
- **`history`**: Immutable audit trail for all point transactions

### API Architecture
- **20+ API functions** in `/src/api/` organized by feature
- **Consistent error handling** with try/catch and Supabase error checking
- **Type safety** using generated database types from Supabase
- **Database functions**: `update_points_with_history()`, `increment_purchases_by_one()`, `validate_reward_config()`

### Routing Structure
- **Expo Router** with file-based routing and typed routes enabled
- **Role-based redirection**: Index route checks auth status and redirects accordingly
- **Admin routes**: `/admin/(tabs)/` with home, settings, rewards, addRewards tabs
- **User routes**: `/user/(tabs)/` with home, profile tabs and dynamic store/reward pages
- **Protected routes**: All routes require authentication, admin routes require admin role

### Data Flow Patterns
1. **Points System**: Admin adds users to stores → creates `user_stores` → points updated via database function → history recorded
2. **Rewards System**: Admin creates rewards with JSON config → users redeem → points deducted → `user_rewards` record created
3. **Type Safety**: Database types generated from Supabase → used in API functions → consumed by React Query hooks

### UI/Styling
- **NativeWind** (Tailwind CSS for React Native) configured in `tailwind.config.js`
- **Global styles** in `global.css` with Tailwind directives
- **Path aliases**: `@/*` resolves to `./src/*` for clean imports

### State Management
- **React Query** for server state caching and synchronization
- **React Context** for authentication state
- **Custom hooks** in `/src/hooks/` wrap API calls with React Query

## Key Patterns to Follow

### API Function Pattern
```typescript
export const apiFunction = async (params: Props): Promise<ReturnType> => {
  try {
    const { data, error } = await supabase.operation()
    if (error) throw error
    return data
  } catch (error) {
    console.log('Error message:', error)
    throw error
  }
}
```

### Component Structure
- **Components** in `/src/components/` are reusable UI elements
- **Hooks** in `/src/hooks/` handle data fetching and business logic
- **Types** in `/src/types/` include database types and custom interfaces

### Database Operations
- Use **RPC functions** for complex operations requiring multiple table updates
- **Row Level Security** policies control data access based on authenticated user
- **Database triggers** handle automatic data validation and record creation