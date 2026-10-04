import { GivenReward, OperationType, TimelineEntry } from "@/types"

type HistoryRow = {
  id: string
  created_at: string
  operation_type: OperationType
  transaction_amount: number
}

// Merges points changes and rewards received, newest first.
// Points taken by a reward are shown on the reward line, not twice.
export const buildTimeline = (history: HistoryRow[], givenRewards: GivenReward[]): TimelineEntry[] => {
  const points: TimelineEntry[] = history
    .filter((entry) => entry.operation_type !== "reward_redemption")
    .map((entry) => ({
      kind: "points",
      id: entry.id,
      date: entry.created_at,
      operation: entry.operation_type,
      amount: entry.transaction_amount,
    }))

  const rewards: TimelineEntry[] = givenRewards.map((given) => ({
    kind: "reward",
    id: given.id,
    date: given.created_at,
    title: given.reward?.title ?? "Reward",
    pointsCost: "points_needed_value" in given.config ? given.config.points_needed_value : null,
  }))

  return [...points, ...rewards].sort((a, b) => b.date.localeCompare(a.date))
}
