export enum REWARD_TYPES {
  BUY_N_GET_1 = "BUY_N_GET_1",
  DISCOUNT_PERCENTAGE = "DISCOUNT_PERCENTAGE",
  DISCOUNT_FIX = "DISCOUNT_FIX",
  FREE_ITEM = "FREE_ITEM",
  FREE_ITEM_WITH_PURCHASE = "FREE_ITEM_WITH_PURCHASE",
}

export enum REWARD_STATUS {
  ACTIVE = "active",
  PAUSED = "paused",
}
type BaseRewardConfig = {
  points_needed_value: number
  image_path?: string
}

export type BuyNGet1Config = BaseRewardConfig & {
  required_purchases: number
}

export type DiscountPercentageConfig = BaseRewardConfig & {
  discount_percentage: number
}

export type DiscountFixConfig = BaseRewardConfig & {
  discount_amount: number
}

export type FreeItemConfig = BaseRewardConfig & {
  item_name: string
}

export type FreeItemWithPurchaseConfig = BaseRewardConfig & {
  item_name: string
  free_item_name: string
}

export type RewardConfig =
  | BuyNGet1Config
  | DiscountPercentageConfig
  | DiscountFixConfig
  | FreeItemConfig
  | FreeItemWithPurchaseConfig

export interface Reward {
  id: string
  title: string
  description: string
  type: REWARD_TYPES
  config: RewardConfig
  storeId?: string
}

export type RedeemedReward = {
  id: string
  status: "redeemed" | "canceled" | "used"
  config: RewardConfig
  reward: {
    id: string
    title: string
    description: string
  }
}
