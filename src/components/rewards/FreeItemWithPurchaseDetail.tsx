import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { RewardStatusMessage } from "@/components/rewards/RewardStatusMessage"
import { colors } from "@/constants/colors"
import { FreeItemWithPurchaseReward, RewardAdminActions, RewardProgress } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  reward: FreeItemWithPurchaseReward
  progress: RewardProgress
  admin?: RewardAdminActions
}

export const FreeItemWithPurchaseDetail = ({ reward, progress, admin }: Props) => {
  const { item_name, free_item_name } = reward.config

  return (
    <View>
      <View className="flex-row items-center justify-center rounded-2xl bg-white p-5 shadow-sm">
        <View className="flex-1 items-center">
          <Ionicons name="bag-handle" size={32} color={colors.text} />
          <Text className="mt-1 text-center font-semibold text-gray-800">Buy a {item_name}</Text>
        </View>
        <Ionicons name="arrow-forward" size={24} color={colors.muted} />
        <View className="flex-1 items-center">
          <Ionicons name="gift" size={32} color={colors.success} />
          <Text className="mt-1 text-center font-semibold text-green-700">Get {free_item_name} free</Text>
        </View>
      </View>

      {progress.isFinished ? (
        <RewardStatusMessage progress={progress} isAdmin={!!admin} />
      ) : (
        <View className="mt-4 flex-row items-center rounded-xl bg-primary-50 p-3">
          <Ionicons name="information-circle" size={22} color={colors.primary} />
          <Text className="ml-2 flex-1 text-primary-900">
            {admin
              ? `Give it only when the customer buys a ${item_name}.`
              : `No points needed. Show your QR code when you buy a ${item_name}.`}
          </Text>
        </View>
      )}

      {admin && !progress.isFinished && (
        <View className="mt-4">
          <ButtonWithIndicator
            title={`Give free ${free_item_name}`}
            variant="success"
            isLoading={admin.isPending}
            onPress={admin.onGive}
          />
        </View>
      )}
    </View>
  )
}
