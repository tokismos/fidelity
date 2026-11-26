import { AppText } from "@/components/ui/AppText"
import { Avatar } from "@/components/ui/Avatar"
import { Dot } from "@/components/ui/Dot"
import { ListRow } from "@/components/ui/ListRow"
import { CustomerProfile } from "@/types"
import { customerName, initials } from "@/utils/text"
import { router } from "expo-router"
import { View } from "react-native"

type Props = {
  userId: string
  points: number
  profile: CustomerProfile | null
  // Shows a rose dot: the customer has enough points for a reward
  canAfford?: boolean
}

// A customer in an owner list: initials, name, points. Opens the customer screen.
export const CustomerRow = ({ userId, points, profile, canAfford = false }: Props) => {
  const name = customerName(profile)

  return (
    <ListRow
      title={name}
      leading={<Avatar label={initials(name)} />}
      trailing={
        <View className="flex-row items-center gap-2">
          {canAfford && <Dot />}
          <AppText weight="bold" tabular className="text-[17px]">
            {points}
          </AppText>
        </View>
      }
      showChevron
      accessibilityLabel={`${name}, ${points} points${canAfford ? ", a reward is ready" : ""}`}
      onPress={() => router.push({ pathname: "/admin/customer/[userId]", params: { userId } })}
    />
  )
}
