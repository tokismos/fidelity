import { Constants, RewardFormField, RewardType } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"

type IconName = ComponentProps<typeof Ionicons>["name"]

type RewardTypeInfo = {
  title: string
  description: string
  icon: IconName
}

type RewardFieldInfo = {
  key: RewardFormField
  label: string
  placeholder: string
  numeric: boolean
}

export const REWARD_TYPES = Constants.public.Enums.reward_types

export const REWARD_TYPE_INFO: Record<RewardType, RewardTypeInfo> = {
  BUY_N_GET_1: {
    title: "Buy N get 1",
    description: "A purchase card: after a number of purchases the customer gets one free",
    icon: "cafe-outline",
  },
  DISCOUNT_PERCENTAGE: {
    title: "Percentage discount",
    description: "A % discount the customer pays with points",
    icon: "pricetag-outline",
  },
  DISCOUNT_FIX: {
    title: "Fixed discount",
    description: "A fixed amount off the customer pays with points",
    icon: "cash-outline",
  },
  FREE_ITEM: {
    title: "Free item",
    description: "A free item the customer pays with points",
    icon: "gift-outline",
  },
  FREE_ITEM_WITH_PURCHASE: {
    title: "Free item with purchase",
    description: "A free item when the customer buys another item",
    icon: "bag-add-outline",
  },
}

const POINTS_FIELD: RewardFieldInfo = {
  key: "points_needed_value",
  label: "Points needed",
  placeholder: "100",
  numeric: true,
}

export const REWARD_FORM_FIELDS: Record<RewardType, RewardFieldInfo[]> = {
  BUY_N_GET_1: [{ key: "required_purchases", label: "Purchases needed", placeholder: "9", numeric: true }],
  DISCOUNT_PERCENTAGE: [
    { key: "discount_percentage", label: "Discount (%)", placeholder: "10", numeric: true },
    POINTS_FIELD,
  ],
  DISCOUNT_FIX: [
    { key: "discount_amount", label: "Discount amount ($)", placeholder: "5", numeric: true },
    POINTS_FIELD,
  ],
  FREE_ITEM: [{ key: "item_name", label: "Free item", placeholder: "Coffee", numeric: false }, POINTS_FIELD],
  FREE_ITEM_WITH_PURCHASE: [
    { key: "item_name", label: "Item to buy", placeholder: "Burger", numeric: false },
    { key: "free_item_name", label: "Free item", placeholder: "Fries", numeric: false },
  ],
}
