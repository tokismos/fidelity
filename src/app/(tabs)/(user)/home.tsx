import StoreGrid from "@/components/StoreGrid"
import { useGetUserStores } from "@/hooks/useGetUserStores"

import { View, Text } from "react-native"

export default function User() {
  const { userStores, isLoading, error } = useGetUserStores()

  if (isLoading) {
    return <Text className="text-center text-lg">Loading...</Text>
  }

  if (error) {
    return <Text>{error.message}</Text>
  }

  return (
    <View className="flex-1 ">
      <StoreGrid userStores={userStores ?? null} />
    </View>
  )
}
