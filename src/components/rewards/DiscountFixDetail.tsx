import { CouponBadge } from "@/components/rewards/CouponBadge"
import { PointsRewardBody } from "@/components/rewards/PointsRewardBody"
import { DiscountFixReward, RewardAdminActions, RewardProgress } from "@/types"
import { View } from "react-native"

type Props = {
  reward: DiscountFixReward
  progress: RewardProgress
  admin?: RewardAdminActions
}

export const DiscountFixDetail = ({ reward, progress, admin }: Props) => (
  <View>
    <CouponBadge
      value={`-$${reward.config.discount_amount}`}
      caption={`off your purchase, for ${reward.config.points_needed_value} points`}
    />
    <PointsRewardBody progress={progress} admin={admin} giveLabel="Apply discount" />
  </View>
)
