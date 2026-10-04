import { REWARD_FORM_FIELDS } from "@/constants/rewardTypes"
import { Reward, RewardConfig, RewardFormValues, RewardProgress, RewardType } from "@/types"

// One line that says what the customer gets
export const describeReward = (reward: Reward) => {
  switch (reward.type) {
    case "BUY_N_GET_1":
      return `Buy ${reward.config.required_purchases}, get 1 free`
    case "DISCOUNT_PERCENTAGE":
      return `${reward.config.discount_percentage}% off`
    case "DISCOUNT_FIX":
      return `$${reward.config.discount_amount} off`
    case "FREE_ITEM":
      return `Free ${reward.config.item_name}`
    case "FREE_ITEM_WITH_PURCHASE":
      return `Free ${reward.config.free_item_name} with a ${reward.config.item_name}`
  }
}

export const getRewardProgress = (reward: Reward, points: number, purchases: number): RewardProgress => {
  switch (reward.type) {
    case "BUY_N_GET_1": {
      const target = reward.config.required_purchases
      return { current: Math.min(purchases, target), target, unit: "purchases", isReady: purchases >= target }
    }
    case "DISCOUNT_PERCENTAGE":
    case "DISCOUNT_FIX":
    case "FREE_ITEM": {
      const target = reward.config.points_needed_value
      return { current: Math.min(points, target), target, unit: "points", isReady: points >= target }
    }
    case "FREE_ITEM_WITH_PURCHASE":
      return { current: 0, target: 0, unit: null, isReady: true }
  }
}

export const progressLabel = ({ current, target, unit }: RewardProgress) => {
  if (unit === "points") return `${current} / ${target} points`
  if (unit === "purchases") return `${current} / ${target} purchases`
  return "No points needed"
}

export const EMPTY_REWARD_FORM: RewardFormValues = {
  title: "",
  description: "",
  image: null,
  required_purchases: "",
  discount_percentage: "",
  discount_amount: "",
  points_needed_value: "",
  item_name: "",
  free_item_name: "",
}

export const rewardToFormValues = (reward: Reward): RewardFormValues => {
  const values = { ...EMPTY_REWARD_FORM, title: reward.title, description: reward.description }
  const image = reward.config.image_path ?? null

  switch (reward.type) {
    case "BUY_N_GET_1":
      return { ...values, image, required_purchases: String(reward.config.required_purchases) }
    case "DISCOUNT_PERCENTAGE":
      return {
        ...values,
        image,
        discount_percentage: String(reward.config.discount_percentage),
        points_needed_value: String(reward.config.points_needed_value),
      }
    case "DISCOUNT_FIX":
      return {
        ...values,
        image,
        discount_amount: String(reward.config.discount_amount),
        points_needed_value: String(reward.config.points_needed_value),
      }
    case "FREE_ITEM":
      return {
        ...values,
        image,
        item_name: reward.config.item_name,
        points_needed_value: String(reward.config.points_needed_value),
      }
    case "FREE_ITEM_WITH_PURCHASE":
      return { ...values, image, item_name: reward.config.item_name, free_item_name: reward.config.free_item_name }
  }
}

// Returns the error to show, or null when the form is complete
export const validateRewardForm = (type: RewardType, values: RewardFormValues) => {
  if (!values.title.trim()) return "Please enter a reward name."
  if (!values.description.trim()) return "Please enter a description."

  for (const field of REWARD_FORM_FIELDS[type]) {
    const value = values[field.key].trim()
    if (!value) return `Please fill in "${field.label}".`
    if (field.numeric && !(Number(value) > 0)) return `"${field.label}" must be a number above 0.`
  }

  if (type === "DISCOUNT_PERCENTAGE" && Number(values.discount_percentage) > 100) {
    return "The discount can't be more than 100%."
  }

  return null
}

// Call after validateRewardForm returned null
export const buildRewardConfig = (type: RewardType, values: RewardFormValues, imageUrl: string | null) => {
  const image = imageUrl ? { image_path: imageUrl } : {}
  const points = Math.round(Number(values.points_needed_value))

  const config: RewardConfig = (() => {
    switch (type) {
      case "BUY_N_GET_1":
        return { required_purchases: Math.round(Number(values.required_purchases)) }
      case "DISCOUNT_PERCENTAGE":
        return { discount_percentage: Number(values.discount_percentage), points_needed_value: points }
      case "DISCOUNT_FIX":
        return { discount_amount: Number(values.discount_amount), points_needed_value: points }
      case "FREE_ITEM":
        return { item_name: values.item_name.trim(), points_needed_value: points }
      case "FREE_ITEM_WITH_PURCHASE":
        return { item_name: values.item_name.trim(), free_item_name: values.free_item_name.trim() }
    }
  })()

  return { ...config, ...image }
}

export const formatDate = (date: string) =>
  new Date(date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
