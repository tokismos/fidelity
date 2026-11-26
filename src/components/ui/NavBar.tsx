import { AppText } from "@/components/ui/AppText"
import { IconButton } from "@/components/ui/IconButton"
import { colors } from "@/constants/colors"
import { router } from "expo-router"
import { ReactNode } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = {
  title: string
  // Small line under the title, e.g. the customer or store name
  subtitle?: string
  // Defaults to going back one screen
  onBack?: () => void
  // close: for screens shown as a modal
  backIcon?: "chevron-back" | "close"
  // Right side: a Chip, IconButtons
  trailing?: ReactNode
  // white: over the camera on the scanner
  tone?: "ink" | "white"
  // safe: below the status bar. modal: inside an iOS modal sheet, which already starts below it
  inset?: "safe" | "modal"
}

// Top space of a screen shown in an iOS modal sheet
const MODAL_TOP = 12

// Top bar of pushed screens: back button, title on the left, optional actions on the right.
// It includes the top safe area, or a small fixed space inside a modal sheet.
export const NavBar = ({
  title,
  subtitle,
  onBack,
  backIcon = "chevron-back",
  trailing,
  tone = "ink",
  inset = "safe",
}: Props) => {
  const insets = useSafeAreaInsets()
  const white = tone === "white"

  return (
    <View style={{ paddingTop: inset === "modal" ? MODAL_TOP : insets.top }}>
      <View className="h-12 flex-row items-center gap-[6px] px-3">
        <IconButton
          icon={backIcon}
          onPress={onBack ?? (() => router.back())}
          accessibilityLabel={backIcon === "close" ? "Close" : "Back"}
          color={white ? colors.white : colors.ink}
        />
        <View className="min-w-0 flex-1">
          <AppText
            weight="bold"
            accessibilityRole="header"
            numberOfLines={1}
            className={`text-[18px] leading-[21px] ${white ? "text-white" : "text-ink"}`}
          >
            {title}
          </AppText>
          {subtitle && (
            <AppText numberOfLines={1} className={`text-[13px] leading-[16px] ${white ? "text-white" : "text-ink-2"}`}>
              {subtitle}
            </AppText>
          )}
        </View>
        {trailing}
      </View>
    </View>
  )
}
