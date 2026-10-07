import { RewardTypeCard } from "@/components/RewardTypeCard"
import { REWARD_TYPES } from "@/constants/rewardTypes"
import { router } from "expo-router"
import { ScrollView, Text, View } from "react-native"

export default function NewReward() {
  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-2xl font-extrabold text-gray-900">What do you want to offer?</Text>
      <Text className="mb-4 mt-1 text-gray-600">Pick a type. You fill in the details on the next screen.</Text>
      {REWARD_TYPES.map((type) => (
        <RewardTypeCard
          key={type}
          type={type}
          onPress={() => router.push({ pathname: "/admin/upsert", params: { type } })}
        />
      ))}
      <View className="rounded-xl bg-amber-50 p-3">
        <Text className="text-sm text-amber-800">
          Any reward can be made one time only on the next screen, for example a welcome gift.
        </Text>
      </View>
    </ScrollView>
  )
}
