import { addCustomer } from "@/api/addCustomer"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddCustomer = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.userStores.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.store.all }),
      ]),
  })

  return { addCustomer: mutation.mutate, ...mutation }
}
