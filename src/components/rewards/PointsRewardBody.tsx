import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { ProgressBar } from "@/components/ProgressBar"
import { RewardStatusMessage } from "@/components/rewards/RewardStatusMessage"
import { RewardAdminActions, RewardProgress } from "@/types"
import { progressLabel } from "@/utils/rewards"
import { Text, View } from "react-native"

type Props = {
  progress: RewardProgress
  admin?: RewardAdminActions
  giveLabel: string
}

// Progress and action shared by the rewards paid with points
export const PointsRewardBody = ({ progress, admin, giveLabel }: Props) => (
  <View className="mt-4">
    <ProgressBar current={progress.current} target={progress.target} isReady={progress.isReady} />
    <Text className="mt-1 text-center text-sm text-gray-500">{progressLabel(progress)}</Text>
    <RewardStatusMessage progress={progress} isAdmin={!!admin} />
    {admin && (
      <View className="mt-4">
        <ButtonWithIndicator
          title={giveLabel}
          variant="success"
          isLoading={admin.isPending}
          disabled={!progress.isReady}
          onPress={admin.onGive}
        />
      </View>
    )}
  </View>
)
