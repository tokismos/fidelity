import { AppText } from "@/components/ui/AppText"
import { Pressable } from "react-native"

type Props = {
  title: string
  onPress: () => void
  // rose: a link in rose ink. quiet: a soft second action in ink-2, like "Remove the last one"
  tone?: "rose" | "quiet"
  disabled?: boolean
}

// Bold text that acts like a button, with a 44pt tall hit area
export const LinkText = ({ title, onPress, tone = "rose", disabled = false }: Props) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    hitSlop={{ left: 8, right: 8 }}
    className="min-h-[44px] items-center justify-center self-center px-2 active:opacity-60"
  >
    <AppText weight="bold" className={disabled ? "text-ink-3" : tone === "rose" ? "text-rose-ink" : "text-ink-2"}>
      {title}
    </AppText>
  </Pressable>
)
