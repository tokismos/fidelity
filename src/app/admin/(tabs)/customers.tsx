import { CreateStoreFirst } from "@/components/CreateStoreFirst"
import { CustomerRow } from "@/components/CustomerRow"
import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { SearchField } from "@/components/SearchField"
import { LargeTitle } from "@/components/ui/LargeTitle"
import { Screen } from "@/components/ui/Screen"
import { colors } from "@/constants/colors"
import { useGetRewards } from "@/hooks/useGetRewards"
import { useGetStore } from "@/hooks/useGetStore"
import { useGetStoreCustomers } from "@/hooks/useGetStoreCustomers"
import { customerName } from "@/utils/text"
import { FlashList } from "@shopify/flash-list"
import { useState } from "react"
import { RefreshControl, View } from "react-native"

export default function Customers() {
  const [search, setSearch] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const store = useGetStore()
  const storeId = store.data?.id
  const customers = useGetStoreCustomers({ storeId })
  const rewards = useGetRewards({ storeId, activeOnly: true })

  if (store.isLoading) return <LoadingView />
  if (store.error) return <ErrorView message={store.error.message} />
  if (!store.data) {
    return (
      <Screen>
        <LargeTitle title="Customers" />
        <CreateStoreFirst />
      </Screen>
    )
  }

  // The cheapest reward paid with points: a customer with at least this many points can get something.
  // One time rewards are left out, the customer may already have received them.
  const costs = (rewards.data ?? []).flatMap((reward) =>
    !reward.is_one_time && "points_needed_value" in reward.config ? [reward.config.points_needed_value] : [],
  )
  const cheapest = costs.length > 0 ? Math.min(...costs) : null

  const all = customers.data ?? []
  const query = search.trim().toLowerCase()
  const visible = query
    ? all.filter(
        (customer) =>
          customerName(customer.profile).toLowerCase().includes(query) ||
          (customer.profile?.email ?? "").toLowerCase().includes(query),
      )
    : all

  const refresh = async () => {
    setIsRefreshing(true)
    await Promise.all([customers.refetch(), rewards.refetch()])
    setIsRefreshing(false)
  }

  return (
    <Screen>
      <LargeTitle
        title="Customers"
        subtitle={customers.data ? `${all.length} in ${store.data.name}` : store.data.name}
      />
      <View className="mx-4 mb-[18px] mt-[14px]">
        <SearchField value={search} onChangeText={setSearch} placeholder="Name or email" />
      </View>

      {customers.isLoading ? (
        <LoadingView />
      ) : customers.error ? (
        <ErrorView message={customers.error.message} />
      ) : (
        <FlashList
          data={visible}
          extraData={cheapest}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.ink3} />}
          renderItem={({ item, index }) => (
            <View
              className={`mx-4 overflow-hidden bg-surface ${index === 0 ? "rounded-t-[18px]" : "border-t border-ground"} ${
                index === visible.length - 1 ? "rounded-b-[18px]" : ""
              }`}
            >
              <CustomerRow
                userId={item.user_id}
                points={item.points}
                profile={item.profile}
                canAfford={cheapest !== null && item.points >= cheapest}
              />
            </View>
          )}
          ListEmptyComponent={
            query ? (
              <EmptyState icon="search-outline" title="No customer found" message="Try another name or email." />
            ) : (
              <EmptyState
                icon="people-outline"
                title="No customers yet"
                message="Scan a customer's code to add them."
              />
            )
          }
        />
      )}
    </Screen>
  )
}
