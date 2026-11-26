import { AppText } from "@/components/ui/AppText"
import { colors } from "@/constants/colors"
import { ReactNode, useState } from "react"
import { TextInput, TextInputProps, View } from "react-native"

type Props = Omit<TextInputProps, "className" | "style"> & {
  label: string
  // Adds a muted "(optional)" after the label
  optional?: boolean
  // Small help line under the input
  hint?: string
  // Shown inside the input on the right, e.g. a unit like "%"
  trailing?: ReactNode
}

// A label and a text input: 54 high, 16 corners, ink border while typing
export const Field = ({
  label,
  optional = false,
  hint,
  trailing,
  multiline,
  onFocus,
  onBlur,
  ...inputProps
}: Props) => {
  const [focused, setFocused] = useState(false)

  return (
    <View>
      <AppText weight="bold" className="mx-1 mb-[6px] text-[13px]">
        {label}
        {optional && <AppText className="text-[13px] text-ink-2"> (optional)</AppText>}
      </AppText>
      <View
        className={`flex-row gap-[10px] rounded-2xl border-[1.5px] bg-surface px-4 ${
          focused ? "border-ink" : "border-line"
        } ${multiline ? "min-h-[108px] items-start py-[14px]" : "h-[54px] items-center"}`}
      >
        <TextInput
          {...inputProps}
          multiline={multiline}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
          placeholderTextColor={colors.ink3}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          className={`flex-1 p-0 font-rh text-[16px] text-ink ${multiline ? "min-h-[78px]" : "h-full"}`}
          textAlignVertical={multiline ? "top" : "center"}
        />
        {trailing}
      </View>
      {hint && <AppText className="mx-1 mt-[6px] text-[13px] text-ink-2">{hint}</AppText>}
    </View>
  )
}
