import { removePurchase } from "@/api/removePurchase"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useRemovePurchase = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: removePurchase,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.progress.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.purchaseLog.all }),
      ]),
  })

  return { removePurchase: mutation.mutate, ...mutation }
}
