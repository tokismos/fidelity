import { giveWheelPrize } from "@/api/giveWheelPrize"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useGiveWheelPrize = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: giveWheelPrize,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.wheelSpins.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.givenRewards.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.store.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.todayStats.all }),
      ]),
  })

  return { giveWheelPrize: mutation.mutate, ...mutation }
}
