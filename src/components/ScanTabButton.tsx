import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { Pressable, Text, View } from "react-native"

// The raised center button of the admin tab bar
export const ScanTabButton = () => (
  <View className="flex-1 items-center">
    <Link href="/admin/scanner" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Scan a customer"
        className="-mt-7 h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-primary-600 shadow-md"
      >
        <Ionicons name="scan-outline" size={30} color={colors.white} />
      </Pressable>
    </Link>
    <Text className="mt-1 text-[10px] font-semibold text-gray-500">Scan</Text>
  </View>
)
