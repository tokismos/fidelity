# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npx expo start` - Start development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator  
- `npm run web` - Start web version
- `npm test` - Run tests with Jest
- `npm run lint` - Run ESLint

## Architecture Overview

This is an Expo React Native app with TypeScript using file-based routing and role-based access control.

### Core Structure
- **File-based routing**: Uses expo-router with root at `./src/app`
- **Authentication**: Supabase-based auth with role checking (admin/user)
- **State management**: React Query for server state, React Context for auth
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Database**: Supabase with TypeScript types generated

### User Flow Architecture
The app has a role-based routing system:

1. **Root layout** (`src/app/_layout.tsx`): Wraps app in AuthProvider and QueryProvider
2. **Route protection**: Both admin and user layouts check authentication status
3. **Role-based routing**: 
   - `/admin/*` - Admin dashboard with tabs (home, settings, rewards, addRewards)
   - `/user/*` - User interface with tabs (home, profile, dynamic store pages)
   - `/(auth)/*` - Sign in/up flows

### Key Patterns
- **API layer**: Centralized in `src/api/` with corresponding React Query hooks in `src/hooks/`
- **Authentication flow**: Session managed via AuthContext, admin status checked per request
- **Type safety**: Database types generated from Supabase schema in `src/types/database.types.ts`
- **Path aliases**: `@/*` maps to `./src/*` for clean imports

### Environment Variables
Required environment variables (see .env.example):
- `EXPO_PUBLIC_SUPABASE_URL_DEV`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY_DEV`