import { AppText } from "@/components/ui/AppText"
import { Pressable, View } from "react-native"

type Props = {
  amounts: number[]
  // The chosen amount. A value that is not in `amounts` lights up the "Other" cell.
  value: number | null
  onChange: (value: number) => void
  // Tapped on "Other": the caller asks for a custom amount
  onOther: () => void
  otherLabel?: string
}

// A row of quick amounts plus an "Other" cell
export const AmountPicker = ({ amounts, value, onChange, onOther, otherLabel = "Other" }: Props) => {
  const isOther = value !== null && !amounts.includes(value)

  return (
    <View className="flex-row gap-2">
      {amounts.map((amount) => {
        const selected = amount === value
        return (
          <Pressable
            key={amount}
            onPress={() => onChange(amount)}
            accessibilityRole="button"
            accessibilityLabel={`${amount}`}
            accessibilityState={{ selected }}
            className={`h-[54px] flex-1 items-center justify-center rounded-[17px] ${selected ? "bg-ink" : "bg-surface"}`}
          >
            <AppText weight="bold" tabular className={`text-[19px] ${selected ? "text-white" : "text-ink"}`}>
              {amount}
            </AppText>
          </Pressable>
        )
      })}
      <Pressable
        onPress={onOther}
        accessibilityRole="button"
        accessibilityState={{ selected: isOther }}
        className={`h-[54px] flex-1 items-center justify-center rounded-[17px] ${isOther ? "bg-ink" : "bg-surface"}`}
      >
        <AppText weight="bold" numberOfLines={1} className={`text-[14px] ${isOther ? "text-white" : "text-ink-2"}`}>
          {otherLabel}
        </AppText>
      </Pressable>
    </View>
  )
}
