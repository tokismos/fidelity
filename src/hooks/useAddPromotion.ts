import { addPromotion } from "@/api/addPromotion"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddPromotion = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addPromotion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.promotions.all }),
  })

  return { addPromotion: mutation.mutate, ...mutation }
}
