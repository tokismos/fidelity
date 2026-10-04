import { colors } from "@/constants/colors"
import { UserStoreWithStore } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { Image, Pressable, Text, View } from "react-native"

type Props = {
  userStore: UserStoreWithStore
}

export const StoreCard = ({ userStore: { store, points } }: Props) => (
  <Link href={{ pathname: "/user/store/[storeId]", params: { storeId: store.id } }} asChild>
    <Pressable className="mb-3 flex-row items-center rounded-xl bg-white p-4 shadow-sm">
      <Image source={{ uri: store.image_url }} className="h-14 w-14 rounded-full bg-gray-100" />
      <View className="ml-3 flex-1">
        <Text className="text-lg font-semibold text-gray-900">{store.name}</Text>
        <Text className="text-blue-600">{points} points</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  </Link>
)
