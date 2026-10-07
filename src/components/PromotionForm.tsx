import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { DateTimeField } from "@/components/DateTimeField"
import { SegmentedControl } from "@/components/SegmentedControl"
import { useState } from "react"
import { Alert, Pressable, Text, View } from "react-native"

type Duration = "1h" | "2h" | "4h" | "midnight" | "custom"

type Props = {
  isPending: boolean
  onSubmit: (promotion: { multiplier: number; startsAt: Date; endsAt: Date }) => void
}

const DURATIONS: { value: Duration; label: string }[] = [
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "4h", label: "4 hours" },
  { value: "midnight", label: "Until midnight" },
  { value: "custom", label: "Pick end" },
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

export const PromotionForm = ({ isPending, onSubmit }: Props) => {
  const [multiplier, setMultiplier] = useState<"2" | "3">("2")
  const [startMode, setStartMode] = useState<"now" | "later">("now")
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
    <View className="rounded-xl bg-white p-4 shadow-sm">
      <Text className="mb-1 text-sm font-semibold text-gray-700">Points multiplier</Text>
      <SegmentedControl
        options={[
          { value: "2", label: "Double (x2)" },
          { value: "3", label: "Triple (x3)" },
        ]}
        value={multiplier}
        onChange={setMultiplier}
      />

      <Text className="mb-1 mt-4 text-sm font-semibold text-gray-700">Start</Text>
      <SegmentedControl
        options={[
          { value: "now", label: "Now" },
          { value: "later", label: "Later" },
        ]}
        value={startMode}
        onChange={setStartMode}
      />
      {startMode === "later" && (
        <View className="mt-3">
          <DateTimeField label="Starts" value={startDate} minimumDate={new Date()} onChange={setStartDate} />
        </View>
      )}

      <Text className="mb-2 mt-4 text-sm font-semibold text-gray-700">Duration</Text>
      <View className="flex-row flex-wrap">
        {DURATIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => setDuration(option.value)}
            className={`mb-2 mr-2 rounded-full px-4 py-2 ${duration === option.value ? "bg-blue-600" : "bg-gray-100"}`}
          >
            <Text className={duration === option.value ? "font-semibold text-white" : "text-gray-700"}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {duration === "custom" && (
        <DateTimeField label="Ends" value={customEnd} minimumDate={new Date()} onChange={setCustomEnd} />
      )}

      <View className="mt-3">
        <ButtonWithIndicator title="Start promotion" isLoading={isPending} onPress={submit} />
      </View>
    </View>
  )
}
