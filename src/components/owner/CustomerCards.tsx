import { Chip } from "@/components/ui/Chip"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { PurchaseDots } from "@/components/ui/PurchaseDots"
import { Tile } from "@/components/ui/Tile"
import { GiveTarget } from "@/components/owner/GiveRewardSheet"
import { RewardWithProgress } from "@/types"
import { describeReward } from "@/utils/rewards"

type Props = {
  // Buy N get 1 cards
  cards: RewardWithProgress[]
  // Free with a purchase offers
  offers: RewardWithProgress[]
  onOpenCard: (item: RewardWithProgress) => void
  onGive: (target: GiveTarget) => void
}

// The rewards that do not use points, under the path: purchase cards and free with a purchase offers
export const CustomerCards = ({ cards, offers, onOpenCard, onGive }: Props) => {
  if (cards.length === 0 && offers.length === 0) return null

  return (
    <ListCard className="mx-4 mt-[18px]">
      {cards.map((item) => (
        <ListRow
          key={item.reward.id}
          title={item.reward.title}
          leading={<Tile icon="cafe-outline" />}
          detail={<PurchaseDots total={item.progress.target} filled={item.progress.current} />}
          trailing={item.progress.isReady ? <Chip label="Ready" tone="rose" /> : undefined}
          showChevron
          onPress={() => onOpenCard(item)}
          accessibilityLabel={`${item.reward.title}, ${item.progress.current} of ${item.progress.target} purchases`}
        />
      ))}
      {offers.map((item) => (
        <ListRow
          key={item.reward.id}
          title={item.reward.title}
          subtitle={describeReward(item.reward)}
          leading={<Tile icon="gift-outline" />}
          showChevron
          onPress={() => onGive({ kind: "reward", item })}
        />
      ))}
    </ListCard>
  )
}
