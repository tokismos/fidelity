-- Store owners can edit a slice of their wheel, with the same checks as adding one
create policy "Store owners can update wheel slices"
on public.wheel_slices
as permissive
for update
to authenticated
using (public.is_store_owner(store_id))
with check (
  public.is_store_owner(store_id)
  and (
    reward_id is null
    or exists (select 1 from public.rewards r where r.id = reward_id and r.store_id = wheel_slices.store_id)
  )
);
