import { setStoreTimezone } from "@/api/setStoreTimezone"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useSetStoreTimezone = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: setStoreTimezone,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.store.all }),
  })

  return { setStoreTimezone: mutation.mutate, ...mutation }
}
