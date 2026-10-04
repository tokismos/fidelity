import { colors } from "@/constants/colors"
import { StoreCustomer } from "@/types"
import { formatDate } from "@/utils/rewards"
import { Ionicons } from "@expo/vector-icons"
import { Href, Link } from "expo-router"
import { Pressable, Text, View } from "react-native"

type Props = {
  customer: StoreCustomer
  href: Href
}

export const CustomerListItem = ({ customer, href }: Props) => (
  <Link href={href} asChild>
    <Pressable className="mb-2 flex-row items-center rounded-xl bg-white p-4 shadow-sm">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
        <Ionicons name="person" size={20} color={colors.primary} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-medium text-gray-900" numberOfLines={1}>
          {customer.profile?.email ?? "Customer"}
        </Text>
        <Text className="text-xs text-gray-500">Since {formatDate(customer.created_at)}</Text>
      </View>
      <Text className="font-bold text-blue-600">{customer.points} pts</Text>
    </Pressable>
  </Link>
)
