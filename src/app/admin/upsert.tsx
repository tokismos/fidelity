import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { MoreRewardOptions } from "@/components/program/MoreRewardOptions"
import { RewardTypeFields } from "@/components/program/RewardTypeFields"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { NavBar } from "@/components/ui/NavBar"
import { Screen } from "@/components/ui/Screen"
import { REWARD_FORM_FIELDS, REWARD_TYPE_INFO } from "@/constants/rewardTypes"
import { useAddReward } from "@/hooks/useAddReward"
import { useGetReward } from "@/hooks/useGetReward"
import { useUpdateReward } from "@/hooks/useUpdateReward"
import { RewardFormField, RewardFormValues, RewardType } from "@/types"
import { EMPTY_REWARD_FORM, rewardToFormValues, validateRewardForm, withDefaultDescription } from "@/utils/rewards"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, KeyboardAvoidingView, Platform } from "react-native"

// A new reward starts with a usual value in each stepper, e.g. 100 points
const newRewardForm = (type: RewardType): RewardFormValues => {
  const fields = REWARD_FORM_FIELDS[type] ?? []
  const steppers = Object.fromEntries(
    fields.filter((field) => field.step).map((field) => [field.key, field.placeholder]),
  )
  return { ...EMPTY_REWARD_FORM, ...steppers }
}

export default function UpsertReward() {
  const { type, rewardId } = useLocalSearchParams<{ type: RewardType; rewardId?: string }>()
  const isEditMode = !!rewardId

  const { data: reward, isLoading, error } = useGetReward({ rewardId })
  const { addReward, isPending: isAdding } = useAddReward()
  const { updateReward, isPending: isUpdating } = useUpdateReward()
  const [values, setValues] = useState<RewardFormValues>(() => newRewardForm(type))

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

    const saved = withDefaultDescription(type, values)
    const options = {
      onSuccess: () => router.dismissTo("/admin/program"),
      onError: (saveError: Error) => Alert.alert("Could not save the reward", saveError.message),
    }

    if (isEditMode) {
      updateReward({ rewardId, type, values: saved }, options)
    } else {
      addReward({ type, values: saved }, options)
    }
  }

  if (!REWARD_TYPE_INFO[type]) return <ErrorView message="Unknown reward type." />
  if (isEditMode && isLoading) return <LoadingView />
  if (error) return <ErrorView message={error.message} />

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-ground">
      <NavBar
        title={isEditMode ? "Edit reward" : REWARD_TYPE_INFO[type].title}
        backIcon={isEditMode ? "close" : "chevron-back"}
        inset="modal"
      />
      <Screen
        scroll
        edges={["bottom"]}
        contentClassName="gap-4 px-4 pt-2"
        footer={
          <Button
            title={isEditMode ? "Save changes" : "Create reward"}
            isLoading={isAdding || isUpdating}
            onPress={submit}
          />
        }
      >
        <Field
          label="Reward name"
          value={values.title}
          onChangeText={(value) => setField("title", value)}
          placeholder="Free coffee"
          autoCapitalize="sentences"
        />
        <RewardTypeFields type={type} values={values} onChange={setField} />
        <MoreRewardOptions
          values={values}
          onDescriptionChange={(value) => setField("description", value)}
          onImageChange={(image) => setValues((previous) => ({ ...previous, image }))}
          onOneTimeChange={(isOneTime) => setValues((previous) => ({ ...previous, is_one_time: isOneTime }))}
        />
      </Screen>
    </KeyboardAvoidingView>
  )
}
