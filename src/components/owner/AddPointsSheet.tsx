import { AmountPicker } from "@/components/ui/AmountPicker"
import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { Chip } from "@/components/ui/Chip"
import { Field } from "@/components/ui/Field"
import { Sheet } from "@/components/ui/Sheet"
import { useEffect, useState } from "react"
import { View } from "react-native"

type Props = {
  visible: boolean
  onClose: () => void
  // remove: the same sheet from the menu, with no multiplier
  mode: "add" | "remove"
  // Points multiplier of the running promotion, 1 when there is none
  multiplier: number
  // The customer's points, the most that can be removed
  points: number
  isPending: boolean
  // The amount the owner picked, before any multiplier
  onSubmit: (amount: number) => void
}

const QUICK_AMOUNTS = [5, 10, 25, 50]

const MULTIPLIER_NAMES: Record<number, { chip: string; word: string }> = {
  2: { chip: "Double", word: "doubled" },
  3: { chip: "Triple", word: "tripled" },
}

const pointsWord = (amount: number) => (amount === 1 ? "point" : "points")

export const AddPointsSheet = ({ visible, onClose, mode, multiplier, points, isPending, onSubmit }: Props) => {
  const [picked, setPicked] = useState<number | null>(null)
  const [isOther, setIsOther] = useState(false)
  const [otherText, setOtherText] = useState("")

  // Every time the sheet opens it starts empty
  useEffect(() => {
    if (!visible) return
    setPicked(null)
    setIsOther(false)
    setOtherText("")
  }, [visible])

  const typed = Number(otherText)
  const amount = isOther ? (Number.isInteger(typed) && typed > 0 ? typed : null) : picked
  const isAdd = mode === "add"
  const boost = isAdd && multiplier > 1 ? MULTIPLIER_NAMES[multiplier] : undefined
  const total = amount === null ? null : isAdd ? amount * multiplier : amount
  const tooMany = !isAdd && amount !== null && amount > points

  const title = isAdd ? "Add points" : "Remove points"
  const verb = isAdd ? "Add" : "Remove"
  const buttonTitle = total === null ? title : `${verb} ${total} ${pointsWord(total)}`

  return (
    <Sheet visible={visible} onClose={onClose} title={title}>
      <View className="mt-[2px]">
        <AmountPicker
          amounts={QUICK_AMOUNTS}
          // Any value outside the quick amounts lights up "Other"
          value={isOther ? -1 : picked}
          onChange={(value) => {
            setIsOther(false)
            setPicked(value)
          }}
          onOther={() => setIsOther(true)}
        />
      </View>

      {isOther && (
        <View className="mt-4">
          <Field
            label="Points"
            value={otherText}
            onChangeText={(text) => setOtherText(text.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            returnKeyType="done"
            placeholder="0"
            autoFocus
          />
        </View>
      )}

      {total !== null && (
        <View className="mx-1 mt-[26px]">
          <View className="flex-row items-baseline">
            <AppText weight="black" tabular className="text-[46px] leading-[48px] tracking-[-1.5px]">
              {total}
            </AppText>
            <AppText weight="bold" className="ml-[6px] text-[20px]">
              {pointsWord(total)}
            </AppText>
          </View>
          {boost && (
            <View className="mt-2 flex-row items-center gap-2">
              <Chip label={boost.chip} tone="sun" icon="flash-outline" />
              <AppText className="text-ink-2">
                {amount} {boost.word} today
              </AppText>
            </View>
          )}
          {tooMany && (
            <AppText className="mt-2 text-ink-2">
              The card has {points} {pointsWord(points)}.
            </AppText>
          )}
        </View>
      )}

      <View className="mt-[26px]">
        <Button
          title={buttonTitle}
          onPress={() => amount !== null && onSubmit(amount)}
          disabled={amount === null || tooMany}
          isLoading={isPending}
        />
      </View>
    </Sheet>
  )
}
