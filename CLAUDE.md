# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React Native loyalty points application** built with Expo and Supabase. The app enables businesses to manage customer loyalty programs with point accumulation and reward redemption. It features role-based access control separating admin store management from customer experiences.

## Development Commands

### Essential Commands
- **Start development server**: `npx expo start`
- **Run tests**: `npm test` (no tests yet)
- **Lint code**: `npm run lint`
- **Install dependencies**: `npm install`

### Database
- **Start local Supabase**: `npx supabase start` (needs Docker)
- **New migration**: `npx supabase migration new <snake_case_name>`
- **Regenerate DB types**: `npx supabase gen types typescript --local > src/types/database.types.ts`

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

## Coding Rules

Follow these for all new or edited code. Older files may not match yet; do not reformat whole files unless asked.

### Formatting
- Follow `.prettierrc`: double quotes, no semicolons, trailing commas, 120 columns.
- Import from `src` with the `@/` alias (`@/hooks/useAuth`), never relative paths like `../../../`.

### API functions (`src/api/`)
- One function per file. File name = function name (`getStore.ts` exports `getStore`).
- `export const getX = async ({ userId }: Props) => {}`: one object param, `type Props` above it.
- Import the client with `import { supabase } from "@/utils/supabase"`.
- Guard first: queries `return null` when an id is missing; mutations `throw new Error("storeId is required to add a reward")`.
- Errors: only `if (error) throw error`, then `return data`. No try/catch, no console.log. React Query catches and exposes the error.
- No UI code (`Alert`, navigation) in API files.
- Select explicit columns. For joins use embedded selects plus `.returns<T>()`.
- Anything that changes several tables at once (points + history) goes through a database function called with `.rpc()`.

```typescript
import { supabase } from "@/utils/supabase"
import { Id } from "@/types"

type Props = {
  userId: Id
}

export const getStore = async ({ userId }: Props) => {
  if (!userId) return null

  const { data, error } = await supabase.from("stores").select("id, name, image_url").eq("owner_id", userId).single()
  if (error) throw error

  return data
}
```

### Hooks (`src/hooks/`)
- One hook per file, named `use` + the API function (`getStore` → `useGetStore`).
- Query keys come only from `queryKeys` in `src/hooks/queryKeys.ts`. Never write a key array by hand. Add new keys there.
- `queryKeys` is one object grouped by data type. Each group has `all` (to refresh everything of that type) and builder functions, e.g. `points: { all: ["points"], byUserStore: (userId, storeId) => ["points", { userId, storeId }] }`.
- If `queryKeys.ts` does not exist yet, create it and switch every existing hook to it in the same change. Mixing old hand-written keys with new ones breaks refreshes.
- Queries: `useQuery({ queryKey: queryKeys.store.byOwner(userId), queryFn, enabled: !!userId })`.
- Mutations: `useMutation` with `onSuccess` that invalidates every affected group, e.g. `queryKeys.points.all`. Return `{ verbName: mutation.mutate, ...mutation }`.
- Current user from `useAuth()`. Current admin store from `useGetStore()`.

### Types (`src/types/`)
- Database shapes come from `@/types/database.types`: `Tables<"stores">`, `TablesInsert<...>`, `Enums<"role">`. Do not retype DB enums by hand.
- After any migration, regenerate the DB types (command above).
- Custom types go in `src/types/` and are exported from `src/types/index.ts`. Use `type`, not `interface`.
- No `any`, no `as unknown as`, no `!` non-null assertions.

### Screens (`src/app/`)
- `export default function ScreenName()`, name matching the screen.
- Data only through hooks. No direct `supabase` calls in screens (except `supabase.auth.signOut()`).
- Loading and errors: `<LoadingView />` from `@/components/LoadingView` and `<ErrorView />` from `@/components/ErrorView`. If they do not exist yet, create them from the markup in `src/app/admin/(tabs)/rewards.tsx` (centered `ActivityIndicator`; `alert-circle-outline` icon with "Something went wrong."), each with an optional `message` prop.
- Params: `useLocalSearchParams<{ userId: string }>()`.
- Navigation: `<Link href="..." asChild><Pressable>` for taps, `router.push({ pathname, params })` in code. Write hrefs without route groups (`/admin/home`, not `/admin/(tabs)/home`).
- Keep screens small. Move sub parts into `src/components/`; do not define components inside a screen.
- Only real UI text. No placeholder or debug text, hardcoded IDs, or default credentials.

### Components (`src/components/`)
- PascalCase file with a matching named export: `export const QrCode = ({ value }: Props) => ...`, `type Props` above.
- Prefer presentational components that get data through props.

### UI
- Style with NativeWind `className` only. No `StyleSheet`. Inline `style` only for props that need it (`contentContainerStyle`).
- Raw colors (icon `color`, `ActivityIndicator`) come from `colors` in `@/constants/colors`. No hex codes in screens or components. If the file does not exist yet, create it with: `primary` `#2563EB`, `danger` `#DC2626`, `success` `#16A34A`, `warning` `#EAB308`, `text` `#4B5563`, `muted` `#9CA3AF`.
- Icons from `@expo/vector-icons`, Ionicons first.
- Lists: `FlashList` with `estimatedItemSize`, `keyExtractor={(item) => item.id}`, `ListEmptyComponent`.
- Forms: `useState` (one `formData` object for bigger forms). Confirm risky actions with `Alert.alert` (Cancel + action). Submit with `ButtonWithIndicator`.

### Database (`supabase/migrations/`)
- Never edit or merge a migration that already ran. Add a new one with `npx supabase migration new`.
- Buckets, policies and functions are created in migrations, never by hand in the dashboard.
- Every new table: `enable row level security` plus policies. Policy style: sentence name in quotes, `as permissive`, `(select auth.uid())`.
- Functions: `language plpgsql`, params `p_`, variables `v_`. `security definer` only with `set search_path = ''` and an `auth.uid()` check.