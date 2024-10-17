import { useGetRewards } from "@/hooks/useGetRewards"
import { FlashList } from "@shopify/flash-list"
import { useCallback } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useDeleteReward } from "@/hooks/useDeleteReward"

export default function Rewards() {
  const { rewards, isLoading, error } = useGetRewards()
  const { deleteReward, isPending, error: deleteError } = useDeleteReward()

  const renderItem = useCallback(
    ({ item }: any) => (
      <View className="mb-3 flex-row items-center justify-between rounded-lg bg-white p-4 shadow">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
          <Text className="text-base font-semibold text-blue-600">{item.points_cost} pts</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            deleteReward({ rewardId: item.id })
          }}
          className="ml-4"
        >
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    ),
    [],
  )

  if (isLoading) {
    return <Text> IS Loading ...</Text>
  }

  if (error || deleteError) {
    console.log("Error in Rewards component")
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <FlashList
        data={rewards}
        ListEmptyComponent={<Text>No rewards available.</Text>}
        renderItem={renderItem}
        estimatedItemSize={70}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
