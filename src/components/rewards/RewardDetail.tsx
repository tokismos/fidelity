import { BuyNGet1Detail } from "@/components/rewards/BuyNGet1Detail"
import { DiscountFixDetail } from "@/components/rewards/DiscountFixDetail"
import { DiscountPercentageDetail } from "@/components/rewards/DiscountPercentageDetail"
import { FreeItemDetail } from "@/components/rewards/FreeItemDetail"
import { FreeItemWithPurchaseDetail } from "@/components/rewards/FreeItemWithPurchaseDetail"
import { Reward, RewardAdminActions, RewardProgress } from "@/types"

type Props = {
  reward: Reward
  progress: RewardProgress
  admin?: RewardAdminActions
}

// Picks the screen made for the reward type. Without admin actions it is read only.
export const RewardDetail = ({ reward, progress, admin }: Props) => {
  switch (reward.type) {
    case "BUY_N_GET_1":
      return <BuyNGet1Detail reward={reward} progress={progress} admin={admin} />
    case "DISCOUNT_PERCENTAGE":
      return <DiscountPercentageDetail reward={reward} progress={progress} admin={admin} />
    case "DISCOUNT_FIX":
      return <DiscountFixDetail reward={reward} progress={progress} admin={admin} />
    case "FREE_ITEM":
      return <FreeItemDetail reward={reward} progress={progress} admin={admin} />
    case "FREE_ITEM_WITH_PURCHASE":
      return <FreeItemWithPurchaseDetail reward={reward} progress={progress} admin={admin} />
  }
}
