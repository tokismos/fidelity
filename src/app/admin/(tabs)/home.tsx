import { CreateStoreForm } from "@/components/CreateStoreForm"
import { CustomerListItem } from "@/components/CustomerListItem"
import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { StoreDashboardHeader } from "@/components/StoreDashboardHeader"
import { useAddStore } from "@/hooks/useAddStore"
import { useGetStore } from "@/hooks/useGetStore"
import { useGetStoreCustomers } from "@/hooks/useGetStoreCustomers"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useGetStoreStats } from "@/hooks/useGetStoreStats"
import { useNow } from "@/hooks/useNow"
import { useSetStoreTimezone } from "@/hooks/useSetStoreTimezone"
import { activePromotion, nextPromotion } from "@/utils/promotions"
import { deviceTimeZone } from "@/utils/time"
import { FlashList } from "@shopify/flash-list"
import { useEffect, useState } from "react"
import { Alert, ScrollView } from "react-native"

export default function AdminHome() {
  const [search, setSearch] = useState("")
  const store = useGetStore()
  const stats = useGetStoreStats({ storeId: store.data?.id })
  const customers = useGetStoreCustomers({ storeId: store.data?.id })
  const { addStore, isPending } = useAddStore()
  const { setStoreTimezone } = useSetStoreTimezone()
  const now = useNow()
  const promotions = useGetPromotions({ storeIds: store.data ? [store.data.id] : [] })

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
      <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
        <CreateStoreForm
          isPending={isPending}
          onSubmit={(newStore) =>
            addStore(newStore, { onError: (error) => Alert.alert("Could not create the store", error.message) })
          }
        />
      </ScrollView>
    )
  }

  const query = search.trim().toLowerCase()
  const visibleCustomers = (customers.data ?? []).filter((customer) =>
    (customer.profile?.email ?? "").toLowerCase().includes(query),
  )

  const refresh = () => Promise.all([stats.refetch(), customers.refetch()])

  return (
    <FlashList
      className="bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={visibleCustomers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CustomerListItem
          customer={item}
          href={{ pathname: "/admin/customer/[userId]", params: { userId: item.user_id } }}
        />
      )}
      ListHeaderComponent={
        <StoreDashboardHeader
          store={store.data}
          stats={stats.data}
          search={search}
          onSearchChange={setSearch}
          promotion={
            activePromotion(promotions.data ?? [], store.data.id, now) ??
            nextPromotion(promotions.data ?? [], store.data.id, now)
          }
          now={now}
          timeZone={store.data.timezone ?? deviceTimeZone()}
        />
      }
      ListEmptyComponent={
        customers.isLoading ? null : (
          <EmptyState
            icon="people-outline"
            title={query ? "No customer found" : "No customers yet"}
            message={query ? "Try another email." : "Scan a customer's QR code to add them to your store."}
          />
        )
      }
      onRefresh={refresh}
      refreshing={stats.isRefetching || customers.isRefetching}
    />
  )
}
