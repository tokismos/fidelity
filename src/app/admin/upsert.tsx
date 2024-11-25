import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { CapturePhoto } from "@/components/CapturePhoto"
import { RewardConfigFields } from "@/components/RewardConfigFields"
import { FormField } from "@/components/RewardFormField"
import { useAddReward } from "@/hooks/useAddReward"
import { useGetRewardById } from "@/hooks/useGetRewardById"
import { useUpdateReward } from "@/hooks/useUpdateReward"
import { Reward, REWARD_TYPES } from "@/types"
import { uploadImageToBucket } from "@/utils/uploadImageToBucket"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, ScrollView, TextInput, TextInputProps } from "react-native"

type FormDataProps<T extends REWARD_TYPES> = Omit<Reward<T>, "storeId" | "status"> & { image: string | null }

export default function UpsertRewardScreen() {
  const { type, rewardId } = useLocalSearchParams<{ type: REWARD_TYPES; rewardId: string }>()
  const { rewardById, isLoading, error } = useGetRewardById({ rewardId })

  const isEditMode = Boolean(rewardId)

  const [formData, setFormData] = useState<FormDataProps<typeof type>>({
    title: "",
    description: "",
    type,
    config: {},
    image: null,
  })

  const { addReward, isPending } = useAddReward()
  const { updateReward, isPending: updateIsPending } = useUpdateReward({ rewardId })

  useEffect(() => {
    if (rewardById) {
      setFormData(rewardById)
    }
  }, [rewardById])

  const handleSubmit = async () => {
    try {
      const reward = { ...formData }

      if (formData.image) {
        ;(reward.config as unknown as any).image_path = await uploadImageToBucket(formData.image)
      }

      if (isEditMode) {
        updateReward({ updatedReward: { ...reward } })
        return
      }

      addReward({ ...reward })
    } catch (e) {
      console.log("there is an error ", e)
    }
  }
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="mb-6 text-2xl font-bold">Create New Reward</Text>

      <View className="rounded-lg bg-white p-4 shadow-sm">
        <FormField
          label="Reward Name"
          // defaultValue="BUY N GET 1"
          value={formData.title ?? "BUY N GET 1"}
          onChangeText={(title) => setFormData((prev) => ({ ...prev, title }))}
        />

        <FormField
          label="Description"
          value={formData.description}
          onChangeText={(description) => setFormData((prev) => ({ ...prev, description }))}
        />

        <Text className="mb-4 text-lg font-semibold">Reward Configuration</Text>
        <RewardConfigFields formData={formData} setFormData={setFormData} type={type} />

        <ButtonWithIndicator
          title={isEditMode ? "Update reward" : "Create reward"}
          isLoading={isPending || updateIsPending}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  )
}
