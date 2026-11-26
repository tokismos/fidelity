import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { Pressable } from "react-native"

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"]
  onPress: () => void
  // Says what the button does, e.g. "History"
  accessibilityLabel: string
  color?: string
  size?: number
}

// A 44 x 44 icon button, used in nav bars
export const IconButton = ({ icon, onPress, accessibilityLabel, color = colors.ink, size = 22 }: Props) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    className="h-11 w-11 items-center justify-center rounded-full active:opacity-60"
  >
    <Ionicons name={icon} size={size} color={color} />
  </Pressable>
)
