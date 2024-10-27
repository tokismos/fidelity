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

export type BuyNGet1Config = {
  required_purchases: number
}

export type DiscountPercentageConfig = {
  discount_percentage: number
  points_needed_value: number
}

export type DiscountFixConfig = {
  discount_amount: number
  points_needed_value: number
}

export type FreeItemConfig = {
  item_name: string
  points_needed_value: number
}

export type FreeItemWithPurchaseConfig = {
  item_name: string
  free_item_name: string
}

type RewardConfigMap = {
  [REWARD_TYPES.BUY_N_GET_1]: BuyNGet1Config
  [REWARD_TYPES.DISCOUNT_FIX]: DiscountFixConfig
  [REWARD_TYPES.DISCOUNT_PERCENTAGE]: DiscountPercentageConfig
  [REWARD_TYPES.FREE_ITEM]: FreeItemConfig
  [REWARD_TYPES.FREE_ITEM_WITH_PURCHASE]: FreeItemWithPurchaseConfig
}
export type Reward<T extends REWARD_TYPES> = {
  title: string
  description: string
  status?: REWARD_STATUS
  type: T
  storeId?: string
  config: RewardConfigMap[T] | {}
}
