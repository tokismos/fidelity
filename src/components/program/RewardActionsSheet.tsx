import { RewardActions } from "@/components/program/RewardActions"
import { Sheet } from "@/components/ui/Sheet"
import { Reward } from "@/types"
import { rewardTypeLine } from "@/utils/program"

type Props = {
  visible: boolean
  onClose: () => void
  reward: Reward | null
}

// What the owner can do with one reward: pause or show it, edit it, delete it
export const RewardActionsSheet = ({ visible, onClose, reward }: Props) => (
  <Sheet
    visible={visible}
    onClose={onClose}
    title={reward?.title ?? ""}
    subtitle={reward ? rewardTypeLine(reward) : undefined}
  >
    {reward && <RewardActions reward={reward} onClose={onClose} />}
  </Sheet>
)
