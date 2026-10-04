import { Enums, Tables } from "./database.types"
import { RewardConfig, RewardType } from "./rewards"

export type Id = string | null | undefined

export type Role = Enums<"role">

export type OperationType = Enums<"operation_type">

export type Store = Tables<"stores">

export type HistoryEntry = Tables<"history">

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
  store: Pick<Store, "id" | "name" | "image_url">
}

export type GivenReward = {
  id: string
  created_at: string
  reward_id: string
  config: RewardConfig
  reward: { title: string; type: RewardType } | null
}

// One line in a customer's history: points moves and rewards received
export type TimelineEntry =
  | { kind: "points"; id: string; date: string; operation: OperationType; amount: number }
  | { kind: "reward"; id: string; date: string; title: string; pointsCost: number | null }

export type StoreStats = {
  customers: number
  points_given: number
  rewards_given: number
}
