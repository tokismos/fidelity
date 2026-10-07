import { setRewardStatus } from "@/api/setRewardStatus"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useSetRewardStatus = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: setRewardStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rewards.all }),
  })

  return { setRewardStatus: mutation.mutate, ...mutation }
}
