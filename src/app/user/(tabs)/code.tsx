import { QrCode } from "@/components/QrCode"
import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { LargeTitle } from "@/components/ui/LargeTitle"
import { LinkText } from "@/components/ui/LinkText"
import { Screen } from "@/components/ui/Screen"
import { useAuth } from "@/hooks/useAuth"
import { useGetProfile } from "@/hooks/useGetProfile"
import { customerName } from "@/utils/text"
import { supabase } from "@/utils/supabase"
import { Alert, View } from "react-native"

export default function Code() {
  const { userId, email } = useAuth()
  const { data: profile } = useGetProfile()

  const confirmSignOut = () =>
    Alert.alert("Log out", "Do you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => supabase.auth.signOut() },
    ])

  return (
    <Screen>
      <LargeTitle title="My code" />
      <View className="flex-1 justify-center px-4">
        <Card className="items-center px-5 pb-[22px] pt-[26px]">
          {userId && <QrCode value={userId} size={220} />}
          <AppText weight="bold" numberOfLines={1} className="mt-4 text-center text-[18px]">
            {customerName(profile ?? { email })}
          </AppText>
          {email && (
            <AppText numberOfLines={1} className="text-center text-[13px] text-ink-2">
              {email}
            </AppText>
          )}
        </Card>
        <AppText className="mx-3 mt-4 text-center text-[14px] text-ink-2">
          Show this at the counter. One code works in every shop.
        </AppText>
      </View>
      <View className="pb-6">
        <LinkText title="Log out" tone="quiet" onPress={confirmSignOut} />
      </View>
    </Screen>
  )
}
