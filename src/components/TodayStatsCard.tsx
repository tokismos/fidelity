import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { TodayStats } from "@/types"
import { View } from "react-native"

type Props = {
  // Missing while loading: each number shows a dash
  stats: TodayStats | null | undefined
  // Loading failed: a short line says so under the dashes
  hasError?: boolean
}

const ITEMS: { key: keyof TodayStats; label: string }[] = [
  { key: "customers", label: "customers" },
  { key: "points", label: "points given" },
  { key: "rewards", label: "rewards given" },
]

// Today's three numbers of the owner Home, side by side with thin dividers
export const TodayStatsCard = ({ stats, hasError = false }: Props) => (
  <Card className="py-5">
    <View className="flex-row">
      {ITEMS.map(({ key, label }, index) => (
        <View
          key={key}
          accessible
          accessibilityLabel={`${stats ? stats[key] : "Loading"} ${label}`}
          className={`flex-1 items-center px-1 ${index > 0 ? "border-l border-ground" : ""}`}
        >
          <AppText weight="black" tabular numberOfLines={1} className="text-[30px] leading-[34px] tracking-[-0.5px]">
            {stats ? stats[key] : "–"}
          </AppText>
          <AppText numberOfLines={1} className="text-[13px] text-ink-2">
            {label}
          </AppText>
        </View>
      ))}
    </View>
    {hasError && !stats && (
      <AppText className="mt-3 px-4 text-center text-[13px] text-ink-2">{"Could not load today's numbers."}</AppText>
    )}
  </Card>
)
