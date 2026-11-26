import { AppText } from "@/components/ui/AppText"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { ActivityIndicator, Pressable, View } from "react-native"

type Variant = "primary" | "rose" | "white" | "line" | "danger"

type Props = {
  title: string
  onPress: () => void
  // primary (navy): every normal action. rose: act on something ready. white: on a colored area.
  // line: quiet second button. danger: delete, end, log out.
  variant?: Variant
  icon?: ComponentProps<typeof Ionicons>["name"]
  // Small second line under the title
  subtitle?: string
  isLoading?: boolean
  disabled?: boolean
  accessibilityLabel?: string
  // Layout classes only, e.g. "flex-1" for two buttons side by side
  className?: string
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-ink",
  rose: "bg-rose",
  white: "bg-surface",
  line: "border-[1.5px] border-line-2",
  danger: "border-[1.5px] border-danger-line",
}

const TEXT_CLASS: Record<Variant, string> = {
  primary: "text-white",
  rose: "text-white",
  white: "text-ink",
  line: "text-ink",
  danger: "text-danger",
}

const CONTENT_COLOR: Record<Variant, string> = {
  primary: colors.white,
  rose: colors.white,
  white: colors.ink,
  line: colors.ink,
  danger: colors.danger,
}

// The main button: 58 high, 20 corners. Disabled uses the sunk color instead of fading.
export const Button = ({
  title,
  onPress,
  variant = "primary",
  icon,
  subtitle,
  isLoading = false,
  disabled = false,
  accessibilityLabel,
  className = "",
}: Props) => {
  const off = disabled && !isLoading
  const textClass = off ? "text-ink-3" : TEXT_CLASS[variant]
  const contentColor = off ? colors.ink3 : CONTENT_COLOR[variant]

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
      className={`h-[58px] flex-row items-center justify-center gap-2 rounded-[20px] px-5 active:opacity-80 ${
        off ? "bg-sunk" : VARIANT_CLASS[variant]
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={contentColor} />
      ) : (
        icon && <Ionicons name={icon} size={22} color={contentColor} />
      )}
      <View className="min-w-0 shrink items-center">
        <AppText weight="bold" numberOfLines={1} className={`text-center text-[17px] ${textClass}`}>
          {title}
        </AppText>
        {subtitle && (
          <AppText numberOfLines={1} className={`text-center text-[12px] opacity-80 ${textClass}`}>
            {subtitle}
          </AppText>
        )}
      </View>
    </Pressable>
  )
}
