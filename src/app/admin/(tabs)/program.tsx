import { CreateStoreFirst } from "@/components/CreateStoreFirst"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { ProgramPromotions } from "@/components/program/ProgramPromotions"
import { ProgramRewards } from "@/components/program/ProgramRewards"
import { ProgramWheel } from "@/components/program/ProgramWheel"
import { LargeTitle } from "@/components/ui/LargeTitle"
import { Segmented } from "@/components/ui/Segmented"
import { useGetStore } from "@/hooks/useGetStore"
import { deviceTimeZone } from "@/utils/time"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { View } from "react-native"

type ProgramTab = "rewards" | "promotions" | "wheel"

const TABS: { value: ProgramTab; label: string }[] = [
  { value: "rewards", label: "Rewards" },
  { value: "promotions", label: "Promotions" },
  { value: "wheel", label: "Wheel" },
]

const toTab = (value: string | undefined): ProgramTab => TABS.find((tab) => tab.value === value)?.value ?? "rewards"

export default function Program() {
  const params = useLocalSearchParams<{ tab?: string }>()
  const [tab, setTab] = useState<ProgramTab>(() => toTab(params.tab))
  const store = useGetStore()

  // Another screen can open a part, e.g. /admin/program?tab=promotions.
  // The param is cleared after use, so the same link works again next time.
  useEffect(() => {
    if (!params.tab) return
    setTab(toTab(params.tab))
    router.setParams({ tab: undefined })
  }, [params.tab])

  const content = () => {
    if (store.isLoading) return <LoadingView />
    if (store.error) return <ErrorView message={store.error.message} />
    if (!store.data) return <CreateStoreFirst />

    const timeZone = store.data.timezone ?? deviceTimeZone()
    switch (tab) {
      case "rewards":
        return <ProgramRewards storeId={store.data.id} />
      case "promotions":
        return <ProgramPromotions storeId={store.data.id} timeZone={timeZone} />
      case "wheel":
        return <ProgramWheel storeId={store.data.id} />
    }
  }

  return (
    <View className="flex-1 bg-ground">
      <LargeTitle title="Program" />
      {store.data && (
        <View className="mx-4 mt-3">
          <Segmented options={TABS} value={tab} onChange={setTab} />
        </View>
      )}
      {content()}
    </View>
  )
}
