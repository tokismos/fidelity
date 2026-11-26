import { TimelineEntry, WheelSpin } from "@/types"
import { timelineRows } from "@/utils/timeline"

// One day of a customer's history: the day title and its lines, newest first
export type HistoryDay = {
  id: string
  title: string
  entries: TimelineEntry[]
}

// Prizes won on the wheel and not given yet become reward lines, so they sort and group like the rest
const prizeEntries = (prizes: WheelSpin[]): TimelineEntry[] =>
  prizes.map((prize) => ({
    kind: "reward",
    id: prize.id,
    date: prize.created_at,
    rewardId: prize.reward_id ?? "",
    title: prize.reward?.title ?? "a prize",
    pointsCost: null,
    fromWheel: true,
  }))

// The timeline grouped by day, with the same day titles as before ("Today", "Yesterday", "Monday 16 November")
export const historyDays = (timeline: TimelineEntry[], prizes: WheelSpin[]): HistoryDay[] => {
  const entries = [...timeline, ...prizeEntries(prizes)].sort((a, b) => b.date.localeCompare(a.date))
  const days: HistoryDay[] = []

  for (const row of timelineRows(entries)) {
    if (row.kind === "day") days.push({ id: row.id, title: row.title, entries: [] })
    else days[days.length - 1]?.entries.push(row.entry)
  }

  return days
}
