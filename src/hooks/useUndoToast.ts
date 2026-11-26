import { useAddPurchase } from "@/hooks/useAddPurchase"
import { useRemovePurchase } from "@/hooks/useRemovePurchase"
import { useUpdatePoints } from "@/hooks/useUpdatePoints"
import { Id, LastAction } from "@/types"
import { canUndo, undoToastMessage } from "@/utils/undo"
import { useState } from "react"
import { Alert } from "react-native"

type Props = {
  userId: Id
  storeId: Id
  // Points multiplier of the running promotion, 1 when there is none
  multiplier: number
}

export type ToastState = {
  // A new id shows the toast again, even with the same text
  id: number
  message: string
  onUndo?: () => void
}

// The toast shown after an owner changes a customer's card, with Undo when the change can be reversed
export const useUndoToast = ({ userId, storeId, multiplier }: Props) => {
  const [toast, setToast] = useState<ToastState | null>(null)
  const { updatePoints } = useUpdatePoints()
  const { addPurchase } = useAddPurchase()
  const { removePurchase } = useRemovePurchase()

  const showError = (error: Error) => Alert.alert("Could not undo", error.message)

  const undo = (action: LastAction) => {
    if (action.kind === "points") {
      const operationType = action.operation === "add" ? "subtract" : "add"
      return updatePoints({ userId, storeId, amount: action.amount, operationType }, { onError: showError })
    }
    if (action.change > 0) return removePurchase({ userId, rewardId: action.rewardId }, { onError: showError })
    addPurchase({ userId, rewardId: action.rewardId }, { onError: showError })
  }

  const showMessage = (message: string) => setToast({ id: Date.now(), message })

  const showAction = (action: LastAction) =>
    setToast({
      id: Date.now(),
      message: undoToastMessage(action, multiplier),
      onUndo: canUndo(action, multiplier) ? () => undo(action) : undefined,
    })

  return { toast, showAction, showMessage, hideToast: () => setToast(null) }
}
