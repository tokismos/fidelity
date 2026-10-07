import { StoreCustomer } from "@/types"
import { formatDate } from "@/utils/rewards"
import { initials } from "@/utils/text"
import { Href, Link } from "expo-router"
import { Pressable, Text, View } from "react-native"

type Props = {
  customer: StoreCustomer
  href: Href
}

export const CustomerListItem = ({ customer, href }: Props) => (
  <Link href={href} asChild>
    <Pressable className="mb-2 flex-row items-center rounded-2xl border border-gray-200 bg-white p-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-100">
        <Text className="text-sm font-extrabold text-primary-700">{initials(customer.profile?.email)}</Text>
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-semibold text-gray-900" numberOfLines={1}>
          {customer.profile?.email ?? "Customer"}
        </Text>
        <Text className="text-xs text-gray-500">Since {formatDate(customer.created_at).split(",")[0]}</Text>
      </View>
      <Text className="font-extrabold text-primary-700">{customer.points} pts</Text>
    </Pressable>
  </Link>
)
