import { Button } from "@/components/ui/Button"
import { Chip } from "@/components/ui/Chip"
import { Sheet } from "@/components/ui/Sheet"
import { colors } from "@/constants/colors"
import { WHEEL_SPIN_DAYS } from "@/constants/wheel"
import { Ionicons } from "@expo/vector-icons"
import { View } from "react-native"

// What the customer won: points (already on the card) or a reward (given at the counter)
export type WheelWin = { kind: "points"; points: number } | { kind: "reward"; title: string }

type Props = {
  visible: boolean
  // Kept after closing, so the text does not change while the sheet fades out
  win: WheelWin | null
  storeName: string | undefined
  onClose: () => void
  onShowCode: () => void
}

// Shown when the wheel stops
export const WheelResultSheet = ({ visible, win, storeName, onClose, onShowCode }: Props) => {
  const isReward = win?.kind === "reward"
  const title = !win ? "" : win.kind === "points" ? `You won ${win.points} points` : `You won a ${win.title}`
  const subtitle = isReward
    ? `Show your code at ${storeName ?? "the counter"} to get it.`
    : "They are already on your card."

  return (
    <Sheet
      visible={visible && !!win}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={
        <View className="h-[88px] w-[88px] items-center justify-center rounded-full bg-rose-soft">
          <Ionicons name="trophy-outline" size={42} color={colors.roseInk} />
        </View>
      }
    >
      <View className="mb-[22px] items-center">
        <Chip label={`Next spin in ${WHEEL_SPIN_DAYS} days`} tone="soft" icon="time-outline" />
      </View>
      <View className="gap-[10px]">
        {isReward && <Button title="Show my code" icon="qr-code-outline" onPress={onShowCode} />}
        <Button title="Close" variant="line" onPress={onClose} />
      </View>
    </Sheet>
  )
}
