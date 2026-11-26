import { AppText } from "@/components/ui/AppText"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { View } from "react-native"

type Tone = "ink" | "sun" | "rose" | "soft" | "outline"

type Props = {
  label: string
  // ink: default. sun: promotion only. rose: "Ready". soft: a quiet state like "Paused". outline: neutral info
  tone?: Tone
  icon?: ComponentProps<typeof Ionicons>["name"]
}

const TONE_CLASS: Record<Tone, string> = {
  ink: "bg-ink",
  sun: "bg-sun",
  rose: "bg-rose-soft",
  soft: "bg-sunk",
  outline: "border-[1.5px] border-line-2",
}

const TEXT_CLASS: Record<Tone, string> = {
  ink: "text-white",
  sun: "text-ink",
  rose: "text-rose-ink",
  soft: "text-ink-2",
  outline: "text-ink",
}

const ICON_COLOR: Record<Tone, string> = {
  ink: colors.white,
  sun: colors.ink,
  rose: colors.roseInk,
  soft: colors.ink2,
  outline: colors.ink,
}

export const Chip = ({ label, tone = "ink", icon }: Props) => (
  <View className={`h-[30px] shrink-0 flex-row items-center gap-[6px] rounded-[15px] px-3 ${TONE_CLASS[tone]}`}>
    {icon && <Ionicons name={icon} size={14} color={ICON_COLOR[tone]} />}
    <AppText weight="bold" numberOfLines={1} className={`text-[12px] ${TEXT_CLASS[tone]}`}>
      {label}
    </AppText>
  </View>
)
