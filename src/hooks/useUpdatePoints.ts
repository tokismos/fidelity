import { updatePoints } from "@/api/updatePoints"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdatePoints = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updatePoints,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.userStores.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.history.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.store.all }),
      ]),
  })

  return { updatePoints: mutation.mutate, ...mutation }
}
