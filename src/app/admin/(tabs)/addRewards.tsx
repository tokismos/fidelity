import { RewardTypeCard } from "@/components/RewardTypeCard"
import { REWARD_TYPES } from "@/constants/rewardTypes"
import { router } from "expo-router"
import { ScrollView, Text } from "react-native"

export default function AddReward() {
  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <Text className="mb-4 text-gray-600">Choose the kind of reward you want to offer your customers.</Text>
      {REWARD_TYPES.map((type) => (
        <RewardTypeCard
          key={type}
          type={type}
          onPress={() => router.push({ pathname: "/admin/upsert", params: { type } })}
        />
      ))}
    </ScrollView>
  )
}
