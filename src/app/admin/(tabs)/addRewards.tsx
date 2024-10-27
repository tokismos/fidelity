import { REWARD_TYPES } from "@/types"
import { useRouter } from "expo-router"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

const RewardTypeCard = ({ title, description, icon, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-4 flex-row items-center rounded-lg bg-white p-4 shadow-md"
    style={{
      elevation: 3,
      backgroundColor: "#f9f9f9",
      padding: 16,
      borderRadius: 12,
    }}
  >
    <FontAwesome name={icon} size={28} color="#4a90e2" style={{ marginRight: 12 }} />
    <View style={{ flex: 1 }}>
      <Text className="text-lg font-semibold" style={{ marginBottom: 4, color: "#333" }}>
        {title}
      </Text>
      <Text className="text-gray-600" style={{ color: "#777" }}>
        {description}
      </Text>
    </View>
  </TouchableOpacity>
)

export default function AddRewardsScreen() {
  const rewardTypes = [
    {
      type: REWARD_TYPES.BUY_N_GET_1,
      title: "Buy N Get 1",
      description: "Customer buys a specific number of items and gets one free",
      icon: "gift",
    },
    {
      type: REWARD_TYPES.DISCOUNT_PERCENTAGE,
      title: "Percentage Discount",
      description: "Offer a percentage discount on purchase",
      icon: "percent",
    },
    {
      type: REWARD_TYPES.DISCOUNT_FIX,
      title: "Fixed Discount",
      description: "Offer a fixed amount discount",
      icon: "dollar",
    },
    {
      type: REWARD_TYPES.FREE_ITEM,
      title: "Free Item",
      description: "Offer a specific item for free",
      icon: "star",
    },
    {
      type: REWARD_TYPES.FREE_ITEM_WITH_PURCHASE,
      title: "Free Item with Purchase",
      description: "Get a free item when purchasing a specific item",
      icon: "shopping-cart",
    },
  ]

  const router = useRouter()

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="mb-4 text-center text-3xl font-bold" style={{ color: "#333", marginBottom: 16 }}>
        Choose Reward Type
      </Text>
      <Text className="mb-6 text-center text-base text-gray-600" style={{ marginHorizontal: 20 }}>
        Pick a reward type to apply to your offers and delight your customers with engaging promotions!
      </Text>
      {rewardTypes.map((reward) => (
        <RewardTypeCard
          key={reward.type}
          title={reward.title}
          description={reward.description}
          icon={reward.icon}
          onPress={() => router.push({ pathname: "/admin/upsert", params: { type: reward.type } })}
        />
      ))}
    </ScrollView>
  )
}
