import { Enums, Tables } from "./database.types"
import { RewardConfig, RewardType, RewardWithProgress } from "./rewards"

export type Id = string | null | undefined

export type OperationType = Enums<"operation_type">

export type Store = Tables<"stores">

export type Promotion = Tables<"promotions">

export type PromotionStatus = "upcoming" | "active" | "ended"

// What a store owner sees of a customer's profile
export type CustomerProfile = Pick<Tables<"profiles">, "email" | "name">

export type StoreCustomer = {
  id: string
  points: number
  user_id: string
  created_at: string
  profile: CustomerProfile | null
}

// A customer of the store, for the list of the latest customers served
export type RecentCustomer = Pick<StoreCustomer, "user_id" | "points" | "profile">

// What happened in the store since the start of the day
export type TodayStats = {
  customers: number
  points: number
  rewards: number
}

export type UserStoreWithStore = {
  id: string
  points: number
  store: Pick<Store, "id" | "name" | "image_url" | "timezone">
}

export type GivenReward = {
  id: string
  created_at: string
  reward_id: string
  config: RewardConfig
  from_wheel: boolean
  reward: { title: string; type: RewardType } | null
}

export type PurchaseLogEntry = {
  id: string
  created_at: string
  reward_id: string
  change: number
  reward: { title: string } | null
}

// What update_points_with_history returns
export type PointsUpdateResult = {
  previous_points: number
  new_points: number
  amount: number
  multiplier: number
}

// Purchase count of a customer on one card, across all their stores
export type UserRewardProgress = {
  reward_id: string
  store_id: string
  purchases: number
}

export type UserGivenReward = {
  reward_id: string
  store_id: string
}

// A customer's card in a store with where they stand on its rewards
export type StoreOverview = {
  userStore: UserStoreWithStore
  items: RewardWithProgress[]
  readyCount: number
}

// The admin's last change on a customer, kept so it can be undone
export type LastAction =
  | { kind: "points"; operation: OperationType; amount: number }
  | { kind: "purchase"; rewardId: string; rewardTitle: string; change: 1 | -1 }

// One line in a customer's history: points moves, purchases and rewards received
export type TimelineEntry =
  | {
      kind: "points"
      id: string
      date: string
      operation: OperationType
      amount: number
      multiplier: number
      balance: number
    }
  | { kind: "purchase"; id: string; date: string; rewardId: string; title: string; change: number }
  | {
      kind: "reward"
      id: string
      date: string
      rewardId: string
      title: string
      pointsCost: number | null
      fromWheel: boolean
    }

// A slice of a store's prize wheel: points or a reward
export type WheelSlice = Pick<Tables<"wheel_slices">, "id" | "points" | "reward_id" | "weight" | "weekly_limit"> & {
  reward: { title: string } | null
}

// A spin of the wheel. A reward prize waits for the store owner until given_at is set.
export type WheelSpin = Pick<Tables<"wheel_spins">, "id" | "created_at" | "points" | "reward_id" | "given_at"> & {
  reward: { title: string } | null
}

export type SpinResult = {
  sliceId: string
  points: number | null
}
