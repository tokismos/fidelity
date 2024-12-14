import { incrementPurchase } from "@/api/incrementPurchase"
import { RewardDetailsDisplay } from "@/components/RewardDetailsDisplay"
import { useGetUserRewardById } from "@/hooks/useGetUserRewardById"
import { useLocalSearchParams } from "expo-router"
import React, { useEffect } from "react"
import { Text } from "react-native"

export default function UserReward() {
  const { userRewardId } = useLocalSearchParams<{ userRewardId: string }>()
  const { userReward, isLoading } = useGetUserRewardById({ userRewardId })
  if (isLoading) return <Text>LOOOADING</Text>
  console.log('"userReward', userReward)

  return <RewardDetailsDisplay reward={userReward!} />
}
