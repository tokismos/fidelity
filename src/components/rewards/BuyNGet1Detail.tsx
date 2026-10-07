import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { RewardStatusMessage } from "@/components/rewards/RewardStatusMessage"
import { colors } from "@/constants/colors"
import { BuyNGet1Reward, RewardAdminActions, RewardProgress } from "@/types"
import { progressLabel } from "@/utils/rewards"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  reward: BuyNGet1Reward
  progress: RewardProgress
  admin?: RewardAdminActions
}

// A purchase card: one circle per purchase, the last one is the free item
export const BuyNGet1Detail = ({ reward, progress, admin }: Props) => {
  const stamps = Array.from({ length: reward.config.required_purchases }, (_, index) => index)

  return (
    <View>
      <View className="rounded-2xl bg-white p-4 shadow-sm">
        <Text className="mb-3 text-center font-semibold text-gray-700">Purchase card</Text>
        <View className="flex-row flex-wrap justify-center">
          {stamps.map((index) => (
            <View
              key={index}
              className={`m-1 h-12 w-12 items-center justify-center rounded-full border-2 ${
                index < progress.current ? "border-primary-600 bg-primary-600" : "border-gray-300 bg-white"
              }`}
            >
              {index < progress.current ? (
                <Ionicons name="checkmark" size={24} color={colors.white} />
              ) : (
                <Text className="text-gray-400">{index + 1}</Text>
              )}
            </View>
          ))}
          <View
            className={`m-1 h-12 w-12 items-center justify-center rounded-full border-2 ${
              progress.isReady ? "border-green-600 bg-green-600" : "border-dashed border-green-400"
            }`}
          >
            <Ionicons name="gift" size={22} color={progress.isReady ? colors.white : colors.success} />
          </View>
        </View>
        <Text className="mt-3 text-center text-sm text-gray-500">{progressLabel(progress)}</Text>
      </View>

      <RewardStatusMessage progress={progress} isAdmin={!!admin} />

      {admin && !progress.isFinished && (
        <View className="mt-4">
          {progress.isReady ? (
            <ButtonWithIndicator
              title="Give free item"
              variant="success"
              isLoading={admin.isPending}
              onPress={admin.onGive}
            />
          ) : (
            <ButtonWithIndicator title="Add purchase" isLoading={admin.isPending} onPress={admin.onAddPurchase} />
          )}
          {progress.current > 0 && (
            <ButtonWithIndicator
              title="Remove last purchase"
              variant="secondary"
              isLoading={admin.isPending}
              onPress={admin.onRemovePurchase}
            />
          )}
        </View>
      )}
    </View>
  )
}
