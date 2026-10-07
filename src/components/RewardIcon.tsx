import { colors } from "@/constants/colors"
import { REWARD_TYPE_INFO } from "@/constants/rewardTypes"
import { Reward } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { Image, View } from "react-native"

type Props = {
  reward: Reward
  size: "small" | "large"
  tone?: "primary" | "success" | "muted"
}

const TONE_CLASS = {
  primary: "bg-primary-50",
  success: "bg-green-100",
  muted: "bg-gray-100",
}

const TONE_COLOR = {
  primary: colors.primary,
  success: colors.success,
  muted: colors.muted,
}

export const RewardIcon = ({ reward, size, tone = "primary" }: Props) => {
  const box = size === "large" ? "h-24 w-24" : "h-12 w-12"

  if (reward.config.image_path) {
    return <Image source={{ uri: reward.config.image_path }} className={`${box} rounded-xl bg-gray-100`} />
  }

  return (
    <View className={`${box} items-center justify-center rounded-xl ${TONE_CLASS[tone]}`}>
      <Ionicons name={REWARD_TYPE_INFO[reward.type].icon} size={size === "large" ? 48 : 24} color={TONE_COLOR[tone]} />
    </View>
  )
}
