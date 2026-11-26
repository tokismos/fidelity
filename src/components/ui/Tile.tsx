import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { Image, View } from "react-native"

type Tone = "neutral" | "rose" | "sun" | "white"

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"]
  tone?: Tone
  size?: "m" | "l"
  // A photo (the store image) shown instead of the icon when set
  imageUri?: string | null
}

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-ground",
  rose: "bg-rose-soft",
  sun: "bg-sun",
  white: "bg-surface",
}

const ICON_COLOR: Record<Tone, string> = {
  neutral: colors.ink,
  rose: colors.roseInk,
  sun: colors.ink,
  white: colors.ink,
}

// Rounded square with an icon. Size m is 42 (rows), size l is 48 (next to a large title).
export const Tile = ({ icon, tone = "neutral", size = "m", imageUri }: Props) => (
  <View
    className={`items-center justify-center overflow-hidden ${TONE_CLASS[tone]} ${
      size === "l" ? "h-12 w-12 rounded-[15px]" : "h-[42px] w-[42px] rounded-[13px]"
    }`}
  >
    {imageUri ? (
      <Image source={{ uri: imageUri }} className="h-full w-full" accessibilityIgnoresInvertColors />
    ) : (
      <Ionicons name={icon} size={22} color={ICON_COLOR[tone]} />
    )}
  </View>
)
