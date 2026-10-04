import { Enums, Tables } from "./database.types"

export type RewardType = Enums<"reward_types">

export type RewardStatus = Enums<"reward_status">

export type BuyNGet1Config = {
  required_purchases: number
  image_path?: string
}

export type DiscountPercentageConfig = {
  discount_percentage: number
  points_needed_value: number
  image_path?: string
}

export type DiscountFixConfig = {
  discount_amount: number
  points_needed_value: number
  image_path?: string
}

export type FreeItemConfig = {
  item_name: string
  points_needed_value: number
  image_path?: string
}

export type FreeItemWithPurchaseConfig = {
  item_name: string
  free_item_name: string
  image_path?: string
}

type RewardRow = Omit<Tables<"rewards">, "type" | "config">

export type BuyNGet1Reward = RewardRow & { type: "BUY_N_GET_1"; config: BuyNGet1Config }

export type DiscountPercentageReward = RewardRow & { type: "DISCOUNT_PERCENTAGE"; config: DiscountPercentageConfig }

export type DiscountFixReward = RewardRow & { type: "DISCOUNT_FIX"; config: DiscountFixConfig }

export type FreeItemReward = RewardRow & { type: "FREE_ITEM"; config: FreeItemConfig }

export type FreeItemWithPurchaseReward = RewardRow & {
  type: "FREE_ITEM_WITH_PURCHASE"
  config: FreeItemWithPurchaseConfig
}

export type Reward =
  BuyNGet1Reward | DiscountPercentageReward | DiscountFixReward | FreeItemReward | FreeItemWithPurchaseReward

export type RewardConfig = Reward["config"]

// Where a customer stands for one reward
export type RewardProgress = {
  current: number
  target: number
  unit: "points" | "purchases" | null
  isReady: boolean
}

// What the reward form edits, all values as typed text
export type RewardFormValues = {
  title: string
  description: string
  image: string | null
  required_purchases: string
  discount_percentage: string
  discount_amount: string
  points_needed_value: string
  item_name: string
  free_item_name: string
}

export type RewardFormField = Exclude<keyof RewardFormValues, "title" | "description" | "image">

export type RewardWithProgress = {
  reward: Reward
  progress: RewardProgress
}

// Actions shown only to the store admin on a reward screen
export type RewardAdminActions = {
  onGive: () => void
  onAddPurchase: () => void
  isPending: boolean
}
