import { shadows } from "@/constants/colors"
import { View } from "react-native"

type Props = {
  // Where the rewards sit on the rail, from 0 (start) to 1 (the far reward)
  stops: number[]
  // Where the customer is, from 0 to 1
  position: number
}

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const percent = (value: number) => `${clamp(value) * 100}%` as const

// The small horizontal path on a customer's store card: rose up to the customer, reached stops filled
export const ProgressRail = ({ stops, position }: Props) => {
  const at = clamp(position)

  return (
    <View className="mx-[11px] h-[22px]" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View className="absolute left-0 right-0 top-2 h-[6px] rounded-[3px] bg-sunk" />
      <View className="absolute left-0 top-2 h-[6px] rounded-[3px] bg-rose" style={{ width: percent(at) }} />
      {stops.map((stop, index) => (
        <View
          key={index}
          className={`absolute top-1 -ml-[7px] h-[14px] w-[14px] rounded-full border-[3px] ${
            clamp(stop) <= at ? "border-rose bg-rose" : "border-line-2 bg-surface"
          }`}
          style={{ left: percent(stop) }}
        />
      ))}
      <View
        className="absolute top-0 -ml-[11px] h-[22px] w-[22px] rounded-full border-[5px] border-rose bg-white"
        style={[{ left: percent(at) }, shadows.roseMarkerSmall]}
      />
    </View>
  )
}
