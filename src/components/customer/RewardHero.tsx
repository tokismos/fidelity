import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { colors } from "@/constants/colors"
import { Reward } from "@/types"
import { rewardCostLine, rewardIcon } from "@/utils/customerRewards"
import { Ionicons } from "@expo/vector-icons"
import { Image, View } from "react-native"

type Props = {
  reward: Reward
  // Rose tile when the customer can get it now, neutral otherwise
  isReady: boolean
}

// The reward at the top of its screen: a big type icon or the photo, the name, what it costs and the description
export const RewardHero = ({ reward, isReady }: Props) => (
  <Card className="items-center px-6 pb-6 pt-7">
    <View
      className={`mb-4 h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[24px] ${
        isReady ? "bg-rose-soft" : "bg-ground"
      }`}
    >
      {reward.config.image_path ? (
        <Image source={{ uri: reward.config.image_path }} className="h-full w-full" accessibilityIgnoresInvertColors />
      ) : (
        <Ionicons name={rewardIcon(reward)} size={36} color={isReady ? colors.roseInk : colors.ink} />
      )}
    </View>
    <AppText weight="black" className="text-center text-[26px] leading-[29px] tracking-[-0.4px]">
      {reward.title}
    </AppText>
    <AppText className="mt-1 text-center text-ink-2">{rewardCostLine(reward)}</AppText>
    {!!reward.description.trim() && (
      <View className="mt-[18px] self-stretch border-t border-ground pt-[18px]">
        <AppText className="text-center">{reward.description}</AppText>
      </View>
    )}
  </Card>
)
