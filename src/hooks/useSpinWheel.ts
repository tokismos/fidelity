import { spinWheel } from "@/api/spinWheel"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useSpinWheel = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: spinWheel,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.wheelSpins.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.userStores.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.history.all }),
      ]),
  })

  return { spinWheel: mutation.mutate, ...mutation }
}
