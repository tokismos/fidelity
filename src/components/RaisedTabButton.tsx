import { AppText } from "@/components/ui/AppText"
import { colors, shadows } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { GestureResponderEvent, Pressable, View } from "react-native"

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"]
  label: string
  onPress: (event: GestureResponderEvent) => void
  accessibilityLabel: string
}

// The raised rose button in the middle of a tab bar. The 28 high slot matches the icon slot of the
// other tabs, so the labels line up; the 60 round button rises above the bar from that slot.
export const RaisedTabButton = ({ icon, label, onPress, accessibilityLabel }: Props) => (
  <View className="flex-1 items-center pt-[5px]">
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="items-center"
    >
      <View className="h-7 items-center justify-end">
        <View
          className="h-[60px] w-[60px] items-center justify-center rounded-full border-4 border-surface bg-rose"
          style={shadows.roseButton}
        >
          <Ionicons name={icon} size={28} color={colors.white} />
        </View>
      </View>
      <AppText weight="bold" className="mt-[3px] text-[11px] text-ink">
        {label}
      </AppText>
    </Pressable>
  </View>
)
