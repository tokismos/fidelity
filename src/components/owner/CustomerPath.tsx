import { Card } from "@/components/ui/Card"
import { Chip } from "@/components/ui/Chip"
import { ListRow } from "@/components/ui/ListRow"
import { Path } from "@/components/ui/Path"
import { PathHere } from "@/components/ui/PathHere"
import { PathStop } from "@/components/ui/PathStop"
import { GiveTarget } from "@/components/owner/GiveRewardSheet"
import { PathModel } from "@/utils/path"
import { View } from "react-native"

type Props = {
  path: PathModel
  points: number
  onGive: (target: GiveTarget) => void
}

// The customer's points on the path: the next reward above, everything ready to give below
export const CustomerPath = ({ path, points, onGive }: Props) => (
  <View className="mt-[6px]">
    <Path>
      {path.next && (
        <PathStop state="upcoming">
          <Card>
            <ListRow
              title={path.next.reward.title}
              subtitle={`${path.pointsToGo} ${path.pointsToGo === 1 ? "point" : "points"} to go`}
            />
          </Card>
        </PathStop>
      )}
      <PathHere value={points} label={points === 1 ? "point" : "points"} />
      {path.ready.map((item) => (
        <PathStop key={item.reward.id} state="done">
          <Card>
            <ListRow
              title={item.reward.title}
              trailing={<Chip label="Ready" tone="rose" />}
              showChevron
              onPress={() => onGive({ kind: "reward", item })}
              accessibilityLabel={`${item.reward.title}, ready to give`}
            />
          </Card>
        </PathStop>
      ))}
      {path.prizes.map((prize) => (
        <PathStop key={prize.id} state="done" icon="trophy-outline">
          <Card>
            <ListRow
              title={prize.reward?.title ?? "Prize"}
              subtitle="Won on the wheel"
              trailing={<Chip label="Ready" tone="rose" />}
              showChevron
              onPress={() => onGive({ kind: "prize", prize })}
            />
          </Card>
        </PathStop>
      ))}
    </Path>
  </View>
)
