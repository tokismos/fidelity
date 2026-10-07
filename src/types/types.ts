import { Enums, Tables } from "./database.types"
import { RewardConfig, RewardType, RewardWithProgress } from "./rewards"

export type Id = string | null | undefined

export type Role = Enums<"role">

export type OperationType = Enums<"operation_type">

export type Store = Tables<"stores">

export type HistoryEntry = Tables<"history">

export type Promotion = Tables<"promotions">

export type PromotionStatus = "upcoming" | "active" | "ended"

export type StoreCustomer = {
  id: string
  points: number
  user_id: string
  created_at: string
  profile: { email: string | null } | null
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
  nextReward: RewardWithProgress | undefined
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
  | { kind: "reward"; id: string; date: string; rewardId: string; title: string; pointsCost: number | null }

export type StoreStats = {
  customers: number
  points_given: number
  rewards_given: number
}
