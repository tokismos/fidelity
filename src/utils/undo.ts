import { LastAction } from "@/types"

// "50 points added" or "Stamp added to Free coffee"
export const describeLastAction = (action: LastAction) => {
  if (action.kind === "points") {
    return `${action.amount} points ${action.operation === "add" ? "added" : "removed"}`
  }
  return action.change > 0 ? `Stamp added to ${action.rewardTitle}` : `Stamp removed from ${action.rewardTitle}`
}
