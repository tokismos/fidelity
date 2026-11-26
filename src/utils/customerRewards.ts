import { REWARD_TYPE_INFO } from "@/constants/rewardTypes"
import { Reward, RewardProgress, RewardWithProgress, StoreOverview, WheelSpin } from "@/types"
import { describeReward } from "@/utils/rewards"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"

type IconName = ComponentProps<typeof Ionicons>["name"]

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`

// What a reward asks for: "Costs 300 points", "Buy 9, get 1 free" or "Free with a burger"
export const rewardCostLine = (reward: Reward) => {
  switch (reward.type) {
    case "BUY_N_GET_1":
      return describeReward(reward)
    case "FREE_ITEM_WITH_PURCHASE":
      return `Free with a ${reward.config.item_name}`
    default:
      return `Costs ${plural(reward.config.points_needed_value, "point")}`
  }
}

// What is left before a reward is ready: "160 points to go" or "2 more purchases"
export const toGoLine = ({ current, target, unit }: RewardProgress) => {
  const remaining = Math.max(0, target - current)
  if (unit === "purchases") return `${remaining} more ${remaining === 1 ? "purchase" : "purchases"}`
  return `${plural(remaining, "point")} to go`
}

export const rewardIcon = (reward: Reward): IconName => REWARD_TYPE_INFO[reward.type].icon

const pointsRewards = (items: RewardWithProgress[]) =>
  items
    .filter((item) => item.progress.unit === "points" && !item.progress.isFinished)
    .sort((a, b) => a.progress.target - b.progress.target)

// The purchase card to show first: a full one, else the one closest to full
const mainCard = (items: RewardWithProgress[]) => {
  const cards = items.filter((item) => item.progress.unit === "purchases" && !item.progress.isFinished)
  const ratio = ({ progress }: RewardWithProgress) => (progress.target > 0 ? progress.current / progress.target : 1)
  return cards.find((item) => item.progress.isReady) ?? [...cards].sort((a, b) => ratio(b) - ratio(a))[0]
}

// What a shop card on "My cards" shows under the shop name
export type ShopSummary =
  | {
      kind: "points"
      // Where each points reward sits on the rail and where the customer is, from 0 to 1
      stops: number[]
      position: number
      // The closest reward not reached yet, and the best one already reached
      next: RewardWithProgress | undefined
      reached: RewardWithProgress | undefined
    }
  | { kind: "card"; card: RewardWithProgress }
  | { kind: "none"; offer: RewardWithProgress | undefined }

export const shopSummary = (items: RewardWithProgress[], points: number): ShopSummary => {
  const rewards = pointsRewards(items)

  if (rewards.length > 0) {
    const highest = rewards[rewards.length - 1].progress.target
    return {
      kind: "points",
      stops: rewards.map((item) => (highest > 0 ? item.progress.target / highest : 1)),
      position: highest > 0 ? Math.min(points / highest, 1) : 1,
      next: rewards.find((item) => !item.progress.isReady),
      reached: [...rewards].reverse().find((item) => item.progress.isReady),
    }
  }

  const card = mainCard(items)
  if (card) return { kind: "card", card }

  return {
    kind: "none",
    offer: items.find((item) => item.progress.unit === null && !item.progress.isFinished),
  }
}

// One row of the customer's Rewards tab
export type CustomerRewardRow = {
  id: string
  rewardId: string
  title: string
  line: string
  icon: IconName
}

export type ShopRewardGroup = {
  storeId: string
  storeName: string
  rows: CustomerRewardRow[]
}

const readyLine = (reward: Reward) => {
  switch (reward.type) {
    case "BUY_N_GET_1":
      return "Card full, 1 free"
    case "FREE_ITEM_WITH_PURCHASE":
      return `When you buy a ${reward.config.item_name}, no points`
    default:
      return `Costs ${plural(reward.config.points_needed_value, "point")}`
  }
}

const rewardRow = ({ reward, progress }: RewardWithProgress): CustomerRewardRow => ({
  id: reward.id,
  rewardId: reward.id,
  title: reward.title,
  line: progress.isReady ? readyLine(reward) : toGoLine(progress),
  icon: rewardIcon(reward),
})

const prizeRows = (prizes: WheelSpin[]): CustomerRewardRow[] =>
  prizes.flatMap((prize) =>
    prize.reward_id
      ? [
          {
            id: prize.id,
            rewardId: prize.reward_id,
            title: prize.reward?.title ?? "Prize",
            line: "Won on the wheel, no points",
            icon: "trophy-outline" as const,
          },
        ]
      : [],
  )

// Every reward of every shop, split into ready and on the way, grouped by shop.
// Wheel prizes waiting at a shop count as ready. Finished one time rewards are left out.
export const customerRewardGroups = (overviews: StoreOverview[], prizesByStore: Record<string, WheelSpin[]>) => {
  const ready: ShopRewardGroup[] = []
  const onTheWay: ShopRewardGroup[] = []

  for (const { userStore, items } of overviews) {
    const open = items.filter((item) => !item.progress.isFinished)
    const counted = open.filter((item) => item.progress.isReady && item.progress.unit !== null)
    const offers = open.filter((item) => item.progress.unit === null)
    const waiting = open.filter((item) => !item.progress.isReady)
    const store = { storeId: userStore.store.id, storeName: userStore.store.name }

    const readyRows = [
      ...counted.map(rewardRow),
      ...prizeRows(prizesByStore[userStore.store.id] ?? []),
      ...offers.map(rewardRow),
    ]
    if (readyRows.length > 0) ready.push({ ...store, rows: readyRows })
    if (waiting.length > 0) onTheWay.push({ ...store, rows: waiting.map(rewardRow) })
  }

  const count = (groups: ShopRewardGroup[]) => groups.reduce((sum, group) => sum + group.rows.length, 0)

  return { ready, onTheWay, readyCount: count(ready), onTheWayCount: count(onTheWay) }
}
