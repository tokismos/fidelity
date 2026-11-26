import { Promotion, PromotionStatus } from "@/types"

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
