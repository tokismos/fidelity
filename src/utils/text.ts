// "sophie.martin@example.com" -> "SM", "sophie@example.com" -> "SO"
export const initials = (email: string | null | undefined) => {
  const name = (email ?? "").split("@")[0]
  const parts = name.split(/[._-]+/).filter(Boolean)
  const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2)
  return letters.toUpperCase() || "?"
}

// "sophie.martin@example.com" -> "sophie.martin"
export const displayName = (email: string | null | undefined) => (email ?? "Customer").split("@")[0]
