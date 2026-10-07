import { Image, Text, View } from "react-native"

type Props = {
  name: string
  imageUrl: string
  subtitle?: string
}

export const StoreHeader = ({ name, imageUrl, subtitle }: Props) => (
  <View className="flex-row items-center rounded-xl bg-white p-4 shadow-sm">
    <Image source={{ uri: imageUrl }} className="h-16 w-16 rounded-full bg-gray-100" />
    <View className="ml-4 flex-1">
      <Text className="text-xl font-bold text-gray-900">{name}</Text>
      {subtitle && <Text className="text-sm text-gray-500">{subtitle}</Text>}
    </View>
  </View>
)
