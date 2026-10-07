import { ProgressBar } from "@/components/ProgressBar"
import { RewardIcon } from "@/components/RewardIcon"
import { colors } from "@/constants/colors"
import { RewardWithProgress } from "@/types"
import { describeReward, remainingLabel } from "@/utils/rewards"
import { Ionicons } from "@expo/vector-icons"
import { Href, Link } from "expo-router"
import { ActivityIndicator, Pressable, Text, View } from "react-native"

type Props = {
  item: RewardWithProgress
  href: Href
  isPending: boolean
  onGive: () => void
  onStamp: () => void
}

type Action = { label: string; icon?: "add"; onPress: () => void; enabled: boolean } | null

// A reward on the admin's customer screen, with the one action that makes sense right now
export const AdminRewardRow = ({ item: { reward, progress }, href, isPending, onGive, onStamp }: Props) => {
  const isReady = progress.isReady && !progress.isFinished

  const action: Action = progress.isFinished
    ? null
    : isReady
      ? { label: "Give", onPress: onGive, enabled: true }
      : reward.type === "BUY_N_GET_1"
        ? { label: "Stamp", icon: "add", onPress: onStamp, enabled: true }
        : { label: "Give", onPress: onGive, enabled: false }

  const subtitle = progress.isFinished
    ? "One time offer · already given"
    : progress.unit
      ? isReady
        ? `Ready · ${describeReward(reward)}`
        : `${progress.current} of ${progress.target} · ${remainingLabel(progress)}`
      : `${describeReward(reward)} · no points needed`

  return (
    <Link href={href} asChild>
      <Pressable
        className={`mb-3 flex-row items-center rounded-2xl bg-white p-3 ${
          isReady ? "border-2 border-green-600" : "border border-gray-200"
        } ${progress.isFinished ? "opacity-60" : ""}`}
      >
        <RewardIcon
          reward={reward}
          size="small"
          tone={isReady ? "success" : progress.isFinished ? "muted" : "primary"}
        />
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-gray-900">{reward.title}</Text>
          <Text className={`text-xs ${isReady ? "font-semibold text-green-700" : "text-gray-600"}`}>{subtitle}</Text>
          {progress.unit && !progress.isFinished && !isReady && (
            <View className="mt-2">
              <ProgressBar current={progress.current} target={progress.target} isReady={false} />
            </View>
          )}
        </View>
        {action && (
          <Pressable
            onPress={action.onPress}
            disabled={isPending || !action.enabled}
            accessibilityLabel={`${action.label} ${reward.title}`}
            className={`ml-3 h-10 flex-row items-center rounded-xl px-4 ${
              !action.enabled ? "bg-gray-100" : action.label === "Give" ? "bg-green-600" : "bg-primary-600"
            }`}
          >
            {isPending ? (
              <ActivityIndicator size="small" color={action.enabled ? colors.white : colors.muted} />
            ) : (
              <>
                {action.icon && <Ionicons name="add" size={18} color={colors.white} />}
                <Text className={`font-bold ${action.enabled ? "text-white" : "text-gray-400"}`}>{action.label}</Text>
              </>
            )}
          </Pressable>
        )}
      </Pressable>
    </Link>
  )
}
