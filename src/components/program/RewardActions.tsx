import { Button } from "@/components/ui/Button"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { colors } from "@/constants/colors"
import { useDeleteReward } from "@/hooks/useDeleteReward"
import { useSetRewardStatus } from "@/hooks/useSetRewardStatus"
import { Reward } from "@/types"
import { router } from "expo-router"
import { useState } from "react"
import { Alert, Switch, View } from "react-native"

type Props = {
  reward: Reward
  onClose: () => void
}

const showError = (error: Error) => Alert.alert("Something went wrong", error.message)

// The content of the reward sheet. It is mounted each time the sheet opens, so the switch starts from the saved status
export const RewardActions = ({ reward, onClose }: Props) => {
  const { setRewardStatus, isPending: isUpdating } = useSetRewardStatus()
  const { deleteReward, isPending: isDeleting } = useDeleteReward()
  // Follows the tap right away, and goes back if saving fails
  const [isShown, setIsShown] = useState(reward.status === "active")

  const toggle = (shown: boolean) => {
    setIsShown(shown)
    setRewardStatus(
      { rewardId: reward.id, status: shown ? "active" : "paused" },
      {
        onError: (error) => {
          setIsShown(!shown)
          showError(error)
        },
      },
    )
  }

  const edit = () => {
    onClose()
    router.push({ pathname: "/admin/upsert", params: { type: reward.type, rewardId: reward.id } })
  }

  const confirmDelete = () =>
    Alert.alert("Delete reward", `Delete "${reward.title}"? Customers will no longer see it.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteReward({ rewardId: reward.id }, { onSuccess: onClose, onError: showError }),
      },
    ])

  return (
    <View className="gap-[10px]">
      <ListCard className="mb-[10px]">
        <ListRow
          title="Shown to customers"
          trailing={
            <Switch
              value={isShown}
              onValueChange={toggle}
              disabled={isUpdating}
              accessibilityLabel="Shown to customers"
              trackColor={{ true: colors.ink, false: colors.line2 }}
              ios_backgroundColor={colors.line2}
            />
          }
        />
      </ListCard>
      <Button title="Edit reward" icon="pencil-outline" onPress={edit} />
      <Button title="Delete" icon="trash-outline" variant="danger" isLoading={isDeleting} onPress={confirmDelete} />
    </View>
  )
}
