import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { useState } from "react"
import { View } from "react-native"

// Accounts that only exist in the local Supabase database
const TEST_ACCOUNTS = {
  admin: { email: "admin@test.com", password: "password123" },
  user: { email: "user@test.com", password: "password123" },
}

type Account = keyof typeof TEST_ACCOUNTS

type Props = {
  // True while the main sign in button is working
  disabled: boolean
  onLogin: (credentials: { email: string; password: string }) => Promise<void>
}

export const DevLoginButtons = ({ disabled, onLogin }: Props) => {
  const [pending, setPending] = useState<Account | null>(null)

  if (!__DEV__) return null

  const logIn = async (account: Account) => {
    setPending(account)
    await onLogin(TEST_ACCOUNTS[account])
    setPending(null)
  }

  return (
    <View className="mt-8 gap-[10px]">
      <AppText weight="bold" className="text-center text-[13px] text-ink-3">
        Test accounts
      </AppText>
      <Button
        variant="line"
        title="Log in as admin"
        isLoading={pending === "admin"}
        disabled={disabled || pending !== null}
        onPress={() => logIn("admin")}
      />
      <Button
        variant="line"
        title="Log in as user"
        isLoading={pending === "user"}
        disabled={disabled || pending !== null}
        onPress={() => logIn("user")}
      />
    </View>
  )
}
