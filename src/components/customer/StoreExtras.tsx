import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { PurchaseDots } from "@/components/ui/PurchaseDots"
import { Tile } from "@/components/ui/Tile"
import { RewardWithProgress } from "@/types"
import { rewardIcon } from "@/utils/customerRewards"

type Props = {
  cards: RewardWithProgress[]
  offers: RewardWithProgress[]
  // Line of the prize wheel row, or null when the shop has no wheel
  wheelLine: string | null
  onOpenReward: (rewardId: string) => void
  onOpenWheel: () => void
}

// Under the path: the purchase cards, the free with a purchase offers and the prize wheel
export const StoreExtras = ({ cards, offers, wheelLine, onOpenReward, onOpenWheel }: Props) => {
  if (cards.length === 0 && offers.length === 0 && !wheelLine) return null

  return (
    <ListCard className="mx-4 mt-[18px]">
      {cards.map(({ reward, progress }) => (
        <ListRow
          key={reward.id}
          title={reward.title}
          detail={<PurchaseDots total={progress.target} filled={progress.current} size="s" />}
          accessibilityLabel={`${reward.title}, ${progress.current} of ${progress.target} purchases`}
          leading={<Tile icon={rewardIcon(reward)} tone={progress.isReady ? "rose" : "neutral"} />}
          showChevron
          onPress={() => onOpenReward(reward.id)}
        />
      ))}
      {offers.map(({ reward }) => (
        <ListRow
          key={reward.id}
          title={reward.title}
          subtitle={
            reward.type === "FREE_ITEM_WITH_PURCHASE"
              ? `When you buy a ${reward.config.item_name}, no points`
              : undefined
          }
          leading={<Tile icon={rewardIcon(reward)} />}
          showChevron
          onPress={() => onOpenReward(reward.id)}
        />
      ))}
      {wheelLine && (
        <ListRow
          title="Prize wheel"
          subtitle={wheelLine}
          leading={<Tile icon="disc-outline" />}
          showChevron
          onPress={onOpenWheel}
        />
      )}
    </ListCard>
  )
}
