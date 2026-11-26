import { POINTS_REWARD_TYPES } from "@/constants/rewardTypes"
import { RewardWithProgress, WheelSpin } from "@/types"
import { pendingPrizes } from "@/utils/wheel"

type Props = {
  // The store's active rewards with the customer's progress on each
  items: RewardWithProgress[]
  // The customer's points in the store
  points: number
  // The customer's wheel spins in the store. Only prizes not given yet are kept.
  prizes: WheelSpin[]
}

// What the path screens draw, from the top of the path to the bottom
export type PathModel = {
  // The cheapest points reward not reached yet, shown above the points
  next: RewardWithProgress | undefined
  // Points still missing for `next`, 0 when there is no next reward
  pointsToGo: number
  // Points rewards the customer can take now, the most expensive first (the far one on top)
  ready: RewardWithProgress[]
  // Rewards won on the wheel and not given yet, newest first
  prizes: WheelSpin[]
  // Buy N get 1 cards not finished
  cards: RewardWithProgress[]
  // Free with a purchase offers not finished
  offers: RewardWithProgress[]
}

export const isPointsReward = ({ reward }: RewardWithProgress) => POINTS_REWARD_TYPES.includes(reward.type)

const byCostDescending = (a: RewardWithProgress, b: RewardWithProgress) => b.progress.target - a.progress.target

// Splits a store's rewards into the parts of the path. One time rewards already received are left out.
export const buildPath = ({ items, points, prizes }: Props): PathModel => {
  const open = items.filter((item) => !item.progress.isFinished)
  const pointsRewards = open.filter(isPointsReward)

  const ready = pointsRewards.filter((item) => item.progress.isReady).sort(byCostDescending)
  const next = pointsRewards
    .filter((item) => !item.progress.isReady)
    .sort((a, b) => a.progress.target - b.progress.target)[0]

  return {
    next,
    pointsToGo: next ? Math.max(0, next.progress.target - points) : 0,
    ready,
    prizes: pendingPrizes(prizes),
    cards: open.filter((item) => item.reward.type === "BUY_N_GET_1"),
    offers: open.filter((item) => item.reward.type === "FREE_ITEM_WITH_PURCHASE"),
  }
}
