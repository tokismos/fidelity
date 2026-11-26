import { Button } from "@/components/ui/Button"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { Sheet } from "@/components/ui/Sheet"
import { Tile } from "@/components/ui/Tile"
import { View } from "react-native"

type Props = {
  visible: boolean
  onClose: () => void
  // The customer's name
  title: string
  onHistory: () => void
  onRemovePoints: () => void
}

// The three dots menu of the owner's customer screen
export const CustomerMenuSheet = ({ visible, onClose, title, onHistory, onRemovePoints }: Props) => (
  <Sheet visible={visible} onClose={onClose} title={title}>
    <ListCard>
      <ListRow title="History" leading={<Tile icon="time-outline" />} showChevron onPress={onHistory} />
      <ListRow title="Remove points" leading={<Tile icon="remove-outline" />} showChevron onPress={onRemovePoints} />
    </ListCard>
    <View className="mt-4">
      <Button title="Close" variant="line" onPress={onClose} />
    </View>
  </Sheet>
)
