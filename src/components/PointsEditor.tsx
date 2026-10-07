import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { SegmentedControl } from "@/components/SegmentedControl"
import { OperationType } from "@/types"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"

type Props = {
  isPending: boolean
  // Points multiplier of the running promotion, 1 when there is none
  multiplier: number
  onSubmit: (amount: number, operationType: OperationType) => void
}

const QUICK_AMOUNTS = [5, 10, 25, 50]

type Mode = "add" | "subtract"

export const PointsEditor = ({ isPending, multiplier, onSubmit }: Props) => {
  const [mode, setMode] = useState<Mode>("add")
  const [amount, setAmount] = useState("")

  const value = Number(amount)
  const isValid = Number.isInteger(value) && value > 0

  const isBoosted = mode === "add" && multiplier > 1
  const total = isBoosted ? value * multiplier : value
  const buttonTitle =
    mode === "add" ? `Add ${isValid ? `${total} ` : ""}points` : `Remove ${isValid ? `${value} ` : ""}points`

  const submit = () => {
    onSubmit(value, mode)
    setAmount("")
  }

  return (
    <View className="rounded-2xl border border-gray-200 bg-white p-3">
      <SegmentedControl
        options={[
          { value: "add", label: "Add points" },
          { value: "subtract", label: "Remove" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <View className="my-3 flex-row items-center">
        {QUICK_AMOUNTS.map((quick) => {
          const isSelected = amount === String(quick)
          return (
            <Pressable
              key={quick}
              onPress={() => setAmount(String(quick))}
              className={`mr-2 h-11 flex-1 items-center justify-center rounded-xl ${
                isSelected ? "border-2 border-primary-600 bg-primary-50" : "border border-gray-200 bg-white"
              }`}
            >
              <Text className={`font-bold ${isSelected ? "text-primary-700" : "text-gray-900"}`}>{quick}</Text>
            </Pressable>
          )
        })}
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="number-pad"
          placeholder="Other"
          accessibilityLabel="Amount of points"
          className="h-11 flex-[1.4] rounded-xl border border-gray-300 px-2 text-center text-base font-bold"
        />
      </View>
      {isBoosted && (
        <Text className="mb-3 rounded-lg bg-amber-50 p-2 text-center text-sm font-semibold text-amber-800">
          {isValid
            ? `${value} x ${multiplier} promotion = ${total} points will be added`
            : `x${multiplier} promotion running: added points are multiplied`}
        </Text>
      )}
      <ButtonWithIndicator
        title={buttonTitle}
        variant={mode === "add" ? "success" : "danger"}
        isLoading={isPending}
        disabled={!isValid}
        onPress={submit}
      />
    </View>
  )
}
