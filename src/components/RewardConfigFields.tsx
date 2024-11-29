import React from "react"
import { FormField } from "./RewardFormField"
import {
  BuyNGet1Config,
  DiscountFixConfig,
  DiscountPercentageConfig,
  FreeItemConfig,
  FreeItemWithPurchaseConfig,
  Reward,
  REWARD_TYPES,
} from "@/types"
import { CapturePhoto } from "./CapturePhoto"

type FormDataProps = Omit<Reward, "storeId" | "status"> & { image?: string | null }

type SetFormDataFunction = (updater: (prev: FormDataProps) => FormDataProps) => void
type Props = {
  type: REWARD_TYPES
  formData: FormDataProps
  setFormData: SetFormDataFunction
}

export const RewardConfigFields = ({ type, formData, setFormData }: Props) => {
  switch (type) {
    case REWARD_TYPES.BUY_N_GET_1:
      return (
        <>
          <FormField
            label="Required Purchases"
            value={(formData.config as BuyNGet1Config).required_purchases?.toString()}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                config: { ...prev.config, required_purchases: Number(value) },
              }))
            }
            keyboardType="numeric"
          />
          <CapturePhoto
            image={formData.image}
            setImage={(imagePath: string | null) => {
              setFormData((p) => ({ ...p, image: imagePath }))
            }}
          />
        </>
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
