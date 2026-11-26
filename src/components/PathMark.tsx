import { View } from "react-native"

// The small path drawn above "Welcome back": a filled start, the current stop, and an empty end
export const PathMark = () => (
  <View className="h-9 w-[120px]" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <View className="absolute left-[6px] top-[15px] h-[6px] w-[108px] rounded-[3px] bg-line" />
    <View className="absolute left-[6px] top-[15px] h-[6px] w-[56px] rounded-[3px] bg-rose" />
    <View className="absolute left-[3px] top-[11px] h-[14px] w-[14px] rounded-full bg-rose" />
    <View className="absolute left-[100.5px] top-[8.5px] h-[19px] w-[19px] rounded-full border-[3px] border-line-2 bg-ground" />
    <View className="absolute left-[46px] top-[2px] h-8 w-8 rounded-full border-[6px] border-rose bg-surface" />
  </View>
)
