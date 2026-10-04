import { deleteReward } from "@/api/deleteReward"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteReward = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteReward,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rewards.all }),
  })

  return { deleteReward: mutation.mutate, ...mutation }
}
