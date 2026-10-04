import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { Text, View } from "react-native"

// Accounts that only exist in the local Supabase database
const TEST_ACCOUNTS = {
  admin: { email: "admin@test.com", password: "password123" },
  user: { email: "user@test.com", password: "password123" },
}

type Props = {
  isLoading: boolean
  onLogin: (credentials: { email: string; password: string }) => void
}

export const DevLoginButtons = ({ isLoading, onLogin }: Props) => {
  if (!__DEV__) return null

  return (
    <View className="mt-6 border-t border-gray-200 pt-6">
      <Text className="mb-3 text-center text-sm text-gray-500">Test accounts</Text>
      <ButtonWithIndicator isLoading={isLoading} title="Log in as admin" onPress={() => onLogin(TEST_ACCOUNTS.admin)} />
      <ButtonWithIndicator isLoading={isLoading} title="Log in as user" onPress={() => onLogin(TEST_ACCOUNTS.user)} />
    </View>
  )
}
