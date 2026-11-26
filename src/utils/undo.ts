import { LastAction } from "@/types"

const pointsWord = (amount: number) => `${amount} ${amount === 1 ? "point" : "points"}`

// "Added 50 points", "Removed 20 points", "Added 1 purchase to Coffee card"
export const describeLastAction = (action: LastAction) => {
  if (action.kind === "points") {
    return `${action.operation === "add" ? "Added" : "Removed"} ${pointsWord(action.amount)}`
  }
  return action.change > 0
    ? `Added 1 purchase to ${action.rewardTitle}`
    : `Removed 1 purchase from ${action.rewardTitle}`
}

// Adding points during a promotion multiplies them, so removed points can only be put back
// when no promotion is running. Every other change can be reversed.
export const canUndo = (action: LastAction, multiplier: number) =>
  action.kind === "purchase" || action.operation === "add" || multiplier <= 1

// The toast text after a change. It says why there is no Undo when the change cannot be reversed.
export const undoToastMessage = (action: LastAction, multiplier: number) => {
  const message = describeLastAction(action)
  return canUndo(action, multiplier) ? message : `${message}. Cannot undo during a promotion.`
}
