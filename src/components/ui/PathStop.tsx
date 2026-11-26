import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps, ReactNode } from "react"
import { View } from "react-native"

type Props = {
  // upcoming: not reached yet (grey ring). done: reached, ready (rose node and rail)
  state: "upcoming" | "done"
  // Icon in the done node
  icon?: ComponentProps<typeof Ionicons>["name"]
  // Set by Path. Pass them only to override.
  isFirst?: boolean
  isLast?: boolean
  // Usually a Card with a ListRow
  children: ReactNode
}

// One stop of the Path. The rail fills the whole height of the stop so stops join with no gap.
// Geometry from path.css: content starts 78 from the left, rail and nodes are centered 43 from the left.
export const PathStop = ({ state, icon = "checkmark", isFirst = false, isLast = false, children }: Props) => {
  const done = state === "done"

  return (
    <View className="flex-row">
      <View
        className={`absolute left-[38px] w-[10px] ${done ? "bg-rose" : "bg-line"} ${
          isFirst ? "top-1/2 -mt-[18px] rounded-t-[5px]" : "top-0"
        } ${isLast ? "bottom-1/2 rounded-b-[5px]" : "bottom-0"}`}
      />
      <View
        className={`absolute left-[29px] top-1/2 -mt-[14px] h-7 w-7 items-center justify-center rounded-full border-[3px] ${
          done ? "border-rose bg-rose" : "border-line-2 bg-ground"
        }`}
      >
        {done && <Ionicons name={icon} size={15} color={colors.white} />}
      </View>
      <View className="ml-[78px] min-h-[64px] flex-1 justify-center py-2">{children}</View>
    </View>
  )
}
