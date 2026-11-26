import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { Tile } from "@/components/ui/Tile"
import { ShopRewardGroup } from "@/utils/customerRewards"
import { View } from "react-native"

type Props = {
  group: ShopRewardGroup
  ready: boolean
  onOpen: (rewardId: string) => void
}

// The rewards of one shop on the customer's Rewards tab
export const ShopRewardsGroup = ({ group, ready, onOpen }: Props) => (
  <View>
    <SectionTitle title={group.storeName} />
    <View className="mx-4">
      <ListCard>
        {group.rows.map((row) => (
          <ListRow
            key={row.id}
            title={row.title}
            subtitle={row.line}
            leading={<Tile icon={row.icon} tone={ready ? "rose" : "neutral"} />}
            showChevron
            onPress={() => onOpen(row.rewardId)}
          />
        ))}
      </ListCard>
    </View>
  </View>
)
