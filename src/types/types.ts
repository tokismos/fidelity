import { Enums, Tables } from "./database.types"
import { RewardConfig, RewardType } from "./rewards"

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

// One line in a customer's history: points moves, purchases and rewards received
export type TimelineEntry =
  | { kind: "points"; id: string; date: string; operation: OperationType; amount: number; multiplier: number }
  | { kind: "purchase"; id: string; date: string; rewardId: string; title: string; change: number }
  | { kind: "reward"; id: string; date: string; rewardId: string; title: string; pointsCost: number | null }

export type StoreStats = {
  customers: number
  points_given: number
  rewards_given: number
}
