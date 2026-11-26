import { AppText } from "@/components/ui/AppText"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useRef, useState } from "react"
import { Pressable, TextInput, View } from "react-native"

type Props = {
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  // Small word under the number, e.g. "points"
  unit?: string
  // inline: compact, for the right side of a row. box: full width white box, for forms
  variant?: "inline" | "box"
  // What the number is, used for the buttons: "Less points", "More points"
  accessibilityLabel?: string
}

const clamp = (value: number, min: number, max?: number) => Math.min(max ?? Infinity, Math.max(min, value))

// Minus and plus around a number. The number can also be typed.
export const Stepper = ({
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  unit,
  variant = "inline",
  accessibilityLabel = "value",
}: Props) => {
  const [text, setText] = useState(String(value))
  const isTyping = useRef(false)
  // While typing, the text stays as typed (it can be out of range for a moment)
  useEffect(() => {
    if (!isTyping.current) setText(String(value))
  }, [value])

  const change = (next: number) => {
    const clamped = clamp(next, min, max)
    setText(String(clamped))
    onChange(clamped)
  }
  // Every typed number is sent up right away, so a save right after typing uses it
  const type = (next: string) => {
    const clean = next.replace(/[^0-9]/g, "")
    setText(clean)
    const typed = Number.parseInt(clean, 10)
    if (!Number.isNaN(typed)) onChange(clamp(typed, min, max))
  }
  // On blur the text shows the saved (clamped) number again
  const commit = () => {
    isTyping.current = false
    setText(String(value))
  }
  const box = variant === "box"

  return (
    <View
      className={`flex-row items-center ${
        box ? "h-[62px] justify-between rounded-2xl border-[1.5px] border-line bg-surface px-2" : "gap-[6px]"
      }`}
    >
      <Pressable
        onPress={() => change(value - step)}
        disabled={value <= min}
        accessibilityRole="button"
        accessibilityLabel={`Less ${accessibilityLabel}`}
        className="h-11 w-11 items-center justify-center rounded-full bg-ground active:opacity-60"
      >
        <Ionicons name="remove" size={20} color={value <= min ? colors.ink3 : colors.ink} />
      </Pressable>
      <View className={`items-center ${box ? "flex-1" : "min-w-[44px]"}`}>
        <TextInput
          value={text}
          onChangeText={type}
          onFocus={() => {
            isTyping.current = true
          }}
          onBlur={commit}
          onSubmitEditing={commit}
          keyboardType="number-pad"
          returnKeyType="done"
          selectTextOnFocus
          accessibilityLabel={accessibilityLabel}
          className={`p-0 text-center font-rh-bold text-ink ${box ? "min-w-[80px] text-[22px]" : "min-w-[44px] text-[20px]"}`}
          style={{ fontVariant: ["tabular-nums"] }}
        />
        {unit && <AppText className="text-[12px] leading-[14px] text-ink-2">{unit}</AppText>}
      </View>
      <Pressable
        onPress={() => change(value + step)}
        disabled={max !== undefined && value >= max}
        accessibilityRole="button"
        accessibilityLabel={`More ${accessibilityLabel}`}
        className="h-11 w-11 items-center justify-center rounded-full bg-ground active:opacity-60"
      >
        <Ionicons name="add" size={20} color={max !== undefined && value >= max ? colors.ink3 : colors.ink} />
      </Pressable>
    </View>
  )
}
