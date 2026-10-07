import { addPurchase } from "@/api/addPurchase"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddPurchase = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addPurchase,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.progress.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.purchaseLog.all }),
      ]),
  })

  return { addPurchase: mutation.mutate, ...mutation }
}
