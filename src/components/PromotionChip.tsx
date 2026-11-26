import { Chip } from "@/components/ui/Chip"
import { Promotion } from "@/types"
import { deviceTimeZone, formatTime, isSameDay } from "@/utils/time"

type Props = {
  promotion: Promotion
  // The store time zone, the phone's when the store has none
  timeZone: string | null
  now: Date
}

const MULTIPLIER_NAMES: Record<number, string> = { 2: "Double", 3: "Triple" }

// "Double until 6:00 PM", or "Double until Fri 10:00 AM" when it ends another day
export const PromotionChip = ({ promotion, timeZone, now }: Props) => {
  const zone = timeZone ?? deviceTimeZone()
  const end = new Date(promotion.ends_at)
  const time = formatTime(end, zone)
  const day = isSameDay(end, now, zone)
    ? ""
    : `${end.toLocaleDateString(undefined, { weekday: "short", timeZone: zone })} `
  const name = MULTIPLIER_NAMES[promotion.multiplier] ?? `x${promotion.multiplier}`

  return <Chip label={`${name} until ${day}${time}`} tone="sun" icon="flash-outline" />
}
