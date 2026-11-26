import { Card } from "@/components/ui/Card"
import { Chip } from "@/components/ui/Chip"
import { ListRow } from "@/components/ui/ListRow"
import { Path } from "@/components/ui/Path"
import { PathHere } from "@/components/ui/PathHere"
import { PathStop } from "@/components/ui/PathStop"
import { PathModel } from "@/utils/path"

type Props = {
  path: PathModel
  points: number
  onOpenReward: (rewardId: string) => void
}

// The customer's path in a shop: the next reward above the points, what is ready below
export const StorePath = ({ path, points, onOpenReward }: Props) => (
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
    {path.ready.map(({ reward }) => (
      <PathStop key={reward.id} state="done">
        <Card>
          <ListRow
            title={reward.title}
            trailing={<Chip label="Ready" tone="rose" />}
            showChevron
            onPress={() => onOpenReward(reward.id)}
          />
        </Card>
      </PathStop>
    ))}
    {path.prizes.map((prize) => {
      const rewardId = prize.reward_id
      if (!rewardId) return null
      return (
        <PathStop key={prize.id} state="done" icon="trophy-outline">
          <Card>
            <ListRow
              title={prize.reward?.title ?? "Prize"}
              subtitle="Won on the wheel"
              trailing={<Chip label="Ready" tone="rose" />}
              showChevron
              onPress={() => onOpenReward(rewardId)}
            />
          </Card>
        </PathStop>
      )
    })}
  </Path>
)
