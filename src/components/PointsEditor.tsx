import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { SegmentedControl } from "@/components/SegmentedControl"
import { OperationType } from "@/types"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"

type Props = {
  isPending: boolean
  onSubmit: (amount: number, operationType: OperationType) => void
}

const QUICK_AMOUNTS = [5, 10, 25, 50]

type Mode = "add" | "subtract"

export const PointsEditor = ({ isPending, onSubmit }: Props) => {
  const [mode, setMode] = useState<Mode>("add")
  const [amount, setAmount] = useState("")

  const value = Number(amount)
  const isValid = Number.isInteger(value) && value > 0

  const submit = () => {
    onSubmit(value, mode)
    setAmount("")
  }

  return (
    <View className="rounded-xl bg-white p-4 shadow-sm">
      <SegmentedControl
        options={[
          { value: "add", label: "Add points" },
          { value: "subtract", label: "Remove points" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <View className="my-3 flex-row">
        {QUICK_AMOUNTS.map((quick) => (
          <Pressable
            key={quick}
            onPress={() => setAmount(String(quick))}
            className={`mr-2 flex-1 rounded-lg py-2 ${amount === String(quick) ? "bg-blue-600" : "bg-gray-100"}`}
          >
            <Text className={`text-center font-semibold ${amount === String(quick) ? "text-white" : "text-gray-700"}`}>
              {quick}
            </Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
        placeholder="Or type an amount"
        className="mb-3 rounded-lg border border-gray-300 px-4 py-3 text-base"
      />
      <ButtonWithIndicator
        title={`${mode === "add" ? "Add" : "Remove"} ${isValid ? `${value} ` : ""}points`}
        variant={mode === "add" ? "success" : "danger"}
        isLoading={isPending}
        disabled={!isValid}
        onPress={submit}
      />
    </View>
  )
}
