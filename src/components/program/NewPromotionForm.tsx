import { DateTimeField } from "@/components/DateTimeField"
import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { Segmented } from "@/components/ui/Segmented"
import { colors } from "@/constants/colors"
import { useAddPromotion } from "@/hooks/useAddPromotion"
import { nextMidnight } from "@/utils/program"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { Alert, View } from "react-native"

type Duration = "1h" | "2h" | "4h" | "midnight"

type Props = {
  storeId: string
  timeZone: string
  // When a promotion is running: its end. The new one can only start later.
  busyUntil: Date | null
  onDone: () => void
}

const DURATIONS: { value: Duration; label: string }[] = [
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "4h", label: "4 hours" },
  { value: "midnight", label: "Until midnight" },
]

const HOUR = 60 * 60 * 1000

const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * HOUR)

const endFor = (duration: Duration, start: Date, timeZone: string) => {
  switch (duration) {
    case "1h":
      return addHours(start, 1)
    case "2h":
      return addHours(start, 2)
    case "4h":
      return addHours(start, 4)
    case "midnight":
      return nextMidnight(start, timeZone)
  }
}

// In an hour, or when the running promotion ends if that is later
const defaultStart = (busyUntil: Date | null) => {
  const inAnHour = addHours(new Date(), 1)
  return busyUntil && busyUntil > inAnHour ? busyUntil : inAnHour
}

// The content of the new promotion sheet: double or triple, when it starts, how long it lasts
export const NewPromotionForm = ({ storeId, timeZone, busyUntil, onDone }: Props) => {
  const { addPromotion, isPending } = useAddPromotion()
  const isRunning = !!busyUntil
  const [multiplier, setMultiplier] = useState<"2" | "3">("2")
  const [startMode, setStartMode] = useState<"now" | "later">(isRunning ? "later" : "now")
  const [startDate, setStartDate] = useState(() => defaultStart(busyUntil))
  const [duration, setDuration] = useState<Duration>("2h")
  const [isChoosingDuration, setIsChoosingDuration] = useState(false)

  const submit = () => {
    const startsAt = startMode === "now" ? new Date() : startDate
    const endsAt = endFor(duration, startsAt, timeZone)

    if (endsAt <= startsAt) {
      Alert.alert("Check the dates", "The end must be after the start.")
      return
    }

    addPromotion(
      { storeId, multiplier: Number(multiplier), startsAt, endsAt },
      {
        onSuccess: onDone,
        onError: (error) =>
          Alert.alert(
            "Could not save the promotion",
            error.message.includes("promotions_no_overlap") ? "It overlaps with another promotion." : error.message,
          ),
      },
    )
  }

  const durationLabel = DURATIONS.find((option) => option.value === duration)?.label ?? ""

  return (
    <View>
      <View className="mb-3">
        <Segmented
          options={[
            { value: "2", label: "Double" },
            { value: "3", label: "Triple" },
          ]}
          value={multiplier}
          onChange={setMultiplier}
        />
      </View>
      <View className="mb-3">
        <Segmented
          options={[
            { value: "now", label: "Start now" },
            { value: "later", label: "Later" },
          ]}
          value={startMode}
          onChange={(mode) => setStartMode(isRunning ? "later" : mode)}
        />
        {isRunning && (
          <AppText className="mx-1 mt-2 text-[13px] text-ink-2">One is running now, so this one starts later.</AppText>
        )}
      </View>
      <ListCard>
        {startMode === "later" && (
          <DateTimeField label="Starts" value={startDate} minimumDate={new Date()} onChange={setStartDate} />
        )}
        <ListRow
          title="Lasts"
          subtitle={durationLabel}
          showChevron
          onPress={() => setIsChoosingDuration((open) => !open)}
        />
        {isChoosingDuration &&
          DURATIONS.map((option) => (
            <ListRow
              key={option.value}
              title={option.label}
              trailing={
                option.value === duration ? <Ionicons name="checkmark" size={22} color={colors.ink} /> : undefined
              }
              onPress={() => {
                setDuration(option.value)
                setIsChoosingDuration(false)
              }}
            />
          ))}
      </ListCard>
      <Button
        title={startMode === "now" ? "Start promotion" : "Plan promotion"}
        isLoading={isPending}
        onPress={submit}
        className="mt-5"
      />
    </View>
  )
}
