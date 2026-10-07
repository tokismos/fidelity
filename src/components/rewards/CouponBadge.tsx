import { Text, View } from "react-native"

type Props = {
  value: string
  caption: string
}

export const CouponBadge = ({ value, caption }: Props) => (
  <View className="items-center rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50 px-6 py-5">
    <Text className="text-5xl font-extrabold text-primary-700">{value}</Text>
    <Text className="mt-1 text-gray-600">{caption}</Text>
  </View>
)
