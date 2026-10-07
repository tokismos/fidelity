import { giveReward } from "@/api/giveReward"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useGiveReward = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: giveReward,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.userStores.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.history.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.progress.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.givenRewards.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.store.all }),
      ]),
  })

  return { giveReward: mutation.mutate, ...mutation }
}
