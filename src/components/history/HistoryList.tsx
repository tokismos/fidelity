import { EmptyState } from "@/components/EmptyState"
import { AppText } from "@/components/ui/AppText"
import { Chip } from "@/components/ui/Chip"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { Tile } from "@/components/ui/Tile"
import { OperationType, TimelineEntry, WheelSpin } from "@/types"
import { historyDays } from "@/utils/history"
import { formatClock } from "@/utils/time"
import { pendingPrizes } from "@/utils/wheel"
import { Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { ComponentProps, ReactElement } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = {
  // Lines from useCustomerTimeline (or buildTimeline), newest first
  timeline: TimelineEntry[]
  // The customer's wheel spins. Prizes not given yet are shown with a "Waiting" chip.
  spins?: WheelSpin[]
  // Shown above the first day, e.g. a header the screen scrolls with the list
  header?: ReactElement
  onRefresh?: () => void
  refreshing?: boolean
}

type IconName = ComponentProps<typeof Ionicons>["name"]

type Line = {
  icon: IconName
  waiting: boolean
  title: string
  amount: string
}

const POINTS_LINES: Record<OperationType, { icon: IconName; title: string; sign: "+" | "-" }> = {
  add: { icon: "add-outline", title: "Points added", sign: "+" },
  subtract: { icon: "remove-outline", title: "Points removed", sign: "-" },
  reward_redemption: { icon: "gift-outline", title: "Points used", sign: "-" },
  wheel_bonus: { icon: "disc-outline", title: "Points won on the wheel", sign: "+" },
}

const MULTIPLIER_WORDS: Record<number, string> = { 2: "doubled", 3: "tripled" }

const describe = (entry: TimelineEntry, waitingIds: Set<string>): Line => {
  switch (entry.kind) {
    case "points": {
      const { icon, title, sign } = POINTS_LINES[entry.operation]
      return { icon, waiting: false, title, amount: `${sign}${entry.amount}` }
    }
    case "purchase": {
      const added = entry.change > 0
      return {
        icon: "cafe-outline",
        waiting: false,
        title: `${added ? "Purchase added" : "Purchase removed"}, ${entry.title}`,
        amount: added ? "+1" : "-1",
      }
    }
    case "reward":
      if (entry.fromWheel) {
        return { icon: "disc-outline", waiting: waitingIds.has(entry.id), title: `Won ${entry.title}`, amount: "" }
      }
      return {
        icon: "gift-outline",
        waiting: false,
        title: `Reward given, ${entry.title}`,
        amount: entry.pointsCost !== null ? `-${entry.pointsCost}` : "",
      }
  }
}

// "10:42 AM", plus "doubled" when a promotion multiplied the points
const timeLine = (entry: TimelineEntry) => {
  const time = formatClock(entry.date)
  if (entry.kind !== "points" || entry.multiplier <= 1) return time
  return `${time}, ${MULTIPLIER_WORDS[entry.multiplier] ?? `x${entry.multiplier}`}`
}

const HistoryRow = ({ entry, waitingIds }: { entry: TimelineEntry; waitingIds: Set<string> }) => {
  const line = describe(entry, waitingIds)

  return (
    <ListRow
      title={line.title}
      titleLines={2}
      subtitle={timeLine(entry)}
      leading={<Tile icon={line.icon} tone={line.waiting ? "rose" : "neutral"} />}
      trailing={
        line.waiting ? (
          <Chip label="Waiting" tone="rose" />
        ) : line.amount ? (
          <AppText weight="bold" tabular className="text-[16px]">
            {line.amount}
          </AppText>
        ) : undefined
      }
    />
  )
}

// A customer's history, one card per day. It is the whole body of a screen: the list scrolls itself.
export const HistoryList = ({ timeline, spins = [], header, onRefresh, refreshing = false }: Props) => {
  const insets = useSafeAreaInsets()
  const prizes = pendingPrizes(spins)
  const waitingIds = new Set(prizes.map((prize) => prize.id))
  const days = historyDays(timeline, prizes)

  return (
    <FlashList
      data={days}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <SectionTitle title={item.title} />
          <ListCard className="mx-4">
            {item.entries.map((entry) => (
              <HistoryRow key={`${entry.kind}-${entry.id}`} entry={entry} waitingIds={waitingIds} />
            ))}
          </ListCard>
        </View>
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={<EmptyState icon="time-outline" title="No activity yet" />}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  )
}
