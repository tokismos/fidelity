import { CreateStoreForm } from "@/components/CreateStoreForm"
import { CustomerRow } from "@/components/CustomerRow"
import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { HomePromotionCard } from "@/components/HomePromotionCard"
import { LoadingView } from "@/components/LoadingView"
import { TodayStatsCard } from "@/components/TodayStatsCard"
import { LargeTitle } from "@/components/ui/LargeTitle"
import { ListCard } from "@/components/ui/ListCard"
import { Screen } from "@/components/ui/Screen"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { Tile } from "@/components/ui/Tile"
import { colors } from "@/constants/colors"
import { useAddStore } from "@/hooks/useAddStore"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useGetRecentCustomers } from "@/hooks/useGetRecentCustomers"
import { useGetStore } from "@/hooks/useGetStore"
import { useGetTodayStats } from "@/hooks/useGetTodayStats"
import { useNow } from "@/hooks/useNow"
import { useSetStoreTimezone } from "@/hooks/useSetStoreTimezone"
import { activePromotion, nextPromotion } from "@/utils/promotions"
import { deviceTimeZone } from "@/utils/time"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, RefreshControl, View } from "react-native"

const RECENT_CUSTOMERS = 3

export default function AdminHome() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const store = useGetStore()
  const todayStats = useGetTodayStats()
  const recentCustomers = useGetRecentCustomers(RECENT_CUSTOMERS)
  const promotions = useGetPromotions({ storeIds: store.data ? [store.data.id] : [] })
  const { addStore, isPending } = useAddStore()
  const { setStoreTimezone } = useSetStoreTimezone()
  const now = useNow()

  // The store time zone is saved once, from the admin's phone
  const storeId = store.data?.id
  const hasTimezone = !!store.data?.timezone
  useEffect(() => {
    if (storeId && !hasTimezone) setStoreTimezone({ storeId, timezone: deviceTimeZone() })
  }, [storeId, hasTimezone, setStoreTimezone])

  if (store.isLoading) return <LoadingView />
  if (store.error) return <ErrorView message={store.error.message} />

  if (!store.data) {
    return (
      <CreateStoreForm
        isPending={isPending}
        onSubmit={(newStore) =>
          addStore(newStore, { onError: (error) => Alert.alert("Could not create the store", error.message) })
        }
      />
    )
  }

  const timeZone = store.data.timezone ?? deviceTimeZone()
  const promotion =
    activePromotion(promotions.data ?? [], store.data.id, now) ??
    nextPromotion(promotions.data ?? [], store.data.id, now)
  const today = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", timeZone })
  const customers = recentCustomers.data ?? []

  const refresh = async () => {
    setIsRefreshing(true)
    await Promise.all([store.refetch(), todayStats.refetch(), recentCustomers.refetch(), promotions.refetch()])
    setIsRefreshing(false)
  }

  return (
    <Screen
      scroll
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.ink3} />}
    >
      <LargeTitle
        title={store.data.name}
        subtitle={today}
        leading={<Tile icon="storefront-outline" tone="white" size="l" imageUri={store.data.image_url} />}
      />

      {promotion && (
        <View className="mx-4 mt-[18px]">
          <HomePromotionCard promotion={promotion} now={now} timeZone={timeZone} />
        </View>
      )}

      <SectionTitle title="Today" />
      <View className="mx-4">
        <TodayStatsCard stats={todayStats.data} hasError={!!todayStats.error} />
      </View>

      <SectionTitle title="Last customers" actionLabel="See all" onAction={() => router.navigate("/admin/customers")} />
      {customers.length > 0 ? (
        <ListCard className="mx-4">
          {customers.map((customer) => (
            <CustomerRow
              key={customer.user_id}
              userId={customer.user_id}
              points={customer.points}
              profile={customer.profile}
            />
          ))}
        </ListCard>
      ) : (
        !recentCustomers.isLoading && (
          <EmptyState icon="people-outline" title="No customers yet" message="Scan a customer's code to add them." />
        )
      )}
    </Screen>
  )
}
