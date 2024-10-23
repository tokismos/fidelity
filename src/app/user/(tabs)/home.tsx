import StoresGrid from "@/components/StoresGrid"
import { useGetUserStores } from "@/hooks/useGetUserStores"

import { View, Text } from "react-native"

export default function User() {
  const { userStores, isLoading, error, refetch, isRefetching } = useGetUserStores()

  if (isLoading) {
    return <Text className="text-center text-lg">Loading...</Text>
  }

  if (error) {
    return <Text>{error.message}</Text>
  }

  return (
    <View className="flex-1 ">
      <StoresGrid userStores={userStores ?? null} isRefetching={isRefetching} onRefetch={refetch} />
    </View>
  )
}
