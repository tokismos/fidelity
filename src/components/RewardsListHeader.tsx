import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { Pressable, Text, View } from "react-native"

type Props = {
  activeCount: number
  pausedCount: number
}

// Counts and the button to create a reward, above the admin's list
export const RewardsListHeader = ({ activeCount, pausedCount }: Props) => (
  <View className="mb-1 flex-row items-center justify-between">
    <View>
      <Text className="text-2xl font-extrabold text-gray-900">Rewards</Text>
      <Text className="text-sm text-gray-500">
        {activeCount} active · {pausedCount} paused
      </Text>
    </View>
    <Link href="/admin/newReward" asChild>
      <Pressable className="flex-row items-center rounded-xl bg-primary-600 px-4 py-3">
        <Ionicons name="add" size={20} color={colors.white} />
        <Text className="ml-1 font-bold text-white">New reward</Text>
      </Pressable>
    </Link>
  </View>
)
