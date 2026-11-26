import { ReactNode } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AppText } from "@/components/ui/AppText"

type Props = {
  title: string
  subtitle?: string
  // Shown left of the title, e.g. the store Tile on the owner Home
  leading?: ReactNode
}

// The big header of top level tab screens. It includes the top safe area.
export const LargeTitle = ({ title, subtitle, leading }: Props) => {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-row items-center gap-3 px-5 pb-[6px]" style={{ paddingTop: insets.top + 8 }}>
      {leading}
      <View className="min-w-0 flex-1">
        <AppText
          weight="black"
          accessibilityRole="header"
          numberOfLines={2}
          className={`${leading ? "text-[28px]" : "text-[30px]"} tracking-[-0.6px]`}
        >
          {title}
        </AppText>
        {subtitle && (
          <AppText numberOfLines={1} className="mt-[2px] text-[14px] text-ink-2">
            {subtitle}
          </AppText>
        )}
      </View>
    </View>
  )
}
