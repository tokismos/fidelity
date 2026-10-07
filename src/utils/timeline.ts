import { GivenReward, OperationType, PurchaseLogEntry, TimelineEntry } from "@/types"

type HistoryRow = {
  id: string
  created_at: string
  operation_type: OperationType
  transaction_amount: number
  new_points: number
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
      balance: entry.new_points,
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

// A visit is a day with at least one line in the timeline
export const countVisits = (timeline: TimelineEntry[]) =>
  new Set(timeline.map((entry) => new Date(entry.date).toDateString())).size

// Lines of the same day are shown under one date title
export type TimelineRow =
  { kind: "day"; id: string; title: string } | { kind: "entry"; id: string; entry: TimelineEntry }

export const timelineRows = (timeline: TimelineEntry[]): TimelineRow[] => {
  const rows: TimelineRow[] = []
  let currentDay = ""

  for (const entry of timeline) {
    const day = new Date(entry.date).toDateString()
    if (day !== currentDay) {
      currentDay = day
      rows.push({ kind: "day", id: `day-${day}`, title: formatDay(entry.date) })
    }
    rows.push({ kind: "entry", id: `${entry.kind}-${entry.id}`, entry })
  }

  return rows
}

const formatDay = (date: string) => {
  const day = new Date(date)
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

  if (day.toDateString() === today.toDateString()) return "Today"
  if (day.toDateString() === yesterday.toDateString()) return "Yesterday"
  return day.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })
}
