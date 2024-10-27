import React, { useCallback } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { useGetRewards } from "@/hooks/useGetRewards"
import { useDeleteReward } from "@/hooks/useDeleteReward"
import { useRouter } from "expo-router"

export default function Rewards() {
  const { rewards, isLoading, error } = useGetRewards()
  const { deleteReward, isPending, error: deleteError } = useDeleteReward()
  const router = useRouter()
  const handleDelete = (rewardId) => {
    Alert.alert(
      "Delete Reward",
      "Are you sure you want to delete this reward?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteReward({ rewardId }),
        },
      ],
      { cancelable: true },
    )
  }

  const handleEdit = ({ rewardId, type }) => {
    router.push({ pathname: "/admin/upsert", params: { rewardId, type } })
  }
  const renderRewardDetails = (reward) => {
    switch (reward.type) {
      case "BUY_N_GET_1":
        return <Text className="text-sm text-gray-600">Buy {reward.config.required_purchases} and get 1 free</Text>
      case "DISCOUNT_PERCENTAGE":
        return <Text className="text-sm text-gray-600">{reward.config.discount_percentage}% off</Text>
      case "DISCOUNT_FIX":
        return <Text className="text-sm text-gray-600">${reward.config.discount_amount} off</Text>
      case "FREE_ITEM":
        return <Text className="text-sm text-gray-600">Free {reward.config.item_name}</Text>
      case "FREE_ITEM_WITH_PURCHASE":
        return (
          <Text className="text-sm text-gray-600">
            Free {reward.config.free_item_name} with purchase of {reward.config.item_name}
          </Text>
        )
      default:
        return null
    }
  }

  const renderItem = useCallback(
    ({ item }) => (
      <View className="mb-4 flex-row items-center justify-between rounded-lg bg-white p-4 shadow">
        <View className="flex-1 flex-row items-center">
          <View className="mr-4">
            {/* Icon based on reward type */}
            <Ionicons
              name={
                item.type === "DISCOUNT_PERCENTAGE" || item.type === "DISCOUNT_FIX"
                  ? "pricetag-outline"
                  : item.type === "BUY_N_GET_1"
                    ? "cart-outline"
                    : "gift-outline"
              }
              size={32}
              color="#4B5563"
            />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
            {renderRewardDetails(item)}
            <Text className="mt-1 text-sm font-medium text-blue-600">{item.config?.points_needed_value} pts</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)} className="ml-4" disabled={isPending}>
          {isPending ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleEdit({ rewardId: item.id, type: item.type })}
          className="ml-4"
          disabled={isPending}
        >
          <Ionicons name="eyedrop-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    ),
    [isPending],
  )

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-2 text-lg text-gray-700">Loading Rewards...</Text>
      </View>
    )
  }

  if (error || deleteError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 px-4">
        <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
        <Text className="mt-2 text-lg text-gray-700">Something went wrong.</Text>
        <Text className="text-sm text-gray-500">Please try again later or contact support.</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="mb-4 text-2xl font-bold text-gray-800">Your Rewards</Text>
      {rewards.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="gift-outline" size={64} color="#9CA3AF" />
          <Text className="mt-2 text-lg text-gray-500">No rewards available.</Text>
        </View>
      ) : (
        <FlashList
          data={rewards}
          renderItem={renderItem}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  )
}
