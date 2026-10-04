import { CouponBadge } from "@/components/rewards/CouponBadge"
import { PointsRewardBody } from "@/components/rewards/PointsRewardBody"
import { DiscountPercentageReward, RewardAdminActions, RewardProgress } from "@/types"
import { View } from "react-native"

type Props = {
  reward: DiscountPercentageReward
  progress: RewardProgress
  admin?: RewardAdminActions
}

export const DiscountPercentageDetail = ({ reward, progress, admin }: Props) => (
  <View>
    <CouponBadge
      value={`-${reward.config.discount_percentage}%`}
      caption={`on your purchase, for ${reward.config.points_needed_value} points`}
    />
    <PointsRewardBody progress={progress} admin={admin} giveLabel="Apply discount" />
  </View>
)
