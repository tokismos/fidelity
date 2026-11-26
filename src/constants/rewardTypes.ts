import { RewardFormField, RewardType } from "@/types"
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
  // Numbers with a step use a stepper starting at the placeholder, others a text field
  step?: number
  // Word under the stepper number
  unit?: string
  max?: number
}

// The order the owner picks a type in: points rewards first, then cards and offers
export const REWARD_TYPE_ORDER: RewardType[] = [
  "FREE_ITEM",
  "DISCOUNT_PERCENTAGE",
  "DISCOUNT_FIX",
  "BUY_N_GET_1",
  "FREE_ITEM_WITH_PURCHASE",
]

// Rewards the customer pays with points. The others are a purchase card or an offer.
export const POINTS_REWARD_TYPES: RewardType[] = ["FREE_ITEM", "DISCOUNT_PERCENTAGE", "DISCOUNT_FIX"]

export const REWARD_TYPE_INFO: Record<RewardType, RewardTypeInfo> = {
  FREE_ITEM: {
    title: "Free item",
    description: "Paid with points",
    icon: "gift-outline",
  },
  DISCOUNT_PERCENTAGE: {
    title: "Percent off",
    description: "Paid with points",
    icon: "pricetag-outline",
  },
  DISCOUNT_FIX: {
    title: "Money off",
    description: "Paid with points",
    icon: "cash-outline",
  },
  BUY_N_GET_1: {
    title: "Buy some, get 1 free",
    description: "A purchase card",
    icon: "cafe-outline",
  },
  FREE_ITEM_WITH_PURCHASE: {
    title: "Free with a purchase",
    description: "No points needed",
    icon: "bag-add-outline",
  },
}

const POINTS_FIELD: RewardFieldInfo = {
  key: "points_needed_value",
  label: "Points needed",
  placeholder: "100",
  numeric: true,
  step: 10,
  unit: "points",
}

export const REWARD_FORM_FIELDS: Record<RewardType, RewardFieldInfo[]> = {
  BUY_N_GET_1: [
    {
      key: "required_purchases",
      label: "Purchases needed",
      placeholder: "9",
      numeric: true,
      step: 1,
      unit: "purchases",
    },
  ],
  DISCOUNT_PERCENTAGE: [
    {
      key: "discount_percentage",
      label: "Percent off",
      placeholder: "10",
      numeric: true,
      step: 5,
      unit: "percent off",
      max: 100,
    },
    POINTS_FIELD,
  ],
  DISCOUNT_FIX: [{ key: "discount_amount", label: "Amount off ($)", placeholder: "5", numeric: true }, POINTS_FIELD],
  FREE_ITEM: [{ key: "item_name", label: "Free item", placeholder: "Coffee", numeric: false }, POINTS_FIELD],
  FREE_ITEM_WITH_PURCHASE: [
    { key: "item_name", label: "Item to buy", placeholder: "Burger", numeric: false },
    { key: "free_item_name", label: "Free item", placeholder: "Fries", numeric: false },
  ],
}
