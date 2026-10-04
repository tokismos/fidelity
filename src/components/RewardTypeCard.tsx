import { colors } from "@/constants/colors"
import { REWARD_TYPE_INFO } from "@/constants/rewardTypes"
import { RewardType } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text, View } from "react-native"

type Props = {
  type: RewardType
  onPress: () => void
}

export const RewardTypeCard = ({ type, onPress }: Props) => {
  const info = REWARD_TYPE_INFO[type]

  return (
    <Pressable onPress={onPress} className="mb-3 flex-row items-center rounded-xl bg-white p-4 shadow-sm">
      <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
        <Ionicons name={info.icon} size={24} color={colors.primary} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-gray-900">{info.title}</Text>
        <Text className="text-sm text-gray-500">{info.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  )
}
