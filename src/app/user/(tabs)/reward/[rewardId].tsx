import React from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import {
  BuyNGet1Config,
  DiscountFixConfig,
  DiscountPercentageConfig,
  FreeItemConfig,
  FreeItemWithPurchaseConfig,
  Reward,
  REWARD_TYPES,
} from "@/types"
import { useGetRewardById } from "@/hooks/useGetRewardById"

export default function RewardDetails() {
  const { rewardId } = useLocalSearchParams<{ rewardId: string }>()

  const { rewardById, isLoading, error } = useGetRewardById({ rewardId })

  const renderRewardValue = (reward: Reward) => {
    switch (reward.type) {
      case REWARD_TYPES.BUY_N_GET_1:
        return `Buy ${(reward.config as BuyNGet1Config).required_purchases} and get 1 free`
      case REWARD_TYPES.DISCOUNT_PERCENTAGE:
        return `${(reward.config as DiscountPercentageConfig).discount_percentage}% off`
      case REWARD_TYPES.DISCOUNT_FIX:
        return `$${(reward.config as DiscountFixConfig).discount_amount} off`
      case REWARD_TYPES.FREE_ITEM:
        return `Free ${(reward.config as FreeItemConfig).item_name}`
      case REWARD_TYPES.FREE_ITEM_WITH_PURCHASE:
        const config = reward.config as FreeItemWithPurchaseConfig
        return `Free ${config.free_item_name} with purchase of ${config.item_name}`
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    )
  }

  console.log("rewardByIdrewardById", rewardById)

  if (error || !rewardById) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 px-4">
        <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
        <Text className="mt-2 text-lg text-gray-700">Something went wrong.</Text>
        <Text className="text-sm text-gray-500">Please try again later.</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className=" p-4">
        <View className="rounded-lg bg-white p-4 shadow">
          <View className="mb-4 items-center">
            {rewardById.config.image_path ? (
              <Image source={{ uri: rewardById.config.image_path }} className="h-24 w-24" />
            ) : (
              <View className="mb-2 rounded-full bg-blue-100 p-4">
                <Ionicons
                  name={
                    rewardById.type === "DISCOUNT_PERCENTAGE" || rewardById.type === "DISCOUNT_FIX"
                      ? "pricetag"
                      : rewardById.type === "BUY_N_GET_1"
                        ? "cart"
                        : "gift"
                  }
                  size={48}
                  color="#2563EB"
                />
              </View>
            )}
          </View>

          <Text className="mb-2 text-center text-2xl font-bold text-gray-900">{rewardById.title}</Text>

          <Text className="mb-4 text-center text-lg font-medium text-blue-600">{renderRewardValue(rewardById)}</Text>

          <View className="mb-4 flex-row items-center justify-center">
            <Ionicons name="star" size={20} color="#EAB308" />
            <Text className="ml-1 text-lg font-medium text-gray-700">
              {rewardById.config.points_needed_value} points needed
            </Text>
          </View>

          {rewardById.description && (
            <View className="border-t border-gray-200 pt-4">
              <Text className="text-base text-gray-600">{rewardById.description}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
