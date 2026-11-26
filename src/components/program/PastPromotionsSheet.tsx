import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { Sheet } from "@/components/ui/Sheet"
import { Promotion } from "@/types"
import { multiplierName } from "@/utils/promotions"
import { dayAndTime } from "@/utils/program"
import { formatTime, isSameDay } from "@/utils/time"

type Props = {
  visible: boolean
  onClose: () => void
  // Ended promotions, newest first
  promotions: Promotion[]
  now: Date
  timeZone: string
}

// "Mon, Nov 16 2:00 PM to 6:00 PM"
const dateLine = (promotion: Promotion, now: Date, timeZone: string) => {
  const start = new Date(promotion.starts_at)
  const end = new Date(promotion.ends_at)
  const endText = isSameDay(start, end, timeZone) ? formatTime(end, timeZone) : dayAndTime(end, now, timeZone)
  return `${dayAndTime(start, now, timeZone)} to ${endText}`
}

export const PastPromotionsSheet = ({ visible, onClose, promotions, now, timeZone }: Props) => (
  <Sheet visible={visible} onClose={onClose} title="Past promotions">
    <ListCard>
      {promotions.map((promotion) => (
        <ListRow
          key={promotion.id}
          title={multiplierName(promotion.multiplier)}
          subtitle={dateLine(promotion, now, timeZone)}
        />
      ))}
    </ListCard>
  </Sheet>
)
