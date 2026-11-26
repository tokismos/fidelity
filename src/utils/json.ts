import { Json } from "@/types"

// The json object a database function returned, or null when it is not an object
export const asJsonObject = (data: Json) => (data && typeof data === "object" && !Array.isArray(data) ? data : null)
