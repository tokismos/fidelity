import { CodeSheet } from "@/components/customer/CodeSheet"
import { WheelChancesSheet } from "@/components/customer/WheelChancesSheet"
import { WheelResultSheet, WheelWin } from "@/components/customer/WheelResultSheet"
import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { PrizeWheel, WheelLanding } from "@/components/PrizeWheel"
import { TestModeSwitch } from "@/components/TestModeSwitch"
import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { LinkText } from "@/components/ui/LinkText"
import { NavBar } from "@/components/ui/NavBar"
import { Screen } from "@/components/ui/Screen"
import { WHEEL_SPIN_DAYS } from "@/constants/wheel"
import { useAuth } from "@/hooks/useAuth"
import { useGetUserStores } from "@/hooks/useGetUserStores"
import { useGetWheelSlices } from "@/hooks/useGetWheelSlices"
import { useGetWheelSpins } from "@/hooks/useGetWheelSpins"
import { useNow } from "@/hooks/useNow"
import { useSpinWheel } from "@/hooks/useSpinWheel"
import { SpinResult, WheelSlice } from "@/types"
import { formatDuration } from "@/utils/time"
import { isWheelReady, nextSpinAt, spinWaitLabel } from "@/utils/wheel"
import * as Haptics from "expo-haptics"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Alert, useWindowDimensions, View } from "react-native"

// A sheet that is closing must be gone before the next one opens, or iOS does not show it
const SHEET_SWAP_MS = 350

const toWin = (result: SpinResult, slices: WheelSlice[]): WheelWin =>
  result.points !== null
    ? { kind: "points", points: result.points }
    : { kind: "reward", title: slices.find((slice) => slice.id === result.sliceId)?.reward?.title ?? "prize" }

export default function UserWheel() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>()
  const { userId } = useAuth()
  const { width } = useWindowDimensions()
  const now = useNow()

  const { data: userStores } = useGetUserStores()
  const slices = useGetWheelSlices({ storeId })
  const spins = useGetWheelSpins({ userId, storeId })
  const { spinWheel, isPending } = useSpinWheel()
  const [landing, setLanding] = useState<WheelLanding | null>(null)
  const [pendingWin, setPendingWin] = useState<WheelWin | null>(null)
  const [win, setWin] = useState<WheelWin | null>(null)
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [isChancesOpen, setIsChancesOpen] = useState(false)
  const [isCodeOpen, setIsCodeOpen] = useState(false)
  // Development only: spin again and again without the 3 day wait
  const [isTestMode, setIsTestMode] = useState(false)

  const storeName = userStores?.find((userStore) => userStore.store.id === storeId)?.store.name

  if (slices.isLoading || spins.isLoading) return <LoadingView />
  if (slices.error || spins.error) return <ErrorView message={(slices.error ?? spins.error)?.message} />

  const wheel = slices.data ?? []
  if (!isWheelReady(wheel)) {
    return (
      <Screen edges={["bottom"]}>
        <NavBar title="Prize wheel" subtitle={storeName} />
        <View className="flex-1 justify-center">
          <EmptyState icon="disc-outline" title="No prize wheel here yet" />
        </View>
      </Screen>
    )
  }

  const isSpinning = !!pendingWin
  const nextSpin = nextSpinAt(spins.data ?? [])
  const waitLabel = isTestMode ? null : spinWaitLabel(nextSpin, now)

  const showResult = (result: WheelWin) => {
    setWin(result)
    setIsResultOpen(true)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  // The result is shown once the wheel stops, not when the database answers
  const landed = () => {
    if (pendingWin) showResult(pendingWin)
    setPendingWin(null)
  }

  const spinErrorMessage = (message: string) => {
    if (!message.startsWith("You can spin again")) return "The wheel is not available right now."
    return nextSpin && nextSpin > now
      ? `You can spin again in ${formatDuration(nextSpin.getTime() - now.getTime())}.`
      : "You can spin again soon."
  }

  const spin = () =>
    spinWheel(
      { storeId, ignoreWait: isTestMode },
      {
        onSuccess: (result) => {
          if (!result) return
          const index = wheel.findIndex((slice) => slice.id === result.sliceId)
          // The wheel changed since it was loaded: show the result without turning to a wrong slice
          if (index < 0) {
            slices.refetch()
            showResult(toWin(result, wheel))
            return
          }
          setPendingWin(toWin(result, wheel))
          setLanding({ index })
        },
        onError: (error) => Alert.alert(spinErrorMessage(error.message)),
      },
    )

  const showCode = () => {
    setIsResultOpen(false)
    setTimeout(() => setIsCodeOpen(true), SHEET_SWAP_MS)
  }

  return (
    <Screen edges={["bottom"]}>
      <NavBar title="Prize wheel" subtitle={storeName} />
      <View className="flex-1 justify-center pb-5">
        <View className="items-center">
          <PrizeWheel slices={wheel} size={Math.min(width - 100, 300)} landing={landing} onLanded={landed} />
        </View>
        <View className="mx-4 mt-5 items-center">
          <Button
            title={isSpinning ? "Good luck" : (waitLabel ?? "Spin the wheel")}
            variant="rose"
            icon="disc-outline"
            isLoading={isPending}
            disabled={isSpinning || !!waitLabel}
            onPress={spin}
            className="self-stretch"
          />
          <AppText className="mt-[10px] text-center text-[14px] text-ink-2">
            One free spin every {WHEEL_SPIN_DAYS} days.
          </AppText>
          <View className="mt-1">
            <LinkText title="See the chances" tone="quiet" onPress={() => setIsChancesOpen(true)} />
          </View>
        </View>
      </View>
      {__DEV__ && <TestModeSwitch value={isTestMode} onChange={setIsTestMode} />}

      <WheelChancesSheet visible={isChancesOpen} onClose={() => setIsChancesOpen(false)} slices={wheel} />
      <WheelResultSheet
        visible={isResultOpen}
        win={win}
        storeName={storeName}
        onClose={() => setIsResultOpen(false)}
        onShowCode={showCode}
      />
      <CodeSheet visible={isCodeOpen} onClose={() => setIsCodeOpen(false)} storeName={storeName} />
    </Screen>
  )
}
