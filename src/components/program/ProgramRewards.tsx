import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { RewardActionsSheet } from "@/components/program/RewardActionsSheet"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Chip } from "@/components/ui/Chip"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { Path } from "@/components/ui/Path"
import { PathStop } from "@/components/ui/PathStop"
import { Screen } from "@/components/ui/Screen"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { Tile } from "@/components/ui/Tile"
import { REWARD_TYPE_INFO } from "@/constants/rewardTypes"
import { useGetRewards } from "@/hooks/useGetRewards"
import { Reward } from "@/types"
import { rewardPoints } from "@/utils/program"
import { router } from "expo-router"
import { useState } from "react"
import { RefreshControl } from "react-native"

type Props = {
  storeId: string
}

const pausedChip = (reward: Reward) => (reward.status === "paused" ? <Chip label="Paused" tone="soft" /> : undefined)

// The store's rewards: points rewards on a path, most expensive on top, then cards and offers
export const ProgramRewards = ({ storeId }: Props) => {
  const rewards = useGetRewards({ storeId, activeOnly: false })
  const [selected, setSelected] = useState<Reward | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  if (rewards.isLoading) return <LoadingView />
  if (rewards.error) return <ErrorView message={rewards.error.message} />

  const all = rewards.data ?? []
  const pointsRewards = all
    .flatMap((reward) => {
      const points = rewardPoints(reward)
      return points === null ? [] : [{ reward, points }]
    })
    .sort((a, b) => b.points - a.points)
  const offers = all.filter((reward) => rewardPoints(reward) === null)

  const open = (reward: Reward) => {
    setSelected(reward)
    setIsSheetOpen(true)
  }

  return (
    <Screen
      scroll
      refreshControl={<RefreshControl refreshing={rewards.isRefetching} onRefresh={() => void rewards.refetch()} />}
      footer={<Button title="New reward" icon="add" onPress={() => router.push("/admin/newReward")} />}
    >
      {all.length === 0 && <EmptyState icon="gift-outline" title="No rewards yet" message="Create your first one." />}

      {pointsRewards.length > 0 && (
        <>
          <SectionTitle title="Points rewards" />
          <Path>
            {pointsRewards.map(({ reward, points }) => (
              <PathStop key={reward.id} state="upcoming">
                <Card>
                  <ListRow
                    title={reward.title}
                    subtitle={`${points} points`}
                    trailing={pausedChip(reward)}
                    showChevron
                    onPress={() => open(reward)}
                  />
                </Card>
              </PathStop>
            ))}
          </Path>
        </>
      )}

      {offers.length > 0 && (
        <>
          <SectionTitle title="Cards and offers" />
          <ListCard className="mx-4">
            {offers.map((reward) => (
              <ListRow
                key={reward.id}
                title={reward.title}
                leading={<Tile icon={REWARD_TYPE_INFO[reward.type].icon} />}
                trailing={pausedChip(reward)}
                showChevron
                onPress={() => open(reward)}
              />
            ))}
          </ListCard>
        </>
      )}

      <RewardActionsSheet
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        reward={all.find((reward) => reward.id === selected?.id) ?? selected}
      />
    </Screen>
  )
}
