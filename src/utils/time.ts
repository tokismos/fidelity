// The time zone set on this phone, e.g. America/Toronto
export const deviceTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC"

// " (Toronto time)" when the store is in another time zone than this phone
export const timeZoneLabel = (timeZone: string) => {
  if (timeZone === deviceTimeZone()) return ""
  const city = timeZone.split("/").pop()?.replace(/_/g, " ") ?? timeZone
  return ` (${city} time)`
}

const dayKey = (date: Date, timeZone: string) => date.toLocaleDateString("en-CA", { timeZone })

export const formatTime = (date: Date, timeZone: string) =>
  date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", timeZone })

// "14:32", in the phone's time zone
export const formatClock = (date: string) =>
  new Date(date).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })

// "today 18:00", "tomorrow 10:00" or "Mon, Oct 6 10:00"
export const formatDayAndTime = (date: Date, now: Date, timeZone: string) => {
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
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
