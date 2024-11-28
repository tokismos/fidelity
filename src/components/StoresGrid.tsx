import React from "react"
import { Text, Pressable } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { Link } from "expo-router"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { Id } from "@/types"

type Store = {
  id: string
  name: string
}

type UserStoreWithName = {
  id: Id
  points: number
  store: Store
}

type StoreGridProps = {
  userStores: UserStoreWithName[] | null
  isRefetching: boolean
  onRefetch: (options?: RefetchOptions) => Promise<QueryObserverResult<UserStoreWithName[] | null, Error>>
}

const StoreCard = ({ store, points }: Omit<UserStoreWithName, "id">) => {
  return (
    <Link href={`/user/${store.id}`} asChild>
      <Pressable className="m-2 flex-1 rounded-lg bg-white p-4 shadow-lg">
        <Text className="mb-2 text-xl font-bold">{store.name}</Text>
        <Text className="text-gray-600">Points: {points}</Text>
      </Pressable>
    </Link>
  )
}
const StoresGrid = ({ userStores, isRefetching = false, onRefetch }: StoreGridProps) => {
  const renderItem = React.useCallback(
    ({ item }: { item: UserStoreWithName }) => <StoreCard store={item.store} points={item.points} />,
    [],
  )

  return (
    <FlashList
      data={userStores}
      ListEmptyComponent={() => <Text>NO STORES</Text>}
      renderItem={renderItem}
      keyExtractor={(item) => item.id!}
      numColumns={2}
      estimatedItemSize={100}
      onRefresh={onRefetch}
      refreshing={isRefetching}
    />
  )
}

export default StoresGrid
