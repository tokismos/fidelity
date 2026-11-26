import { EmptyState } from "@/components/EmptyState"
import { Button } from "@/components/ui/Button"
import { router } from "expo-router"
import { View } from "react-native"

// Shown on owner tabs that need a store, before the owner has created one
export const CreateStoreFirst = () => (
  <View className="flex-1 justify-center px-4">
    <EmptyState icon="storefront-outline" title="Create your store first" />
    <Button title="Create my store" onPress={() => router.navigate("/admin/home")} />
  </View>
)
