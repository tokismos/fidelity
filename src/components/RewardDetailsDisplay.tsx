import { useIncrementPurchases } from "@/hooks/useIncrementPurchases"
import {
  UserReward,
  REWARD_TYPES,
  BuyNGet1Config,
  DiscountPercentageConfig,
  DiscountFixConfig,
  FreeItemConfig,
  FreeItemWithPurchaseConfig,
} from "@/types"
import React from "react"
import { View, Text, Image, Button } from "react-native"

const isBuyNGet1Config = (reward: UserReward): boolean => reward.type === REWARD_TYPES.BUY_N_GET_1

const isDiscountPercentageConfig = (reward: UserReward): boolean => reward.type === REWARD_TYPES.DISCOUNT_PERCENTAGE

const isDiscountFixConfig = (reward: UserReward): boolean => reward.type === REWARD_TYPES.DISCOUNT_FIX

const isFreeItemConfig = (reward: UserReward): boolean => reward.type === REWARD_TYPES.FREE_ITEM

const isFreeItemWithPurchaseConfig = (reward: UserReward): boolean =>
  reward.type === REWARD_TYPES.FREE_ITEM_WITH_PURCHASE

const BuyNGet1ConfigComponent = ({ reward }: { reward: UserReward }) => {
  const { incrementPurchase } = useIncrementPurchases({ userRewardId: reward.id })

  return (
    <View className="space-y-2">
      <Text className="text-sm text-gray-600">
        Buy {(reward.config as BuyNGet1Config).required_purchases} items and get 1 free
      </Text>

      <Text className="text-sm text-gray-600">Points needed: {reward.config.points_needed_value}</Text>
      <Text className="text-sm text-gray-600">YOU HAVE {reward.config.nbr_of_purchases}</Text>
      <Button title="Increment " onPress={incrementPurchase} />
    </View>
  )
}
const DiscountPercentageConfigComponent = ({ reward }: { reward: UserReward }) => (
  <View className="space-y-2">
    <Text className="text-sm text-gray-600">
      {(reward.config as DiscountPercentageConfig).discount_percentage}% off your purchase
    </Text>
    <Text className="text-sm text-gray-600">Points needed: {reward.config.points_needed_value}</Text>
  </View>
)

const DiscountFixConfigComponent = ({ reward }: { reward: UserReward }) => (
  <View className="space-y-2">
    <Text className="text-sm text-gray-600">
      ${(reward.config as DiscountFixConfig).discount_amount} off your purchase
    </Text>
    <Text className="text-sm text-gray-600">Points needed: {reward.config.points_needed_value}</Text>
  </View>
)

const FreeItemConfigComponent = ({ reward }: { reward: UserReward }) => (
  <View className="space-y-2">
    <Text className="text-sm text-gray-600">Free {(reward.config as FreeItemConfig).item_name}</Text>
    <Text className="text-sm text-gray-600">Points needed: {reward.config.points_needed_value}</Text>
  </View>
)

const FreeItemWithPurchaseConfigComponent = ({ reward }: { reward: UserReward }) => (
  <View className="space-y-2">
    <Text className="text-sm text-gray-600">
      Free {(reward.config as FreeItemWithPurchaseConfig).free_item_name} with purchase of
      {(reward.config as FreeItemWithPurchaseConfig).item_name}
    </Text>
    <Text className="text-sm text-gray-600">Points needed: {reward.config.points_needed_value}</Text>
  </View>
)

export const RewardDetailsDisplay = ({ reward }: { reward: UserReward }) => {
  const renderConfig = () => {
    if (isBuyNGet1Config(reward)) {
      return <BuyNGet1ConfigComponent reward={reward} />
    }
    if (isDiscountPercentageConfig(reward)) {
      return <DiscountPercentageConfigComponent reward={reward} />
    }
    if (isDiscountFixConfig(reward)) {
      return <DiscountFixConfigComponent reward={reward} />
    }
    if (isFreeItemConfig(reward)) {
      return <FreeItemConfigComponent reward={reward} />
    }
    if (isFreeItemWithPurchaseConfig(reward)) {
      return <FreeItemWithPurchaseConfigComponent reward={reward} />
    }
    return null
  }

  return (
    <View className="w-full rounded-lg bg-white p-4 shadow">
      <View className="flex-row items-center justify-between border-b border-gray-200 pb-2">
        <Text className="text-lg font-bold">{reward.title}</Text>
        <Text className="text-sm text-gray-600">{reward.type}</Text>
      </View>

      <View className="pt-4">
        <Text className="mb-4 text-sm text-gray-500">{reward.description}</Text>
        {reward.config.image_path && (
          <View className="mb-4">
            <Image source={{ uri: reward.config.image_path }} className="h-32 w-full rounded-md" resizeMode="cover" />
          </View>
        )}
        {renderConfig()}
      </View>
    </View>
  )
}
