import { GivenReward, OperationType, PurchaseLogEntry, TimelineEntry } from "@/types"

type HistoryRow = {
  id: string
  created_at: string
  operation_type: OperationType
  transaction_amount: number
  multiplier: number
}

type Props = {
  history: HistoryRow[]
  givenRewards: GivenReward[]
  purchases: PurchaseLogEntry[]
}

// Merges points changes, purchases and rewards received, newest first.
// Points taken by a reward are shown on the reward line, not twice.
export const buildTimeline = ({ history, givenRewards, purchases }: Props): TimelineEntry[] => {
  const points: TimelineEntry[] = history
    .filter((entry) => entry.operation_type !== "reward_redemption")
    .map((entry) => ({
      kind: "points",
      id: entry.id,
      date: entry.created_at,
      operation: entry.operation_type,
      amount: entry.transaction_amount,
      multiplier: entry.multiplier,
    }))

  const purchaseLines: TimelineEntry[] = purchases.map((purchase) => ({
    kind: "purchase",
    id: purchase.id,
    date: purchase.created_at,
    rewardId: purchase.reward_id,
    title: purchase.reward?.title ?? "Purchase card",
    change: purchase.change,
  }))

  const rewards: TimelineEntry[] = givenRewards.map((given) => ({
    kind: "reward",
    id: given.id,
    date: given.created_at,
    rewardId: given.reward_id,
    title: given.reward?.title ?? "Reward",
    pointsCost: "points_needed_value" in given.config ? given.config.points_needed_value : null,
  }))

  return [...points, ...purchaseLines, ...rewards].sort((a, b) => b.date.localeCompare(a.date))
}

// Only the lines about one reward
export const rewardTimeline = (timeline: TimelineEntry[], rewardId: string) =>
  timeline.filter((entry) => entry.kind !== "points" && entry.rewardId === rewardId)
