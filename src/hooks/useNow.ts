import { useEffect, useState } from "react"

// The current time, refreshed every interval so countdowns stay correct
export const useNow = (intervalMs = 30000) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}
