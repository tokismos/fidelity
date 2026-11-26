import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { Pressable, TextInput, View } from "react-native"

type Props = {
  value: string
  onChangeText: (text: string) => void
  placeholder: string
}

// A search input with a magnifier, styled like Field but without a label
export const SearchField = ({ value, onChangeText, placeholder }: Props) => {
  const [focused, setFocused] = useState(false)

  return (
    <View
      className={`h-[54px] flex-row items-center gap-[10px] rounded-2xl border-[1.5px] bg-surface px-4 ${
        focused ? "border-ink" : "border-line"
      }`}
    >
      <Ionicons name="search-outline" size={18} color={colors.ink2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.ink3}
        accessibilityLabel={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-full flex-1 p-0 font-rh text-[16px] text-ink"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          accessibilityRole="button"
          accessibilityLabel="Clear the search"
          hitSlop={14}
          className="active:opacity-60"
        >
          <Ionicons name="close-circle" size={18} color={colors.ink3} />
        </Pressable>
      )}
    </View>
  )
}
