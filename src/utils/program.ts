import { REWARD_TYPE_INFO } from "@/constants/rewardTypes"
import { Reward, WheelSlice } from "@/types"
import { DAY, formatDayAndTime, startOfDay } from "@/utils/time"

// What a points reward costs, null for purchase cards and offers
export const rewardPoints = (reward: Reward) => {
  switch (reward.type) {
    case "FREE_ITEM":
    case "DISCOUNT_PERCENTAGE":
    case "DISCOUNT_FIX":
      return reward.config.points_needed_value
    default:
      return null
  }
}

// "Free item, 300 points" or "Buy some, get 1 free, 9 purchases"
export const rewardTypeLine = (reward: Reward) => {
  const type = REWARD_TYPE_INFO[reward.type].title
  const points = rewardPoints(reward)

  if (points !== null) return `${type}, ${points} points`
  if (reward.type === "BUY_N_GET_1") return `${type}, ${reward.config.required_purchases} purchases`
  return `${type}, no points needed`
}

const HOUR = 60 * 60 * 1000

// The next midnight after `date` in a time zone. Three hours past the next day's start
// is always inside the next day, even when the clocks change.
export const nextMidnight = (date: Date, timeZone: string) => {
  const dayStart = new Date(startOfDay(date, timeZone)).getTime()
  return new Date(startOfDay(new Date(dayStart + DAY + 3 * HOUR), timeZone))
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

// "Today 6:00 PM", "Tomorrow 10:00 AM" or "Sat, Nov 21 10:00 AM"
export const dayAndTime = (date: Date, now: Date, timeZone: string) => capitalize(formatDayAndTime(date, now, timeZone))

// "+10 points" or the reward title
export const sliceName = (slice: WheelSlice) =>
  slice.points !== null ? `+${slice.points} points` : (slice.reward?.title ?? "Reward")
