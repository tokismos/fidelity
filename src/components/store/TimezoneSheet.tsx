import { SearchField } from "@/components/SearchField"
import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { Sheet } from "@/components/ui/Sheet"
import { Tile } from "@/components/ui/Tile"
import { colors } from "@/constants/colors"
import { useUpdateStore } from "@/hooks/useUpdateStore"
import { deviceTimeZone } from "@/utils/time"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useMemo, useState } from "react"
import { Alert, ScrollView, View } from "react-native"

type Props = {
  visible: boolean
  onClose: () => void
  // The store's saved time zone
  timeZone: string
}

// Used when the phone cannot list every time zone
const COMMON_TIME_ZONES = [
  "UTC",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/New_York",
  "America/Sao_Paulo",
  "America/Toronto",
  "America/Vancouver",
  "Asia/Dubai",
  "Asia/Hong_Kong",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Europe/Berlin",
  "Europe/Istanbul",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Paris",
  "Europe/Rome",
  "Pacific/Auckland",
]

// Rows shown at once. Searching finds the others.
const MAX_ROWS = 60

const allTimeZones = () =>
  typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : COMMON_TIME_ZONES

// "America/New_York" -> "America/New York"
const readable = (timeZone: string) => timeZone.replace(/_/g, " ")

// Picks the time zone used for promotion times and today's numbers
export const TimezoneSheet = ({ visible, onClose, timeZone }: Props) => {
  const [search, setSearch] = useState("")
  const { updateStore, isPending } = useUpdateStore()
  const zones = useMemo(allTimeZones, [])
  const phoneZone = deviceTimeZone()

  useEffect(() => {
    if (visible) setSearch("")
  }, [visible])

  const query = search.trim().toLowerCase().replace(/\s+/g, "_")
  const matches = (query ? zones.filter((zone) => zone.toLowerCase().includes(query)) : zones).slice(0, MAX_ROWS)

  const choose = (zone: string) => {
    if (isPending) return
    if (zone === timeZone) return onClose()

    updateStore(
      { timezone: zone },
      {
        onSuccess: onClose,
        onError: (error) => Alert.alert("Could not save the time zone", error.message),
      },
    )
  }

  const check = (zone: string) =>
    zone === timeZone ? <Ionicons name="checkmark" size={22} color={colors.ink} /> : undefined

  return (
    <Sheet visible={visible} onClose={onClose} title="Time zone">
      <ListCard>
        <ListRow
          title="Use this phone's time zone"
          subtitle={readable(phoneZone)}
          leading={<Tile icon="phone-portrait-outline" />}
          trailing={check(phoneZone)}
          onPress={() => choose(phoneZone)}
        />
      </ListCard>

      <View className="mb-3 mt-4">
        <SearchField value={search} onChangeText={setSearch} placeholder="Search a city" />
      </View>

      <Card className="h-[264px]">
        <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {matches.length === 0 ? (
            <AppText className="px-4 py-6 text-center text-ink-2">No time zone found.</AppText>
          ) : (
            matches.map((zone, index) => (
              <View key={zone}>
                {index > 0 && <View className="h-px bg-ground" />}
                <ListRow title={readable(zone)} trailing={check(zone)} onPress={() => choose(zone)} />
              </View>
            ))
          )}
        </ScrollView>
      </Card>
    </Sheet>
  )
}
