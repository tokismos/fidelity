import { AppText } from "@/components/ui/AppText"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { NavBar } from "@/components/ui/NavBar"
import { Screen } from "@/components/ui/Screen"
import { Tile } from "@/components/ui/Tile"
import { REWARD_TYPE_INFO, REWARD_TYPE_ORDER } from "@/constants/rewardTypes"
import { router } from "expo-router"
import { View } from "react-native"

export default function NewReward() {
  return (
    <View className="flex-1 bg-ground">
      <NavBar title="New reward" backIcon="close" inset="modal" />
      <Screen scroll edges={["bottom"]}>
        <AppText weight="bold" className="mx-5 mb-4 mt-2 text-[20px]">
          What do you want to give?
        </AppText>
        <ListCard className="mx-4">
          {REWARD_TYPE_ORDER.map((type) => (
            <ListRow
              key={type}
              title={REWARD_TYPE_INFO[type].title}
              subtitle={REWARD_TYPE_INFO[type].description}
              leading={<Tile icon={REWARD_TYPE_INFO[type].icon} />}
              showChevron
              onPress={() => router.push({ pathname: "/admin/upsert", params: { type } })}
            />
          ))}
        </ListCard>
      </Screen>
    </View>
  )
}
