import { UndoToast } from "@/components/ui/UndoToast"
import { ToastState } from "@/hooks/useUndoToast"

type Props = {
  toast: ToastState | null
  onHide: () => void
  // Distance from the bottom of the screen, when something sits above the foot button
  bottom?: number
}

// Shows the toast from useUndoToast above the screen's foot button
export const ActionToast = ({ toast, onHide, bottom }: Props) => {
  if (!toast) return null

  return (
    <UndoToast
      key={toast.id}
      message={toast.message}
      actionLabel={toast.onUndo ? "Undo" : undefined}
      onAction={toast.onUndo}
      onHide={onHide}
      bottom={bottom}
    />
  )
}
