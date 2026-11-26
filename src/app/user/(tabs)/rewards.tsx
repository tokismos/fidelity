import { ShopRewardsGroup } from "@/components/customer/ShopRewardsGroup"
import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { LargeTitle } from "@/components/ui/LargeTitle"
import { Screen } from "@/components/ui/Screen"
import { Segmented } from "@/components/ui/Segmented"
import { useStoreOverviews } from "@/hooks/useStoreOverviews"
import { useWaitingPrizes } from "@/hooks/useWaitingPrizes"
import { customerRewardGroups } from "@/utils/customerRewards"
import { FlashList } from "@shopify/flash-list"
import { router } from "expo-router"
import { useState } from "react"
import { View } from "react-native"

type Tab = "ready" | "onTheWay"

export default function UserRewards() {
  const { storeIds, overviews, isLoading, error, refetch, isRefetching } = useStoreOverviews()
  const prizes = useWaitingPrizes({ storeIds })
  const [tab, setTab] = useState<Tab>("ready")

  if (isLoading) return <LoadingView />
  if (error) return <ErrorView message={error.message} />

  const groups = customerRewardGroups(overviews, prizes.byStore)

  return (
    <Screen>
      <LargeTitle title="Rewards" />
      <View className="mx-4 mt-[14px]">
        <Segmented
          options={[
            { value: "ready", label: `Ready (${groups.readyCount})` },
            { value: "onTheWay", label: `On the way (${groups.onTheWayCount})` },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>
      <FlashList
        data={tab === "ready" ? groups.ready : groups.onTheWay}
        keyExtractor={(item) => item.storeId}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <ShopRewardsGroup
            group={item}
            ready={tab === "ready"}
            onOpen={(rewardId) => router.push({ pathname: "/user/reward/[rewardId]", params: { rewardId } })}
          />
        )}
        ListEmptyComponent={
          tab === "ready" ? (
            <EmptyState icon="gift-outline" title="Nothing ready yet" message="Keep collecting." />
          ) : (
            <EmptyState icon="hourglass-outline" title="Nothing on the way" />
          )
        }
        onRefresh={() => Promise.all([refetch(), prizes.refetch()])}
        refreshing={isRefetching || prizes.isRefetching}
      />
    </Screen>
  )
}
