import { QrCode } from "@/components/QrCode"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Sheet } from "@/components/ui/Sheet"
import { useAuth } from "@/hooks/useAuth"

type Props = {
  visible: boolean
  onClose: () => void
  // The shop the customer is in, for the line under the title
  storeName?: string
}

// The customer's QR code, opened in place by every "Show my code" button
export const CodeSheet = ({ visible, onClose, storeName }: Props) => {
  const { userId } = useAuth()

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Your code"
      subtitle={storeName ? `Show it to the cashier at ${storeName}.` : "Show it at the counter."}
    >
      <Card className="mb-4 items-center p-[22px]">{userId && <QrCode value={userId} size={210} />}</Card>
      <Button title="Done" onPress={onClose} />
    </Sheet>
  )
}
