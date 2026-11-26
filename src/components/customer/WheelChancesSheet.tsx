import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { ListCard } from "@/components/ui/ListCard"
import { Sheet } from "@/components/ui/Sheet"
import { shadows } from "@/constants/colors"
import { WheelSlice } from "@/types"
import { sliceChance, sliceColor } from "@/utils/wheel"
import { View } from "react-native"

type Props = {
  visible: boolean
  onClose: () => void
  slices: WheelSlice[]
}

// Every prize of the wheel with its chance, so customers know the odds
export const WheelChancesSheet = ({ visible, onClose, slices }: Props) => (
  <Sheet visible={visible} onClose={onClose} title="Chances">
    <ListCard className="mb-4">
      {slices.map((slice, index) => (
        <View key={slice.id} className="min-h-[44px] flex-row items-center gap-3 px-4 py-[10px]">
          <View
            className="h-[14px] w-[14px] rounded-full"
            style={[{ backgroundColor: sliceColor(index) }, shadows.dotRing]}
          />
          <AppText numberOfLines={1} className="min-w-0 flex-1">
            {slice.points !== null ? `+${slice.points} points` : (slice.reward?.title ?? "Prize")}
          </AppText>
          <AppText weight="bold" tabular>
            {sliceChance(slice, slices)}
          </AppText>
        </View>
      ))}
    </ListCard>
    <Button title="Close" variant="line" onPress={onClose} />
  </Sheet>
)
