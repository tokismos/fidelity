import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { PhotoPicker } from "@/components/PhotoPicker"
import { RewardAvailabilityField } from "@/components/RewardAvailabilityField"
import { RewardConfigFields } from "@/components/RewardConfigFields"
import { FormField } from "@/components/RewardFormField"
import { RewardPreviewCard } from "@/components/RewardPreviewCard"
import { REWARD_TYPE_INFO } from "@/constants/rewardTypes"
import { useAddReward } from "@/hooks/useAddReward"
import { useGetReward } from "@/hooks/useGetReward"
import { useUpdateReward } from "@/hooks/useUpdateReward"
import { RewardFormField, RewardFormValues, RewardType } from "@/types"
import { EMPTY_REWARD_FORM, previewReward, rewardToFormValues, validateRewardForm } from "@/utils/rewards"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"

export default function UpsertReward() {
  const { type, rewardId } = useLocalSearchParams<{ type: RewardType; rewardId?: string }>()
  const isEditMode = !!rewardId

  const { data: reward, isLoading, error } = useGetReward({ rewardId })
  const { addReward, isPending: isAdding } = useAddReward()
  const { updateReward, isPending: isUpdating } = useUpdateReward()
  const [values, setValues] = useState<RewardFormValues>(EMPTY_REWARD_FORM)

  useEffect(() => {
    if (reward) setValues(rewardToFormValues(reward))
  }, [reward])

  const setField = (key: RewardFormField | "title" | "description", value: string) =>
    setValues((previous) => ({ ...previous, [key]: value }))

  const submit = () => {
    const problem = validateRewardForm(type, values)
    if (problem) {
      Alert.alert("Check the form", problem)
      return
    }

    const options = {
      onSuccess: () => router.dismissTo("/admin/rewards"),
      onError: (saveError: Error) => Alert.alert("Could not save the reward", saveError.message),
    }

    if (isEditMode) {
      updateReward({ rewardId, type, values }, options)
    } else {
      addReward({ type, values }, options)
    }
  }

  if (!REWARD_TYPE_INFO[type]) return <ErrorView message="Unknown reward type." />
  if (isEditMode && isLoading) return <LoadingView />
  if (error) return <ErrorView message={error.message} />

  const info = REWARD_TYPE_INFO[type]

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{ title: isEditMode ? `Edit ${info.title.toLowerCase()}` : `New ${info.title.toLowerCase()}` }}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <RewardPreviewCard reward={previewReward(type, values)} />
        <Text className="mb-4 text-sm text-gray-600">{info.description}.</Text>

        <View className="rounded-2xl border border-gray-200 bg-white p-4">
          <FormField
            label="Reward name"
            value={values.title}
            onChangeText={(value) => setField("title", value)}
            placeholder="Free coffee"
          />
          <RewardConfigFields type={type} values={values} onChange={setField} />
          <FormField
            label="Description"
            value={values.description}
            onChangeText={(value) => setField("description", value)}
            placeholder="What the customer gets"
            multiline
          />
          <RewardAvailabilityField
            isOneTime={values.is_one_time}
            onChange={(isOneTime) => setValues((previous) => ({ ...previous, is_one_time: isOneTime }))}
          />
          <PhotoPicker
            label="Photo (optional)"
            image={values.image}
            onChange={(image) => setValues((previous) => ({ ...previous, image }))}
          />
        </View>

        <View className="mt-4">
          <ButtonWithIndicator
            title={isEditMode ? "Save changes" : "Create reward"}
            isLoading={isAdding || isUpdating}
            onPress={submit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
