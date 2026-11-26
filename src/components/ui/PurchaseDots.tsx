import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { View } from "react-native"

type Size = "s" | "m" | "l"

type Props = {
  // Purchases needed before the free one
  total: number
  // Purchases made so far
  filled: number
  // s: 14 dots in a row. m: 16 dots (customer cards). l: 52 circles, 5 per row, with check and gift icons
  size?: Size
}

const PER_ROW = 5

// One dot per purchase plus the free one at the end: dashed rose, solid rose once the card is full
export const PurchaseDots = ({ total, filled, size = "s" }: Props) => {
  const count = Math.max(0, total)
  const done = Math.min(Math.max(0, filled), count)
  const complete = count > 0 && done >= count
  const label = `${done} of ${count} purchases`

  if (size === "l") {
    const cells = [...Array.from({ length: count }, (_, index) => index < done), complete]
    const rows = Array.from({ length: Math.ceil(cells.length / PER_ROW) }, (_, row) =>
      cells.slice(row * PER_ROW, row * PER_ROW + PER_ROW),
    )

    return (
      <View accessible accessibilityLabel={label} className="gap-[18px]">
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between">
            {Array.from({ length: PER_ROW }, (_, column) => {
              const index = rowIndex * PER_ROW + column
              if (column >= row.length) return <View key={column} className="h-[52px] w-[52px]" />
              const isFree = index === cells.length - 1
              const on = row[column]
              if (isFree)
                return (
                  <View
                    key={column}
                    className={`h-[52px] w-[52px] items-center justify-center rounded-full border-[2.5px] border-rose ${
                      on ? "bg-rose" : "border-dashed"
                    }`}
                  >
                    <Ionicons name="gift-outline" size={22} color={on ? colors.white : colors.rose} />
                  </View>
                )
              return (
                <View
                  key={column}
                  className={`h-[52px] w-[52px] items-center justify-center rounded-full ${on ? "bg-ink" : "bg-sunk"}`}
                >
                  {on && <Ionicons name="checkmark" size={22} color={colors.white} />}
                </View>
              )
            })}
          </View>
        ))}
      </View>
    )
  }

  const dot = size === "m" ? "h-4 w-4" : "h-[14px] w-[14px]"

  return (
    <View
      accessible
      accessibilityLabel={label}
      className={`flex-row flex-wrap ${size === "m" ? "gap-[6px]" : "gap-[5px]"}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <View key={index} className={`${dot} rounded-full ${index < done ? "bg-ink" : "bg-sunk"}`} />
      ))}
      <View className={`${dot} rounded-full border-2 border-rose ${complete ? "bg-rose" : "border-dashed"}`} />
    </View>
  )
}
