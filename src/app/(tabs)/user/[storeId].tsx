import { useGetRewardsByStoreId } from "@/hooks/useGetRewardsByStoreId"
import { FlashList } from "@shopify/flash-list"
import { useLocalSearchParams } from "expo-router"
import { useCallback } from "react"
import { View, Text } from "react-native"

export default function StoreRewards() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>()
  const { rewards, error, isLoading } = useGetRewardsByStoreId({ storeId })

  const renderItem = useCallback(
    ({ item }: any) => (
      <View className="mb-3 flex-row items-center justify-between rounded-lg bg-white p-4 shadow">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
          <Text className="text-base font-semibold text-blue-600">{item.points_cost} pts</Text>
        </View>
      </View>
    ),
    [],
  )

  if (isLoading) {
    return <Text> IS Loading ...</Text>
  }

  if (error) {
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
