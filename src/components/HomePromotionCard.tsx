import { Card } from "@/components/ui/Card"
import { ListRow } from "@/components/ui/ListRow"
import { Tile } from "@/components/ui/Tile"
import { Promotion } from "@/types"
import { multiplierName, promotionStatus } from "@/utils/promotions"
import { DAY, formatDuration, formatTime, isSameDay, timeZoneLabel } from "@/utils/time"
import { router } from "expo-router"

type Props = {
  promotion: Promotion
  now: Date
  timeZone: string
}

// "today", "tomorrow", "Saturday" within the week, else "Mon, Dec 7"
const dayWord = (date: Date, now: Date, timeZone: string) => {
  if (isSameDay(date, now, timeZone)) return "today"
  if (isSameDay(date, new Date(now.getTime() + DAY), timeZone)) return "tomorrow"
  if (date.getTime() - now.getTime() < 6 * DAY) return date.toLocaleDateString(undefined, { weekday: "long", timeZone })
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", timeZone })
}

// "6:00 PM" on the same day as `from`, else "tomorrow at 6:00 PM"
const timeFrom = (date: Date, from: Date, now: Date, timeZone: string) =>
  isSameDay(date, from, timeZone)
    ? formatTime(date, timeZone)
    : `${dayWord(date, now, timeZone)} at ${formatTime(date, timeZone)}`

// The running or next promotion on the owner Home. Opens the promotions of the Program tab.
export const HomePromotionCard = ({ promotion, now, timeZone }: Props) => {
  const start = new Date(promotion.starts_at)
  const end = new Date(promotion.ends_at)
  const name = multiplierName(promotion.multiplier)
  const label = timeZoneLabel(timeZone)
  const isActive = promotionStatus(promotion, now) === "active"

  const title = isActive ? `${name} are on` : `${name} start ${dayWord(start, now, timeZone)}`
  const subtitle = isActive
    ? `Ends at ${timeFrom(end, now, now, timeZone)}${label}, ${formatDuration(end.getTime() - now.getTime())} left`
    : `${formatTime(start, timeZone)} to ${timeFrom(end, start, now, timeZone)}${label}`

  return (
    <Card
      className="bg-sun-soft"
      accessibilityLabel={`${title}, ${subtitle}`}
      onPress={() => router.push({ pathname: "/admin/program", params: { tab: "promotions" } })}
    >
      <ListRow title={title} subtitle={subtitle} leading={<Tile icon="flash-outline" tone="sun" />} showChevron />
    </Card>
  )
}
