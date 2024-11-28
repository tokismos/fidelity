import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { useAuth } from "@/hooks/useAuth"
import { useGetRewardsByStoreId } from "@/hooks/useGetRewardsByStoreId"
import { useGetUserRedeemedRewards } from "@/hooks/useGetUserRedeemedRewards"
import { useRedeemReward } from "@/hooks/useRedeemReward"
import { Id } from "@/types"
import { FlashList } from "@shopify/flash-list"
import { useLocalSearchParams } from "expo-router"
import { useCallback } from "react"
import { View, Text, Alert } from "react-native"

export default function StoreRewards() {
  const { userId } = useAuth()

  const { storeId } = useLocalSearchParams<{ storeId: string }>()
  const { rewards, error, isLoading } = useGetRewardsByStoreId({ storeId })
  const { userRedeemedRewards, isLoading: redeemedLoading } = useGetUserRedeemedRewards({ userId, storeId })
  const { redeemReward, isPending, error: redeemRewardError } = useRedeemReward()

  const renderItem = useCallback(
    ({ item }: any) => {
      const isRedeemed = userRedeemedRewards?.includes(item.id)

      return (
        <View className="mb-3 flex-row items-center justify-between rounded-lg bg-white p-4 shadow">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
            <Text className="text-base font-semibold text-blue-600">{item.points_cost} pts</Text>
            {isRedeemed ? (
              <Text className="text-sm text-gray-500">Redeemed</Text>
            ) : (
              <ButtonWithIndicator
                isLoading={redeemedLoading}
                title="Redeem"
                onPress={() => {
                  Alert.alert("Redeem Reward", "Are you sure you want to redeem this reward?", [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Redeem",
                      onPress: () => {
                        redeemReward({ userId, rewardId: item.id, config: item.config })
                      },
                    },
                  ])
                }}
              />
            )}
          </View>
        </View>
      )
    },
    [userRedeemedRewards, rewards],
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
        extraData={userRedeemedRewards}
        ListEmptyComponent={<Text>No rewards available.</Text>}
        renderItem={renderItem}
        estimatedItemSize={70}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
