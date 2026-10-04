import { addPurchase } from "@/api/addPurchase"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddPurchase = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addPurchase,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.progress.all }),
  })

  return { addPurchase: mutation.mutate, ...mutation }
}
