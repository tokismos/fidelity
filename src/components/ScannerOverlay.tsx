import { AppText } from "@/components/ui/AppText"
import { IconButton } from "@/components/ui/IconButton"
import { NavBar } from "@/components/ui/NavBar"
import { colors } from "@/constants/colors"
import { ReactNode } from "react"
import { View } from "react-native"

type Props = {
  isTorchOn: boolean
  // Left out when there is no camera, the torch button is then hidden
  onToggleTorch?: () => void
  onClose: () => void
  // The line under the frame
  hint: string
  // Shown instead of the frame, e.g. the camera permission prompt
  children?: ReactNode
}

const CORNER = "absolute h-[52px] w-[52px] border-white"

// The top bar and the frame drawn over the camera
export const ScannerOverlay = ({ isTorchOn, onToggleTorch, onClose, hint, children }: Props) => (
  <View className="flex-1">
    <NavBar
      title="Scan a customer"
      tone="white"
      backIcon="close"
      onBack={onClose}
      trailing={
        onToggleTorch && (
          <IconButton
            icon={isTorchOn ? "flashlight" : "flashlight-outline"}
            onPress={onToggleTorch}
            accessibilityLabel={isTorchOn ? "Turn the torch off" : "Turn the torch on"}
            color={colors.white}
          />
        )
      }
    />
    <View className="flex-1 items-center justify-center px-8">
      {children ?? (
        <View className="items-center" pointerEvents="none">
          <View className="h-60 w-60">
            <View className={`${CORNER} left-0 top-0 rounded-tl-[22px] border-l-[5px] border-t-[5px]`} />
            <View className={`${CORNER} right-0 top-0 rounded-tr-[22px] border-r-[5px] border-t-[5px]`} />
            <View className={`${CORNER} bottom-0 left-0 rounded-bl-[22px] border-b-[5px] border-l-[5px]`} />
            <View className={`${CORNER} bottom-0 right-0 rounded-br-[22px] border-b-[5px] border-r-[5px]`} />
          </View>
          <AppText className="mt-[26px] text-center text-[16px] leading-[22px] text-white">{hint}</AppText>
        </View>
      )}
    </View>
  </View>
)
