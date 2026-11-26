import { AppText } from "@/components/ui/AppText"
import { Pressable, View } from "react-native"

type Option<T extends string> = {
  value: T
  label: string
}

type Props<T extends string> = {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

export const Segmented = <T extends string>({ options, value, onChange }: Props<T>) => (
  <View accessibilityRole="tablist" className="flex-row gap-[2px] rounded-2xl bg-sunk p-1">
    {options.map((option) => {
      const selected = option.value === value
      return (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          accessibilityRole="tab"
          accessibilityState={{ selected }}
          // 40 high as in the design, the hit area reaches 48
          hitSlop={{ top: 4, bottom: 4 }}
          className={`h-10 flex-1 items-center justify-center rounded-xl px-1 ${selected ? "bg-surface" : ""}`}
        >
          <AppText weight="bold" numberOfLines={1} className={`text-[14px] ${selected ? "text-ink" : "text-ink-2"}`}>
            {option.label}
          </AppText>
        </Pressable>
      )
    })}
  </View>
)
