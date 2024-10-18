import React from "react"
import { View, Text } from "react-native"
import { FlashList } from "@shopify/flash-list"

type Store = {
  id: string
  name: string
}

type UserStore = {
  id: string
  points: number
  store: Store
}

type StoreGridProps = {
  userStores: UserStore[] | null
}

const StoreCard = ({ store, points }: Omit<UserStore, "id">) => {
  return (
    <View className="m-2 flex-1 rounded-lg bg-white p-4 shadow-lg">
      <Text className="mb-2 text-xl font-bold">{store.name}</Text>
      <Text className="text-gray-600">Points: {points}</Text>
    </View>
  )
}
const StoreGrid = ({ userStores }: StoreGridProps) => {
  const renderItem = React.useCallback(
    ({ item }: { item: UserStore }) => <StoreCard store={item.store} points={item.points} />,
    [],
  )

  return (
    <FlashList
      data={userStores}
      ListEmptyComponent={() => <Text>NO STORES</Text>}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      estimatedItemSize={100}
    />
  )
}

export default StoreGrid
