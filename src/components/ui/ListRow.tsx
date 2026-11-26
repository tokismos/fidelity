import { AppText } from "@/components/ui/AppText"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ReactNode } from "react"
import { Pressable, View } from "react-native"

type Props = {
  title: string
  subtitle?: string
  // Shown under the title and subtitle, e.g. PurchaseDots
  detail?: ReactNode
  // Left of the text: Tile, Avatar or a small color dot
  leading?: ReactNode
  // Right of the text, before the chevron: Chip, a number
  trailing?: ReactNode
  showChevron?: boolean
  onPress?: () => void
  titleLines?: number
  accessibilityLabel?: string
}

// One line of a list: a name, at most one small line, and a chevron when it opens something
export const ListRow = ({
  title,
  subtitle,
  detail,
  leading,
  trailing,
  showChevron = false,
  onPress,
  titleLines = 1,
  accessibilityLabel,
}: Props) => {
  const content = (
    <>
      {leading}
      <View className="min-w-0 flex-1">
        <AppText weight="bold" numberOfLines={titleLines} className="text-[16px] leading-[20px]">
          {title}
        </AppText>
        {subtitle && (
          <AppText numberOfLines={1} className="text-[13px] leading-[17px] text-ink-2">
            {subtitle}
          </AppText>
        )}
        {detail && <View className="mt-[7px]">{detail}</View>}
      </View>
      {trailing}
      {showChevron && <Ionicons name="chevron-forward" size={20} color={colors.ink3} />}
    </>
  )
  const classes = "min-h-[60px] flex-row items-center gap-3 py-3 pl-4 pr-3"

  if (!onPress) return <View className={classes}>{content}</View>

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (subtitle ? `${title}, ${subtitle}` : title)}
      className={`${classes} active:bg-ground`}
    >
      {content}
    </Pressable>
  )
}
