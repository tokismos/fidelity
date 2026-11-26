import { CreateStoreFirst } from "@/components/CreateStoreFirst"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { StoreEditSheet } from "@/components/store/StoreEditSheet"
import { StoreProfileRow } from "@/components/store/StoreProfileRow"
import { TimezoneSheet } from "@/components/store/TimezoneSheet"
import { Button } from "@/components/ui/Button"
import { LargeTitle } from "@/components/ui/LargeTitle"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { Screen } from "@/components/ui/Screen"
import { Tile } from "@/components/ui/Tile"
import { useAuth } from "@/hooks/useAuth"
import { useGetStore } from "@/hooks/useGetStore"
import { supabase } from "@/utils/supabase"
import { deviceTimeZone } from "@/utils/time"
import { useState } from "react"
import { Alert, View } from "react-native"

type OpenSheet = "edit" | "timezone" | null

const confirmSignOut = () =>
  Alert.alert("Log out", "Do you want to log out?", [
    { text: "Cancel", style: "cancel" },
    { text: "Log out", style: "destructive", onPress: () => supabase.auth.signOut() },
  ])

export default function Store() {
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null)
  const { email } = useAuth()
  const store = useGetStore()

  if (store.isLoading) return <LoadingView />
  if (store.error) return <ErrorView message={store.error.message} />
  if (!store.data) {
    return (
      <Screen>
        <LargeTitle title="Store" />
        <CreateStoreFirst />
      </Screen>
    )
  }

  const timeZone = store.data.timezone ?? deviceTimeZone()
  const closeSheet = () => setOpenSheet(null)

  return (
    <Screen scroll>
      <LargeTitle title="Store" />

      <View className="mx-4 mt-[14px]">
        <StoreProfileRow name={store.data.name} imageUrl={store.data.image_url} onPress={() => setOpenSheet("edit")} />
      </View>

      <ListCard className="mx-4 mt-4">
        <ListRow
          title="Time zone"
          subtitle={timeZone.replace(/_/g, " ")}
          leading={<Tile icon="globe-outline" />}
          showChevron
          onPress={() => setOpenSheet("timezone")}
        />
        <ListRow title={email ?? ""} subtitle="Store owner" leading={<Tile icon="mail-outline" />} />
      </ListCard>

      <View className="mx-4 mt-7">
        <Button title="Log out" variant="danger" icon="log-out-outline" onPress={confirmSignOut} />
      </View>

      <StoreEditSheet visible={openSheet === "edit"} onClose={closeSheet} store={store.data} />
      <TimezoneSheet visible={openSheet === "timezone"} onClose={closeSheet} timeZone={timeZone} />
    </Screen>
  )
}
