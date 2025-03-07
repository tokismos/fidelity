import { ActivityIndicator, View, Text, Pressable } from "react-native"

type Props = { isLoading: boolean; title: string; onPress: () => void }

export const ButtonWithIndicator = ({ isLoading, title, onPress }: Props) => (
  <Pressable onPress={onPress} className={`mb-4 w-full rounded-lg bg-blue-600 py-3`} disabled={isLoading}>
    {isLoading ? (
      <View className="flex-row items-center justify-center">
        <ActivityIndicator size="small" color="#ffffff" />
        <Text className="ml-2 text-center text-lg font-semibold text-white">Loading...</Text>
      </View>
    ) : (
      <Text className="text-center text-lg font-semibold text-white">{title}</Text>
    )}
  </Pressable>
)
