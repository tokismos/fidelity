import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { NewPromotionSheet } from "@/components/program/NewPromotionSheet"
import { PastPromotionsSheet } from "@/components/program/PastPromotionsSheet"
import { PromotionActionsSheet } from "@/components/program/PromotionActionsSheet"
import { RunningPromotionCard } from "@/components/program/RunningPromotionCard"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ListRow } from "@/components/ui/ListRow"
import { Screen } from "@/components/ui/Screen"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { Tile } from "@/components/ui/Tile"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useNow } from "@/hooks/useNow"
import { Promotion } from "@/types"
import { dayAndTime } from "@/utils/program"
import { activePromotion, multiplierName, nextPromotion, promotionStatus } from "@/utils/promotions"
import { useState } from "react"
import { RefreshControl } from "react-native"

type Props = {
  storeId: string
  timeZone: string
}

type OpenSheet = "actions" | "past" | "new" | null

// The running promotion, the next one and a link to the past ones
export const ProgramPromotions = ({ storeId, timeZone }: Props) => {
  const now = useNow()
  const promotions = useGetPromotions({ storeIds: [storeId] })
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null)
  const [selected, setSelected] = useState<Promotion | null>(null)

  if (promotions.isLoading) return <LoadingView />
  if (promotions.error) return <ErrorView message={promotions.error.message} />

  const all = promotions.data ?? []
  const running = activePromotion(all, storeId, now)
  const next = nextPromotion(all, storeId, now)
  const past = all
    .filter((promotion) => promotionStatus(promotion, now) === "ended")
    .sort((a, b) => b.ends_at.localeCompare(a.ends_at))

  const openActions = (promotion: Promotion) => {
    setSelected(promotion)
    setOpenSheet("actions")
  }
  const close = () => setOpenSheet(null)

  return (
    <Screen
      scroll
      refreshControl={
        <RefreshControl refreshing={promotions.isRefetching} onRefresh={() => void promotions.refetch()} />
      }
      footer={<Button title="New promotion" icon="add" onPress={() => setOpenSheet("new")} />}
    >
      {!running && !next && (
        <EmptyState
          icon="flash-outline"
          title="No promotion right now"
          message="Start one to give double or triple points."
        />
      )}

      {running && (
        <RunningPromotionCard promotion={running} now={now} timeZone={timeZone} onPress={() => openActions(running)} />
      )}

      {next && (
        <>
          <SectionTitle title="Coming next" />
          <Card className="mx-4">
            <ListRow
              title={multiplierName(next.multiplier)}
              subtitle={dayAndTime(new Date(next.starts_at), now, timeZone)}
              leading={<Tile icon="calendar-outline" />}
              showChevron
              onPress={() => openActions(next)}
            />
          </Card>
        </>
      )}

      {past.length > 0 && (
        <Card className="mx-4 mt-3">
          <ListRow title="Past promotions" showChevron onPress={() => setOpenSheet("past")} />
        </Card>
      )}

      <PromotionActionsSheet
        visible={openSheet === "actions"}
        onClose={close}
        promotion={selected}
        now={now}
        timeZone={timeZone}
      />
      <PastPromotionsSheet
        visible={openSheet === "past"}
        onClose={close}
        promotions={past}
        now={now}
        timeZone={timeZone}
      />
      <NewPromotionSheet
        visible={openSheet === "new"}
        onClose={close}
        storeId={storeId}
        timeZone={timeZone}
        busyUntil={running ? new Date(running.ends_at) : null}
      />
    </Screen>
  )
}
