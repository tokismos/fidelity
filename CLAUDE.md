# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React Native loyalty points application** built with Expo and Supabase. The app enables businesses to manage customer loyalty programs with point accumulation and reward redemption. It features role-based access control separating admin store management from customer experiences.

## Development Commands

### Essential Commands
- **Start development server**: `npx expo start`
- **Run tests**: `npm test` (no tests yet)
- **Lint code**: `npm run lint` (broken: the old ESLint config needs migrating)
- **Format**: `npx prettier --write <files>`
- **Install dependencies**: `npm install`

### Database
- **Start local Supabase**: `npx supabase start` (needs Docker)
- **New migration**: `npx supabase migration new <snake_case_name>`
- **Regenerate DB types**: `npx supabase gen types typescript --local > src/types/database.types.ts`

### Platform-specific
- **iOS**: `npm run ios` (Xcode 27 replaced the Simulator app with Device Hub, so if Expo can't open it, boot an iPhone and run `xcrun simctl openurl booted exp://127.0.0.1:8081`)
- **Android**: `npm run android`
- Mobile only, there is no web build.

### Local test accounts
`admin@test.com` (owns "Test Cafe") and `user@test.com`, password `password123`. They exist only in the local database. In development the sign in screen has buttons to log in with them.

## Architecture Overview

### Authentication & Authorization
- **Supabase Auth** with email/password authentication
- **Role-based routing**: `admin/_layout.tsx` and `user/_layout.tsx` redirect anyone with the wrong role
- **AuthProvider** gives `session`, `userId`, `email`, `isAdmin` through `useAuth()`
- Roles are set in the database only. Users cannot change their own profile.

### Business rules
- The **admin does every action**: add/remove points, add a purchase, give a reward. Customers only read.
- Reward types (`reward_types` enum): `FREE_ITEM`, `DISCOUNT_PERCENTAGE`, `DISCOUNT_FIX` cost points. `BUY_N_GET_1` is a purchase card (`reward_progress.purchases`). `FREE_ITEM_WITH_PURCHASE` needs no points.
- Paused rewards (`status = paused`) are hidden from customers.

### Database Schema (Supabase)
- **`profiles`**: role and email (auto-created via trigger)
- **`stores`**: one per admin (`owner_id`), with `image_url` in the public `images` bucket
- **`user_stores`**: a customer's card in a store, with `points`
- **`rewards`**: reward definitions, `config` checked by `validate_reward_config()`
- **`reward_progress`**: purchase count per customer for `BUY_N_GET_1` rewards
- **`user_rewards`**: log of rewards given (a config snapshot)
- **`history`**: log of every points change
- Row level security is on for every table. Customers read their own rows, store owners read their store's rows. Writes to points, progress and given rewards only go through database functions.

### Database functions
- `update_points_with_history(p_user_id, p_store_id, p_transaction_amount, p_operation_type)`: add or remove points
- `add_purchase(p_user_id, p_reward_id)`: one more purchase on a Buy N get 1 card
- `give_reward(p_user_id, p_reward_id)`: takes the points or resets the card, then logs the reward
- `get_store_stats(p_store_id)`: dashboard numbers
- `is_store_owner(p_store_id)`: used by policies and functions

### Routing Structure
- **Admin**: tabs `home` (dashboard, customers), `rewards`, `addRewards` (new reward), `settings`. Stack: `upsert` (create/edit reward), `scanner`, `customer/[userId]`, `customer/[userId]/reward/[rewardId]`
- **User**: tabs `home` (my stores), `profile` (QR code). Stack: `store/[storeId]`, `reward/[rewardId]`
- Each reward type has its own screen in `src/components/rewards/`, picked by `RewardDetail`. Admin screens pass `admin` actions, customer screens are read only.

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
- Lists: `FlashList` (v2, no `estimatedItemSize`) with `keyExtractor={(item) => item.id}`, `ListEmptyComponent`.
- Forms: `useState` (one `formData` object for bigger forms). Confirm risky actions with `Alert.alert` (Cancel + action). Submit with `ButtonWithIndicator`.

### Database (`supabase/migrations/`)
- Never edit or merge a migration that already ran. Add a new one with `npx supabase migration new`.
- Buckets, policies and functions are created in migrations, never by hand in the dashboard.
- Every new table: `enable row level security` plus policies. Policy style: sentence name in quotes, `as permissive`, `(select auth.uid())`.
- Functions: `language plpgsql`, params `p_`, variables `v_`. `security definer` only with `set search_path = ''` and an `auth.uid()` check.