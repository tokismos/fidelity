import { wheelColors } from "@/constants/colors"
import { WHEEL_MIN_SLICES, WHEEL_SPIN_DAYS } from "@/constants/wheel"
import { WheelSlice, WheelSpin } from "@/types"
import { DAY, formatDuration } from "@/utils/time"

export const sliceColor = (index: number) => wheelColors[index % wheelColors.length]

// The chance of a slice, e.g. "12%" or "0.5%"
export const sliceChance = (slice: WheelSlice, slices: WheelSlice[]) => {
  const total = slices.reduce((sum, item) => sum + item.weight, 0)
  if (total === 0 || slice.weight === 0) return "0%"
  const percent = (slice.weight / total) * 100
  return `${percent < 1 ? percent.toFixed(1) : Math.round(percent)}%`
}

// Customers only see a wheel with enough slices
export const isWheelReady = (slices: WheelSlice[] | null | undefined) => (slices?.length ?? 0) >= WHEEL_MIN_SLICES

// When the customer can spin again, null when they never spun
export const nextSpinAt = (spins: WheelSpin[]) => {
  const last = spins[0]
  if (!last) return null
  return new Date(new Date(last.created_at).getTime() + WHEEL_SPIN_DAYS * DAY)
}

// "Next spin in 2d 3h", or null when the customer can spin now
export const spinWaitLabel = (nextSpin: Date | null, now: Date) =>
  nextSpin && nextSpin > now ? `Next spin in ${formatDuration(nextSpin.getTime() - now.getTime())}` : null

// Rewards won on the wheel that the store has not given yet
export const pendingPrizes = (spins: WheelSpin[]) => spins.filter((spin) => spin.reward_id && !spin.given_at)

// The wheel turns clockwise, so to stop with a slice under the pointer at the top it turns
// a few full turns, then back by the slice's center angle. A small random offset keeps it natural.
export const landingRotation = (current: number, index: number, count: number) => {
  const slice = 360 / count
  const center = (index + 0.5) * slice
  const offset = (Math.random() - 0.5) * slice * 0.6
  const start = Math.ceil(current / 360) * 360
  return start + 5 * 360 + (360 - center) + offset
}
