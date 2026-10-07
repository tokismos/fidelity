-- Double points promotions: points added during a promotion are multiplied

create extension if not exists btree_gist with schema extensions;

-- Time zone of the store, saved once from the admin's phone (e.g. America/Toronto)
alter table public.stores add column timezone text;

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  store_id uuid not null references public.stores (id) on update cascade on delete cascade,
  multiplier integer not null check (multiplier in (2, 3)),
  starts_at timestamp with time zone not null,
  ends_at timestamp with time zone not null,
  constraint promotion_ends_after_start check (ends_at > starts_at),
  -- Two promotions of the same store can't overlap
  constraint promotions_no_overlap exclude using gist (
    store_id with =,
    tstzrange(starts_at, ends_at) with &&
  )
);

alter table public.promotions enable row level security;

create policy "Signed in users can view promotions"
on public.promotions
as permissive
for select
to authenticated
using (true);

create policy "Store owners can create promotions"
on public.promotions
as permissive
for insert
to authenticated
with check (public.is_store_owner(store_id));

-- Multiplier used for each points line
alter table public.history add column multiplier integer not null default 1;

-- Add or remove points. Added points are multiplied during a promotion.
create or replace function public.update_points_with_history(
  p_user_id uuid,
  p_store_id uuid,
  p_transaction_amount integer,
  p_operation_type public.operation_type
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_current_points integer;
  v_new_points integer;
  v_multiplier integer := 1;
  v_amount integer;
begin
  if not public.is_store_owner(p_store_id) then
    raise exception 'Only the store owner can change points';
  end if;

  if p_operation_type not in ('add', 'subtract') then
    raise exception 'Invalid operation type';
  end if;

  if p_transaction_amount <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;

  select points into v_current_points
  from public.user_stores
  where user_id = p_user_id and store_id = p_store_id
  for update;

  if v_current_points is null then
    raise exception 'This customer is not part of your store';
  end if;

  if p_operation_type = 'add' then
    select multiplier into v_multiplier
    from public.promotions
    where store_id = p_store_id and starts_at <= now() and ends_at > now();

    v_multiplier := coalesce(v_multiplier, 1);
    v_amount := p_transaction_amount * v_multiplier;
    v_new_points := v_current_points + v_amount;
  else
    v_amount := p_transaction_amount;
    v_new_points := v_current_points - v_amount;
  end if;

  if v_new_points < 0 then
    raise exception 'Not enough points, the customer has % points', v_current_points;
  end if;

  update public.user_stores
  set points = v_new_points
  where user_id = p_user_id and store_id = p_store_id;

  insert into public.history (user_id, store_id, transaction_amount, previous_points, new_points, operation_type, multiplier)
  values (p_user_id, p_store_id, v_amount, v_current_points, v_new_points, p_operation_type, v_multiplier);

  return json_build_object(
    'previous_points', v_current_points,
    'new_points', v_new_points,
    'amount', v_amount,
    'multiplier', v_multiplier
  );
end;
$$;

-- Stop a promotion: an upcoming one is removed, a running one ends now
create or replace function public.end_promotion(p_promotion_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_promotion public.promotions%rowtype;
begin
  select * into v_promotion from public.promotions where id = p_promotion_id;

  if v_promotion.id is null then
    raise exception 'Promotion not found';
  end if;

  if not public.is_store_owner(v_promotion.store_id) then
    raise exception 'Only the store owner can stop a promotion';
  end if;

  if v_promotion.ends_at <= now() then
    raise exception 'This promotion is already over';
  end if;

  if v_promotion.starts_at > now() then
    delete from public.promotions where id = p_promotion_id;
  else
    update public.promotions set ends_at = now() where id = p_promotion_id;
  end if;
end;
$$;
