-- A store's wheel has at most 8 slices (WHEEL_MAX_SLICES in the app)
create or replace function public.check_wheel_slice_count()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_count integer;
begin
  -- One insert at a time per store, so two adds at once can't pass the count together
  perform 1 from public.stores where id = new.store_id for update;

  select count(*) into v_count from public.wheel_slices where store_id = new.store_id;

  if v_count >= 8 then
    raise exception 'A wheel can have at most 8 slices';
  end if;

  return new;
end;
$$;

create trigger wheel_slice_count_trigger
before insert on public.wheel_slices
for each row execute function public.check_wheel_slice_count();
