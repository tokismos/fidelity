import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { DateTimeField } from "@/components/DateTimeField"
import { SegmentedControl } from "@/components/SegmentedControl"
import { useState } from "react"
import { Alert, Pressable, Text, View } from "react-native"

type Duration = "1h" | "2h" | "4h" | "midnight" | "custom"

type Props = {
  isPending: boolean
  // True while another promotion is running, the new one can only be scheduled after it
  hasRunningPromotion: boolean
  onSubmit: (promotion: { multiplier: number; startsAt: Date; endsAt: Date }) => void
}

const DURATIONS: { value: Duration; label: string }[] = [
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "4h", label: "4 hours" },
  { value: "midnight", label: "Until midnight" },
  { value: "custom", label: "Pick an end" },
]

const HOUR = 60 * 60 * 1000

const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * HOUR)

const nextMidnight = (date: Date) => {
  const midnight = new Date(date)
  midnight.setHours(24, 0, 0, 0)
  return midnight
}

const endFor = (duration: Duration, start: Date, customEnd: Date) => {
  switch (duration) {
    case "1h":
      return addHours(start, 1)
    case "2h":
      return addHours(start, 2)
    case "4h":
      return addHours(start, 4)
    case "midnight":
      return nextMidnight(start)
    case "custom":
      return customEnd
  }
}

export const PromotionForm = ({ isPending, hasRunningPromotion, onSubmit }: Props) => {
  const [multiplier, setMultiplier] = useState<"2" | "3">("2")
  const [startMode, setStartMode] = useState<"now" | "later">(hasRunningPromotion ? "later" : "now")
  const [startDate, setStartDate] = useState(() => addHours(new Date(), 1))
  const [duration, setDuration] = useState<Duration>("2h")
  const [customEnd, setCustomEnd] = useState(() => addHours(new Date(), 3))

  const submit = () => {
    const startsAt = startMode === "now" ? new Date() : startDate
    const endsAt = endFor(duration, startsAt, customEnd)

    if (endsAt <= startsAt) {
      Alert.alert("Check the dates", "The end must be after the start.")
      return
    }

    onSubmit({ multiplier: Number(multiplier), startsAt, endsAt })
  }

  return (
    <View className="rounded-2xl border border-gray-200 bg-white p-4">
      <Text className="mb-1 text-sm font-semibold text-gray-700">Multiplier</Text>
      <SegmentedControl
        options={[
          { value: "2", label: "x2 double" },
          { value: "3", label: "x3 triple" },
        ]}
        value={multiplier}
        onChange={setMultiplier}
      />

      <Text className="mb-1 mt-4 text-sm font-semibold text-gray-700">Start</Text>
      <SegmentedControl
        options={[
          { value: "now", label: "Now" },
          { value: "later", label: "Schedule" },
        ]}
        value={startMode}
        onChange={setStartMode}
      />
      {startMode === "later" && (
        <View className="mt-3">
          <DateTimeField label="Starts" value={startDate} minimumDate={new Date()} onChange={setStartDate} />
        </View>
      )}
      {startMode === "now" && hasRunningPromotion && (
        <Text className="mt-2 text-xs text-amber-800">
          A promotion is already running. Promotions cannot overlap, so this one will be refused.
        </Text>
      )}

      <Text className="mb-2 mt-4 text-sm font-semibold text-gray-700">Duration</Text>
      <View className="flex-row flex-wrap">
        {DURATIONS.map((option) => {
          const isSelected = duration === option.value
          return (
            <Pressable
              key={option.value}
              onPress={() => setDuration(option.value)}
              className={`mb-2 mr-2 rounded-full px-4 py-2 ${
                isSelected ? "bg-gray-900" : "border border-gray-200 bg-white"
              }`}
            >
              <Text className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-700"}`}>
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
      {duration === "custom" && (
        <DateTimeField label="Ends" value={customEnd} minimumDate={new Date()} onChange={setCustomEnd} />
      )}

      <View className="mt-3">
        <ButtonWithIndicator
          title={startMode === "now" ? "Start promotion" : "Schedule promotion"}
          isLoading={isPending}
          onPress={submit}
        />
      </View>
    </View>
  )
}
