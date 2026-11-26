import { AppText } from "@/components/ui/AppText"
import { shadows } from "@/constants/colors"
import { View } from "react-native"

type Props = {
  // The customer's points
  value: number
  // Word under the number, e.g. "points"
  label: string
  // l: 84 (customer screens). m: 56 (smaller spaces)
  size?: "l" | "m"
  // Set by Path. Pass them only to override.
  isFirst?: boolean
  isLast?: boolean
}

// "You are here" on the Path: a big white marker with a rose ring and the big number.
// The rail above it is grey (not reached), below it rose (reached).
export const PathHere = ({ value, label, size = "l", isFirst = false, isLast = false }: Props) => (
  <View className="flex-row">
    {!isFirst && <View className="absolute bottom-1/2 left-[38px] top-0 w-[10px] bg-line" />}
    {!isLast && <View className="absolute bottom-0 left-[38px] top-1/2 w-[10px] bg-rose" />}
    <View
      className="absolute left-[25px] top-1/2 -mt-[18px] h-9 w-9 rounded-full border-[6px] border-rose bg-white"
      style={shadows.roseMarker}
    />
    <View className="ml-[78px] min-h-[64px] flex-1 justify-center pb-1 pt-2">
      <AppText
        weight="black"
        tabular
        numberOfLines={1}
        adjustsFontSizeToFit
        className={
          size === "l" ? "text-[84px] leading-[84px] tracking-[-3px]" : "text-[56px] leading-[56px] tracking-[-2px]"
        }
      >
        {value}
      </AppText>
      {/* The label sits about 3 points under the digits. A smaller line height clips the digits on iOS,
          and a negative margin makes the number shrink, so the label is placed over the empty space under the digits */}
      <AppText className={`absolute left-0 right-0 text-ink-2 ${size === "l" ? "top-[66px]" : "top-[47px]"}`}>
        {label}
      </AppText>
    </View>
  </View>
)
