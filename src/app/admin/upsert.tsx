import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { useAddReward } from "@/hooks/useAddReward"
import { useGetRewardById } from "@/hooks/useGetRewardById"
import { useUpdateReward } from "@/hooks/useUpdateReward"
import {
  BuyNGet1Config,
  DiscountFixConfig,
  DiscountPercentageConfig,
  FreeItemConfig,
  FreeItemWithPurchaseConfig,
  Reward,
  REWARD_TYPES,
} from "@/types"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, ScrollView, TextInput, TextInputProps } from "react-native"

const FormField = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  defaultValue,
}: TextInputProps & { label: string }) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
    <TextInput
      value={value}
      defaultValue={defaultValue}
      onChangeText={onChangeText}
      className="rounded-md border border-gray-300 p-2"
      keyboardType={keyboardType}
    />
  </View>
)

type FormDataProps<T extends REWARD_TYPES> = Omit<Reward<T>, "storeId" | "status">

export default function UpsertRewardScreen() {
  const { type, rewardId } = useLocalSearchParams<{ type: REWARD_TYPES; rewardId: string }>()
  const { rewardById, isLoading, error } = useGetRewardById({ rewardId })

  const isEditMode = Boolean(rewardId)
  const [formData, setFormData] = useState<FormDataProps<typeof type>>({
    title: "",
    description: "",
    type,
    config: {},
  })

  const { addReward, isPending } = useAddReward()
  const { updateReward, isPending: updateIsPending } = useUpdateReward({ rewardId })

  useEffect(() => {
    if (rewardById) {
      setFormData(rewardById)
    }
  }, [rewardById])

  const renderConfigFields = () => {
    switch (type) {
      case REWARD_TYPES.BUY_N_GET_1:
        return (
          <FormField
            label="Required Purchases"
            value={(formData.config as BuyNGet1Config).required_purchases?.toString()}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                config: { required_purchases: Number(value) },
              }))
            }
            keyboardType="numeric"
          />
        )

      case REWARD_TYPES.DISCOUNT_PERCENTAGE:
        return (
          <>
            <FormField
              label="Discount Percentage"
              value={(formData.config as DiscountPercentageConfig)?.discount_percentage?.toString()}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  config: { ...prev.config, discount_percentage: Number(value) },
                }))
              }
              keyboardType="numeric"
            />
            <FormField
              label="Points Needed"
              value={(formData.config as DiscountPercentageConfig).points_needed_value?.toString()}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  config: { ...prev.config, points_needed_value: Number(value) },
                }))
              }
              keyboardType="numeric"
            />
          </>
        )

      case REWARD_TYPES.DISCOUNT_FIX:
        return (
          <>
            <FormField
              label="Discount Amount"
              value={(formData.config as DiscountFixConfig).discount_amount?.toString()}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  config: { ...prev.config, discount_amount: Number(value) },
                }))
              }
              keyboardType="numeric"
            />
            <FormField
              label="Points Needed"
              value={(formData.config as DiscountFixConfig).points_needed_value?.toString()}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  config: { ...prev.config, points_needed_value: Number(value) },
                }))
              }
              keyboardType="numeric"
            />
          </>
        )

      case REWARD_TYPES.FREE_ITEM:
        return (
          <>
            <FormField
              label="Item Name"
              value={(formData.config as FreeItemConfig).item_name?.toString()}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  config: { ...prev.config, item_name: value },
                }))
              }
            />
            <FormField
              label="Points Needed"
              value={(formData.config as FreeItemConfig).points_needed_value?.toString()}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  config: { ...prev.config, points_needed_value: Number(value) },
                }))
              }
              keyboardType="numeric"
            />
          </>
        )

      case REWARD_TYPES.FREE_ITEM_WITH_PURCHASE:
        return (
          <>
            <FormField
              label="Item to Purchase"
              value={(formData.config as FreeItemWithPurchaseConfig).item_name?.toString()}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  config: { ...prev.config, item_name: value },
                }))
              }
            />
            <FormField
              label="Free Item Name"
              value={(formData.config as FreeItemWithPurchaseConfig).free_item_name?.toString()}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  config: { ...prev.config, free_item_name: value },
                }))
              }
            />
          </>
        )
    }
  }

  const handleSubmit = () => {
    if (isEditMode) {
      updateReward({ updatedReward: formData })
      return
    }
    addReward({ ...formData })
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

        <View className="my-4 h-px bg-gray-200" />

        <Text className="mb-4 text-lg font-semibold">Reward Configuration</Text>
        {renderConfigFields()}

        <ButtonWithIndicator
          title={isEditMode ? "Update reward" : "Create reward"}
          isLoading={isPending || updateIsPending}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  )
}
