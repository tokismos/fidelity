import { REWARD_FORM_FIELDS } from "@/constants/rewardTypes"
import { Reward, RewardConfig, RewardFormValues, RewardProgress, RewardType, RewardWithProgress } from "@/types"

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

export const progressLabel = ({ current, target, unit, isFinished }: RewardProgress) => {
  if (isFinished) return "Already received"
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

// "2 more stamps" or "180 more points", empty when there is nothing to count
export const remainingLabel = ({ current, target, unit, isReady, isFinished }: RewardProgress) => {
  if (isFinished || isReady || !unit) return ""
  const remaining = target - current
  const noun = unit === "purchases" ? "stamp" : "point"
  return `${remaining} more ${noun}${remaining === 1 ? "" : "s"}`
}

// How far a customer is on a reward, from 0 to 1
const completion = ({ current, target, unit, isFinished }: RewardProgress) => {
  if (isFinished) return -1
  if (!unit || target === 0) return 0
  return current / target
}

// The reward to show first: a ready one, else the one closest to being ready
export const nextReward = (items: RewardWithProgress[]) => {
  const countable = items.filter((item) => item.progress.unit !== null && !item.progress.isFinished)
  const ready = countable.find((item) => item.progress.isReady)
  if (ready) return ready

  return [...countable].sort((a, b) => completion(b.progress) - completion(a.progress))[0]
}

export type RewardGroup = "ready" | "inProgress" | "received"

export const REWARD_GROUP_TITLES: Record<RewardGroup, string> = {
  ready: "Ready to use",
  inProgress: "In progress",
  received: "Received",
}

const rewardGroup = ({ progress }: RewardWithProgress): RewardGroup => {
  if (progress.isFinished) return "received"
  if (progress.isReady) return "ready"
  return "inProgress"
}

// A list of rewards with a title before each group, ready ones first
export type RewardRow =
  { kind: "title"; id: string; title: string } | { kind: "reward"; id: string; item: RewardWithProgress }

export const rewardRows = (items: RewardWithProgress[], titles = REWARD_GROUP_TITLES): RewardRow[] => {
  const groups: RewardGroup[] = ["ready", "inProgress", "received"]

  return groups.flatMap((group) => {
    const members = items.filter((item) => rewardGroup(item) === group)
    if (members.length === 0) return []
    return [
      { kind: "title" as const, id: `title-${group}`, title: titles[group] },
      ...members.map((item) => ({ kind: "reward" as const, id: item.reward.id, item })),
    ]
  })
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

// The text of the confirmation before an admin gives a reward: what it costs and what is left
export const giveRewardMessage = ({ reward, progress }: RewardWithProgress, points: number) => {
  switch (reward.type) {
    case "BUY_N_GET_1":
      return "The card goes back to 0 stamps."
    case "FREE_ITEM_WITH_PURCHASE":
      return `Give it only when the customer buys a ${reward.config.item_name}.`
    default:
      return `${progress.target} points will be taken: ${points} points now, ${points - progress.target} after.`
  }
}
