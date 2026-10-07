import { endPromotion } from "@/api/endPromotion"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useEndPromotion = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: endPromotion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.promotions.all }),
  })

  return { endPromotion: mutation.mutate, ...mutation }
}
