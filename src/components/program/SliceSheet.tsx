import { SliceForm } from "@/components/program/SliceForm"
import { Sheet } from "@/components/ui/Sheet"
import { WheelSlice } from "@/types"

type Props = {
  visible: boolean
  onClose: () => void
  storeId: string
  // The slice to edit, null to add a new one
  slice: WheelSlice | null
}

// Add a slice, or edit and remove one. The form is mounted each time the sheet opens.
export const SliceSheet = ({ visible, onClose, storeId, slice }: Props) => (
  <Sheet visible={visible} onClose={onClose} title={slice ? "Edit slice" : "Add a slice"}>
    <SliceForm storeId={storeId} slice={slice} onDone={onClose} />
  </Sheet>
)
