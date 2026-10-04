import { colors } from "@/constants/colors"
import { RewardIcon } from "@/components/RewardIcon"
import { Reward } from "@/types"
import { describeReward } from "@/utils/rewards"
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Switch, Text, View } from "react-native"

type Props = {
  reward: Reward
  isBusy: boolean
  onToggleActive: (isActive: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export const RewardAdminListItem = ({ reward, isBusy, onToggleActive, onEdit, onDelete }: Props) => {
  const isActive = reward.status === "active"

  return (
    <View className={`mb-3 rounded-xl bg-white p-4 shadow-sm ${isActive ? "" : "opacity-60"}`}>
      <View className="flex-row items-center">
        <RewardIcon reward={reward} size="small" />
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-gray-900">{reward.title}</Text>
          <Text className="text-sm text-gray-500">{describeReward(reward)}</Text>
        </View>
      </View>
      <View className="mt-3 flex-row items-center justify-between border-t border-gray-100 pt-3">
        <View className="flex-row items-center">
          <Switch
            value={isActive}
            disabled={isBusy}
            onValueChange={onToggleActive}
            trackColor={{ true: colors.success, false: colors.muted }}
          />
          <Text className="ml-2 text-sm text-gray-600">{isActive ? "Active" : "Paused"}</Text>
        </View>
        <View className="flex-row">
          <Pressable onPress={onEdit} disabled={isBusy} className="p-2">
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </Pressable>
          <Pressable onPress={onDelete} disabled={isBusy} className="ml-2 p-2">
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}
