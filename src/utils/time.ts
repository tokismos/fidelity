export const DAY = 24 * 60 * 60 * 1000

// The time zone set on this phone, e.g. America/Toronto
export const deviceTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC"

// " (Toronto time)" when the store is in another time zone than this phone
export const timeZoneLabel = (timeZone: string) => {
  if (timeZone === deviceTimeZone()) return ""
  const city = timeZone.split("/").pop()?.replace(/_/g, " ") ?? timeZone
  return ` (${city} time)`
}

const dayKey = (date: Date, timeZone: string) => date.toLocaleDateString("en-CA", { timeZone })

// "6:00 PM" (never "06:00 PM"), in the given time zone. Every time shown in the app goes through this.
export const formatTime = (date: Date, timeZone: string) =>
  date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZone })

// "2:32 PM", in the phone's time zone
export const formatClock = (date: string) => formatTime(new Date(date), deviceTimeZone())

// "today 6:00 PM", "tomorrow 10:00 AM" or "Mon, Oct 6 10:00 AM"
export const formatDayAndTime = (date: Date, now: Date, timeZone: string) => {
  const tomorrow = new Date(now.getTime() + DAY)
  const time = formatTime(date, timeZone)

  if (dayKey(date, timeZone) === dayKey(now, timeZone)) return `today ${time}`
  if (dayKey(date, timeZone) === dayKey(tomorrow, timeZone)) return `tomorrow ${time}`

  const day = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", timeZone })
  return `${day} ${time}`
}

export const isSameDay = (a: Date, b: Date, timeZone: string) => dayKey(a, timeZone) === dayKey(b, timeZone)

// "2d 3h", "1h 20m" or "45m"
export const formatDuration = (milliseconds: number) => {
  const minutes = Math.max(1, Math.round(milliseconds / 60000))
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const rest = minutes % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${rest}m`
  return `${rest}m`
}

// Milliseconds the clock of a time zone is ahead of UTC at this moment
const zoneOffset = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value ?? 0)
  const wallClock = Date.UTC(
    part("year"),
    part("month") - 1,
    part("day"),
    part("hour") % 24,
    part("minute"),
    part("second"),
  )
  return wallClock - Math.floor(date.getTime() / 1000) * 1000
}

// Midnight of the day of `now` in a time zone, as an ISO string in UTC
export const startOfDay = (now: Date, timeZone: string) => {
  const [year, month, day] = dayKey(now, timeZone).split("-").map(Number)
  const midnight = Date.UTC(year, month - 1, day)
  // Checked twice, in case the offset changes between UTC midnight and local midnight (summer time)
  const guess = midnight - zoneOffset(new Date(midnight), timeZone)
  return new Date(midnight - zoneOffset(new Date(guess), timeZone)).toISOString()
}
