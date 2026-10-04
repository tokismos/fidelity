-- Return the dashboard numbers as columns, so the app gets exact types
drop function public.get_store_stats(uuid);

create function public.get_store_stats(p_store_id uuid)
returns table (customers integer, points_given integer, rewards_given integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_store_owner(p_store_id) then
    raise exception 'Only the store owner can see these numbers';
  end if;

  return query
  select
    (select count(*)::integer from public.user_stores where store_id = p_store_id),
    (
      select coalesce(sum(transaction_amount), 0)::integer from public.history
      where store_id = p_store_id and operation_type = 'add'
    ),
    (select count(*)::integer from public.user_rewards where store_id = p_store_id);
end;
$$;
