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

export const getRewardProgress = (
  reward: Reward,
  points: number,
  purchases: number,
  alreadyReceived: boolean,
): RewardProgress => {
  const isFinished = reward.is_one_time && alreadyReceived

  switch (reward.type) {
    case "BUY_N_GET_1": {
      const target = reward.config.required_purchases
      return {
        current: Math.min(purchases, target),
        target,
        unit: "purchases",
        isReady: !isFinished && purchases >= target,
        isFinished,
      }
    }
    case "DISCOUNT_PERCENTAGE":
    case "DISCOUNT_FIX":
    case "FREE_ITEM": {
      const target = reward.config.points_needed_value
      return {
        current: Math.min(points, target),
        target,
        unit: "points",
        isReady: !isFinished && points >= target,
        isFinished,
      }
    }
    case "FREE_ITEM_WITH_PURCHASE":
      return { current: 0, target: 0, unit: null, isReady: !isFinished, isFinished }
  }
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
  is_one_time: false,
}

export const rewardToFormValues = (reward: Reward): RewardFormValues => {
  const values = {
    ...EMPTY_REWARD_FORM,
    title: reward.title,
    description: reward.description,
    is_one_time: reward.is_one_time,
  }
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

// The description is optional in the form: when it is empty, save the line that says what the customer gets
export const withDefaultDescription = (type: RewardType, values: RewardFormValues): RewardFormValues =>
  values.description.trim() ? values : { ...values, description: describeReward(previewReward(type, values)) }

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

// A reward as the form describes it so far, for the live preview. Missing numbers count as 0.
export const previewReward = (type: RewardType, values: RewardFormValues): Reward => {
  const base = {
    id: "preview",
    created_at: new Date().toISOString(),
    title: values.title.trim() || "Reward name",
    description: values.description,
    status: "active" as const,
    store_id: "",
    cost_points: true,
    is_one_time: values.is_one_time,
  }
  const image = values.image ? { image_path: values.image } : {}
  const points = Math.max(0, Math.round(Number(values.points_needed_value) || 0))

  switch (type) {
    case "BUY_N_GET_1":
      return {
        ...base,
        type,
        config: { ...image, required_purchases: Math.max(1, Math.round(Number(values.required_purchases) || 0)) },
      }
    case "DISCOUNT_PERCENTAGE":
      return {
        ...base,
        type,
        config: { ...image, discount_percentage: Number(values.discount_percentage) || 0, points_needed_value: points },
      }
    case "DISCOUNT_FIX":
      return {
        ...base,
        type,
        config: { ...image, discount_amount: Number(values.discount_amount) || 0, points_needed_value: points },
      }
    case "FREE_ITEM":
      return {
        ...base,
        type,
        config: { ...image, item_name: values.item_name.trim() || "item", points_needed_value: points },
      }
    case "FREE_ITEM_WITH_PURCHASE":
      return {
        ...base,
        type,
        config: {
          ...image,
          item_name: values.item_name.trim() || "item",
          free_item_name: values.free_item_name.trim() || "gift",
        },
      }
  }
}
