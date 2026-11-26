type NameSource = { name?: string | null; email?: string | null } | null | undefined

// The name to show for a customer: "Maya Okafor", else "maya.okafor" from the email, else "Customer"
export const customerName = (profile: NameSource) => {
  const name = profile?.name?.trim()
  if (name) return name

  const emailName = (profile?.email ?? "").split("@")[0].trim()
  return emailName || "Customer"
}

// "Maya Okafor" -> "MO", "sophie.martin@example.com" -> "SM", "sophie@example.com" -> "SO"
export const initials = (value: string | null | undefined) => {
  const text = (value ?? "").trim().split("@")[0]
  const parts = text.split(/[\s._-]+/).filter(Boolean)
  const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : (parts[0] ?? "").slice(0, 2)
  return letters.toUpperCase() || "?"
}
