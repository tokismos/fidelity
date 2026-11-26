import { StepperRow } from "@/components/program/StepperRow"
import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { Segmented } from "@/components/ui/Segmented"
import { colors } from "@/constants/colors"
import { useAddWheelSlice } from "@/hooks/useAddWheelSlice"
import { useDeleteWheelSlice } from "@/hooks/useDeleteWheelSlice"
import { useGetRewards } from "@/hooks/useGetRewards"
import { useUpdateWheelSlice } from "@/hooks/useUpdateWheelSlice"
import { WheelSlice } from "@/types"
import { sliceName } from "@/utils/program"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { Alert, View } from "react-native"

type Props = {
  storeId: string
  // The slice to edit, null to add a new one
  slice: WheelSlice | null
  onDone: () => void
}

type Kind = "points" | "reward"

const showError = (error: Error) => Alert.alert("Something went wrong", error.message)

const kindOf = (slice: WheelSlice | null): Kind => (slice && slice.points === null ? "reward" : "points")

const initialForm = (slice: WheelSlice | null) => ({
  kind: kindOf(slice),
  points: slice?.points ?? 10,
  rewardId: slice?.reward_id ?? "",
  weight: slice?.weight ?? 10,
  weeklyLimit: slice?.weekly_limit ?? 0,
})

// The content of the slice sheet. It keeps what was typed when saving fails.
export const SliceForm = ({ storeId, slice, onDone }: Props) => {
  const rewards = useGetRewards({ storeId, activeOnly: true })
  const { addWheelSlice, isPending: isAdding } = useAddWheelSlice()
  const { updateWheelSlice, isPending: isUpdating } = useUpdateWheelSlice()
  const { deleteWheelSlice, isPending: isDeleting } = useDeleteWheelSlice()
  const [formData, setFormData] = useState(() => initialForm(slice))
  const update = (changes: Partial<typeof formData>) => setFormData((current) => ({ ...current, ...changes }))

  const submit = () => {
    const { kind, points, rewardId, weight, weeklyLimit } = formData

    if (kind === "points" && !(points > 0)) return Alert.alert("Check the slice", "Points must be above 0.")
    if (kind === "reward" && !rewardId) return Alert.alert("Check the slice", "Pick a reward.")
    if (!(weight >= 0 && weight <= 1000)) return Alert.alert("Check the slice", "Chance must be from 0 to 1000.")

    const values = {
      points: kind === "points" ? points : null,
      rewardId: kind === "reward" ? rewardId : null,
      weight,
      weeklyLimit: weeklyLimit > 0 ? weeklyLimit : null,
    }
    const options = { onSuccess: onDone, onError: showError }

    if (slice) updateWheelSlice({ sliceId: slice.id, ...values }, options)
    else addWheelSlice({ storeId, ...values }, options)
  }

  const confirmRemove = () => {
    if (!slice) return
    Alert.alert("Remove slice", `Remove "${sliceName(slice)}" from the wheel?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => deleteWheelSlice({ sliceId: slice.id }, { onSuccess: onDone, onError: showError }),
      },
    ])
  }

  const activeRewards = rewards.data ?? []

  return (
    <View>
      <View className="mb-3">
        <Segmented
          options={[
            { value: "points", label: "Points" },
            { value: "reward", label: "A reward" },
          ]}
          value={formData.kind}
          onChange={(kind) => update({ kind })}
        />
      </View>

      {formData.kind === "reward" &&
        !rewards.isLoading &&
        (activeRewards.length === 0 ? (
          <AppText className="mx-1 mb-3 text-ink-2">Create a reward first.</AppText>
        ) : (
          <ListCard className="mb-3">
            {activeRewards.map((reward) => (
              <ListRow
                key={reward.id}
                title={reward.title}
                trailing={
                  reward.id === formData.rewardId ? (
                    <Ionicons name="checkmark" size={22} color={colors.ink} />
                  ) : undefined
                }
                onPress={() => update({ rewardId: reward.id })}
              />
            ))}
          </ListCard>
        ))}

      <ListCard>
        {formData.kind === "points" && (
          <StepperRow
            title="Points"
            value={formData.points}
            onChange={(points) => update({ points })}
            step={5}
            min={1}
          />
        )}
        <StepperRow
          title="Chance"
          hint="Higher comes up more often. 0 shows it but it never wins."
          value={formData.weight}
          onChange={(weight) => update({ weight })}
          step={5}
          max={1000}
        />
        <StepperRow
          title="At most per week"
          hint="0 means no limit"
          value={formData.weeklyLimit}
          onChange={(weeklyLimit) => update({ weeklyLimit })}
        />
      </ListCard>

      <View className="mt-5 gap-[10px]">
        <Button title={slice ? "Save" : "Add slice"} isLoading={isAdding || isUpdating} onPress={submit} />
        {slice && <Button title="Remove" variant="danger" isLoading={isDeleting} onPress={confirmRemove} />}
      </View>
    </View>
  )
}
