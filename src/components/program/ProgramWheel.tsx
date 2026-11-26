import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { PrizeWheel } from "@/components/PrizeWheel"
import { SliceSheet } from "@/components/program/SliceSheet"
import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ListCard } from "@/components/ui/ListCard"
import { ListRow } from "@/components/ui/ListRow"
import { Screen } from "@/components/ui/Screen"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { WHEEL_MAX_SLICES, WHEEL_MIN_SLICES } from "@/constants/wheel"
import { useGetWheelSlices } from "@/hooks/useGetWheelSlices"
import { WheelSlice } from "@/types"
import { sliceName } from "@/utils/program"
import { isWheelReady, sliceChance, sliceColor } from "@/utils/wheel"
import { useState } from "react"
import { RefreshControl, View } from "react-native"

type Props = {
  storeId: string
}

// Light slice colors (sun soft, sunk, rose soft) get a thin ring so the dot stands out on white
const LIGHT_COLOR_INDEXES = [1, 3, 5]

// The prize wheel preview and its slices
export const ProgramWheel = ({ storeId }: Props) => {
  const slices = useGetWheelSlices({ storeId })
  const [selected, setSelected] = useState<WheelSlice | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  if (slices.isLoading) return <LoadingView />
  if (slices.error) return <ErrorView message={slices.error.message} />

  const wheel = slices.data ?? []
  const isFull = wheel.length >= WHEEL_MAX_SLICES
  const missing = WHEEL_MIN_SLICES - wheel.length

  const open = (slice: WheelSlice | null) => {
    setSelected(slice)
    setIsSheetOpen(true)
  }

  return (
    <Screen
      scroll
      refreshControl={<RefreshControl refreshing={slices.isRefetching} onRefresh={() => void slices.refetch()} />}
      footer={
        <Button
          title={isFull ? "The wheel is full" : "Add a slice"}
          icon={isFull ? undefined : "add"}
          disabled={isFull}
          onPress={() => open(null)}
        />
      }
    >
      <Card className="mx-4 mt-[14px] p-[14px]">
        {isWheelReady(wheel) ? (
          <View className="items-center">
            <PrizeWheel slices={wheel} size={190} landing={null} />
          </View>
        ) : (
          <AppText className="py-6 text-center text-ink-2">
            {`Add ${missing}${wheel.length > 0 ? " more" : ""} ${missing === 1 ? "slice" : "slices"} to show the wheel to customers.`}
          </AppText>
        )}
      </Card>

      {wheel.length > 0 && (
        <>
          <SectionTitle title="Slices" />
          <ListCard className="mx-4">
            {wheel.map((slice, index) => (
              <ListRow
                key={slice.id}
                title={sliceName(slice)}
                leading={
                  <View
                    className={`mx-[2px] h-[14px] w-[14px] rounded-full ${
                      LIGHT_COLOR_INDEXES.includes(index) ? "border-[1.5px] border-line-2" : ""
                    }`}
                    style={{ backgroundColor: sliceColor(index) }}
                  />
                }
                trailing={
                  <AppText weight="bold" tabular className="text-[16px]">
                    {sliceChance(slice, wheel)}
                  </AppText>
                }
                showChevron
                onPress={() => open(slice)}
              />
            ))}
          </ListCard>
        </>
      )}

      <SliceSheet visible={isSheetOpen} onClose={() => setIsSheetOpen(false)} storeId={storeId} slice={selected} />
    </Screen>
  )
}
