import { NewPromotionForm } from "@/components/program/NewPromotionForm"
import { Sheet } from "@/components/ui/Sheet"

type Props = {
  visible: boolean
  onClose: () => void
  storeId: string
  timeZone: string
  // When a promotion is running: its end
  busyUntil: Date | null
}

// The form is mounted each time the sheet opens, so it always starts fresh
export const NewPromotionSheet = ({ visible, onClose, storeId, timeZone, busyUntil }: Props) => (
  <Sheet visible={visible} onClose={onClose} title="New promotion">
    <NewPromotionForm storeId={storeId} timeZone={timeZone} busyUntil={busyUntil} onDone={onClose} />
  </Sheet>
)
