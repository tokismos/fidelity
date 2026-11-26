import { AppText } from "@/components/ui/AppText"
import { Pressable, View } from "react-native"

type Props = {
  title: string
  // Optional link on the right, e.g. "See all"
  actionLabel?: string
  onAction?: () => void
}

// Small bold title above a group of cards, with the screen's 20 side margin
export const SectionTitle = ({ title, actionLabel, onAction }: Props) => (
  <View className="mx-5 mb-2 mt-5 flex-row items-baseline justify-between gap-3">
    <AppText weight="bold" accessibilityRole="header" numberOfLines={1} className="shrink text-[13px] text-ink-2">
      {title}
    </AppText>
    {actionLabel && onAction && (
      <Pressable
        onPress={onAction}
        accessibilityRole="button"
        hitSlop={{ top: 14, bottom: 14, left: 12, right: 12 }}
        className="active:opacity-60"
      >
        <AppText weight="bold" className="text-[13px] text-rose-ink">
          {actionLabel}
        </AppText>
      </Pressable>
    )}
  </View>
)
