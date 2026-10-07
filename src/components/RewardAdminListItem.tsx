import { RewardIcon } from "@/components/RewardIcon"
import { colors } from "@/constants/colors"
import { Reward } from "@/types"
import { describeReward } from "@/utils/rewards"
import { Ionicons } from "@expo/vector-icons"
import { Alert, Pressable, Switch, Text, View } from "react-native"

type Props = {
  reward: Reward
  isBusy: boolean
  onToggleActive: (isActive: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export const RewardAdminListItem = ({ reward, isBusy, onToggleActive, onEdit, onDelete }: Props) => {
  const isActive = reward.status === "active"

  const showMenu = () =>
    Alert.alert(reward.title, describeReward(reward), [
      { text: "Edit", onPress: onEdit },
      { text: "Delete", style: "destructive", onPress: onDelete },
      { text: "Cancel", style: "cancel" },
    ])

  return (
    <View
      className={`mb-3 flex-row items-center rounded-2xl bg-white p-3 ${
        isActive ? "border border-gray-200" : "border border-dashed border-gray-300 opacity-70"
      }`}
    >
      <RewardIcon reward={reward} size="small" tone={isActive ? "primary" : "muted"} />
      <Pressable onPress={onEdit} disabled={isBusy} className="ml-3 flex-1">
        <Text className="text-base font-bold text-gray-900">{reward.title}</Text>
        <Text className="text-xs text-gray-600">
          {describeReward(reward)}
          {reward.is_one_time ? " · one time" : ""}
        </Text>
      </Pressable>
      <Switch
        value={isActive}
        disabled={isBusy}
        onValueChange={onToggleActive}
        accessibilityLabel={isActive ? "Active, tap to pause" : "Paused, tap to activate"}
        trackColor={{ true: colors.success, false: colors.muted }}
      />
      <Pressable onPress={showMenu} disabled={isBusy} accessibilityLabel="More actions" className="ml-1 p-2">
        <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
      </Pressable>
    </View>
  )
}
