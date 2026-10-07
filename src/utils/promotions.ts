import { Promotion, PromotionStatus } from "@/types"
import { formatDayAndTime, formatDuration, formatTime, isSameDay, timeZoneLabel } from "@/utils/time"

export const promotionStatus = (promotion: Promotion, now: Date): PromotionStatus => {
  if (new Date(promotion.ends_at) <= now) return "ended"
  if (new Date(promotion.starts_at) > now) return "upcoming"
  return "active"
}

export const multiplierName = (multiplier: number) => (multiplier === 3 ? "Triple points" : "Double points")

// The promotion running now in a store, if any
export const activePromotion = (promotions: Promotion[], storeId: string, now: Date) =>
  promotions.find((promotion) => promotion.store_id === storeId && promotionStatus(promotion, now) === "active")

// The next promotion that hasn't started yet
export const nextPromotion = (promotions: Promotion[], storeId: string, now: Date) =>
  promotions
    .filter((promotion) => promotion.store_id === storeId && promotionStatus(promotion, now) === "upcoming")
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))[0]

// "Ends today 18:00 (in 1h 20m)" or "today 10:00 to 14:00", in the store time zone
export const describePromotionTime = (promotion: Promotion, now: Date, timeZone: string) => {
  const start = new Date(promotion.starts_at)
  const end = new Date(promotion.ends_at)
  const label = timeZoneLabel(timeZone)

  switch (promotionStatus(promotion, now)) {
    case "active":
      return `Ends ${formatDayAndTime(end, now, timeZone)}${label} (in ${formatDuration(end.getTime() - now.getTime())})`
    case "upcoming": {
      const endText = isSameDay(start, end, timeZone) ? formatTime(end, timeZone) : formatDayAndTime(end, now, timeZone)
      return `${formatDayAndTime(start, now, timeZone)} to ${endText}${label}`
    }
    case "ended":
      return `Ended ${formatDayAndTime(end, now, timeZone)}${label}`
  }
}
