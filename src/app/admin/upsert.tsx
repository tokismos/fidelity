import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { RewardConfigFields } from "@/components/RewardConfigFields"
import { FormField } from "@/components/RewardFormField"
import { useGetRewardById } from "@/hooks/useGetRewardById"
import { useRewardSubmit } from "@/hooks/useRewardSubmit"
import { Reward, REWARD_TYPES } from "@/types"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, ScrollView } from "react-native"

type FormDataProps = Omit<Reward, "storeId"> & { image?: string | null }

export default function UpsertRewardScreen() {
  const { type, rewardId } = useLocalSearchParams<{ type: REWARD_TYPES; rewardId: string }>()
  const { rewardById, error } = useGetRewardById({ rewardId })

  const [formData, setFormData] = useState<FormDataProps>({
    title: "",
    description: "",
    type,
    config: {},
    image: null,
  })

  const { submitReward, isLoading, isEditMode } = useRewardSubmit({ rewardId })

  useEffect(() => {
    if (rewardById) {
      setFormData(rewardById)
    }
  }, [rewardById])

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="mb-6 text-2xl font-bold">Create New Reward</Text>

      <View className="rounded-lg bg-white p-4 shadow-sm">
        <FormField
          label="Reward Name"
          value={formData.title}
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
          isLoading={isLoading}
          onPress={() => submitReward(formData)}
        />
      </View>
    </ScrollView>
  )
}
