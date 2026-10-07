-- Log of purchases added or removed on "Buy N get 1" cards
create table public.purchase_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null references public.profiles (id) on update cascade on delete cascade,
  reward_id uuid not null references public.rewards (id) on update cascade on delete cascade,
  store_id uuid not null references public.stores (id) on update cascade on delete cascade,
  change integer not null check (change in (1, -1))
);

alter table public.purchase_log enable row level security;

create policy "Customers and store owners can view purchases"
on public.purchase_log
as permissive
for select
to authenticated
using (user_id = (select auth.uid()) or public.is_store_owner(store_id));

-- Add one purchase, refused when the card is already full
create or replace function public.add_purchase(p_user_id uuid, p_reward_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reward public.rewards%rowtype;
  v_required integer;
  v_purchases integer;
begin
  select * into v_reward from public.rewards where id = p_reward_id;

  if v_reward.id is null then
    raise exception 'Reward not found';
  end if;

  if not public.is_store_owner(v_reward.store_id) then
    raise exception 'Only the store owner can add purchases';
  end if;

  if v_reward.type <> 'BUY_N_GET_1' then
    raise exception 'Purchases can only be added to a Buy N get 1 reward';
  end if;

  if v_reward.status <> 'active' then
    raise exception 'This reward is paused';
  end if;

  if not exists (
    select 1 from public.user_stores
    where user_id = p_user_id and store_id = v_reward.store_id
  ) then
    raise exception 'This customer is not part of your store';
  end if;

  v_required := (v_reward.config ->> 'required_purchases')::integer;

  select purchases into v_purchases
  from public.reward_progress
  where user_id = p_user_id and reward_id = p_reward_id
  for update;

  if coalesce(v_purchases, 0) >= v_required then
    raise exception 'The card is full, give the free item first';
  end if;

  insert into public.reward_progress (user_id, reward_id, store_id, purchases)
  values (p_user_id, p_reward_id, v_reward.store_id, 1)
  on conflict (user_id, reward_id)
  do update set purchases = public.reward_progress.purchases + 1, updated_at = now()
  returning purchases into v_purchases;

  insert into public.purchase_log (user_id, reward_id, store_id, change)
  values (p_user_id, p_reward_id, v_reward.store_id, 1);

  return v_purchases;
end;
$$;

-- Remove one purchase added by mistake
create or replace function public.remove_purchase(p_user_id uuid, p_reward_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reward public.rewards%rowtype;
  v_purchases integer;
begin
  select * into v_reward from public.rewards where id = p_reward_id;

  if v_reward.id is null then
    raise exception 'Reward not found';
  end if;

  if not public.is_store_owner(v_reward.store_id) then
    raise exception 'Only the store owner can remove purchases';
  end if;

  if v_reward.type <> 'BUY_N_GET_1' then
    raise exception 'Purchases can only be removed from a Buy N get 1 reward';
  end if;

  select purchases into v_purchases
  from public.reward_progress
  where user_id = p_user_id and reward_id = p_reward_id
  for update;

  if coalesce(v_purchases, 0) = 0 then
    raise exception 'There is no purchase to remove';
  end if;

  update public.reward_progress
  set purchases = purchases - 1, updated_at = now()
  where user_id = p_user_id and reward_id = p_reward_id
  returning purchases into v_purchases;

  insert into public.purchase_log (user_id, reward_id, store_id, change)
  values (p_user_id, p_reward_id, v_reward.store_id, -1);

  return v_purchases;
end;
$$;
