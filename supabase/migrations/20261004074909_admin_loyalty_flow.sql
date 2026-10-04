-- Admin driven loyalty flow: the store owner gives rewards, customers only read.

-- Customer email on profiles, so the admin can recognise customers
alter table public.profiles add column email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- True when the signed in user owns the store
create or replace function public.is_store_owner(p_store_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1 from public.stores
    where id = p_store_id and owner_id = (select auth.uid())
  );
end;
$$;

-- Purchase count for "Buy N get 1" rewards
create table public.reward_progress (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  user_id uuid not null references public.profiles (id) on update cascade on delete cascade,
  reward_id uuid not null references public.rewards (id) on update cascade on delete cascade,
  store_id uuid not null references public.stores (id) on update cascade on delete cascade,
  purchases integer not null default 0 check (purchases >= 0),
  constraint unique_reward_progress unique (user_id, reward_id)
);

-- user_rewards is now the log of rewards given, a reward can be given many times
alter table public.user_rewards drop constraint unique_user_reward;
alter table public.user_rewards alter column status set default 'used';

-- Row level security
alter table public.rewards enable row level security;
alter table public.user_stores enable row level security;
alter table public.history enable row level security;
alter table public.user_rewards enable row level security;
alter table public.reward_progress enable row level security;

-- profiles: no more public read, no self update (a user could make himself admin)
drop policy "Public profiles are viewable by everyone." on public.profiles;
drop policy "Users can update own profile." on public.profiles;

create policy "Users can view their own profile"
on public.profiles
as permissive
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Store owners can view their customers profiles"
on public.profiles
as permissive
for select
to authenticated
using (
  exists (
    select 1 from public.user_stores us
    where us.user_id = profiles.id and public.is_store_owner(us.store_id)
  )
);

-- stores
drop policy "Enable insert for authenticated users only" on public.stores;

create policy "Admins can create their own store"
on public.stores
as permissive
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  )
);

create policy "Owners can update their store"
on public.stores
as permissive
for update
to authenticated
using (owner_id = (select auth.uid()));

-- rewards
create policy "Signed in users can view rewards"
on public.rewards
as permissive
for select
to authenticated
using (true);

create policy "Store owners can create rewards"
on public.rewards
as permissive
for insert
to authenticated
with check (public.is_store_owner(store_id));

create policy "Store owners can update rewards"
on public.rewards
as permissive
for update
to authenticated
using (public.is_store_owner(store_id));

create policy "Store owners can delete rewards"
on public.rewards
as permissive
for delete
to authenticated
using (public.is_store_owner(store_id));

-- user_stores: points only change through functions
create policy "Customers and store owners can view memberships"
on public.user_stores
as permissive
for select
to authenticated
using (user_id = (select auth.uid()) or public.is_store_owner(store_id));

create policy "Store owners can add customers"
on public.user_stores
as permissive
for insert
to authenticated
with check (public.is_store_owner(store_id) and points = 0);

-- history, user_rewards, reward_progress: read only, written by functions
create policy "Customers and store owners can view history"
on public.history
as permissive
for select
to authenticated
using (user_id = (select auth.uid()) or public.is_store_owner(store_id));

create policy "Customers and store owners can view given rewards"
on public.user_rewards
as permissive
for select
to authenticated
using (user_id = (select auth.uid()) or public.is_store_owner(store_id));

create policy "Customers and store owners can view reward progress"
on public.reward_progress
as permissive
for select
to authenticated
using (user_id = (select auth.uid()) or public.is_store_owner(store_id));

-- Award or deduct points, only by the store owner
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
    v_new_points := v_current_points + p_transaction_amount;
  else
    v_new_points := v_current_points - p_transaction_amount;
  end if;

  if v_new_points < 0 then
    raise exception 'Not enough points, the customer has % points', v_current_points;
  end if;

  update public.user_stores
  set points = v_new_points
  where user_id = p_user_id and store_id = p_store_id;

  insert into public.history (user_id, store_id, transaction_amount, previous_points, new_points, operation_type)
  values (p_user_id, p_store_id, p_transaction_amount, v_current_points, v_new_points, p_operation_type);

  return json_build_object('previous_points', v_current_points, 'new_points', v_new_points);
end;
$$;

-- Add one purchase on a "Buy N get 1" card
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

  insert into public.reward_progress (user_id, reward_id, store_id, purchases)
  values (p_user_id, p_reward_id, v_reward.store_id, 1)
  on conflict (user_id, reward_id)
  do update set
    purchases = least(public.reward_progress.purchases + 1, v_required),
    updated_at = now()
  returning purchases into v_purchases;

  return v_purchases;
end;
$$;

-- Give a reward: takes the points or resets the purchase card, then logs it
create or replace function public.give_reward(p_user_id uuid, p_reward_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reward public.rewards%rowtype;
  v_points integer;
  v_cost integer;
  v_required integer;
  v_purchases integer;
  v_user_reward_id uuid;
begin
  select * into v_reward from public.rewards where id = p_reward_id;

  if v_reward.id is null then
    raise exception 'Reward not found';
  end if;

  if not public.is_store_owner(v_reward.store_id) then
    raise exception 'Only the store owner can give rewards';
  end if;

  if v_reward.status <> 'active' then
    raise exception 'This reward is paused';
  end if;

  select points into v_points
  from public.user_stores
  where user_id = p_user_id and store_id = v_reward.store_id
  for update;

  if v_points is null then
    raise exception 'This customer is not part of your store';
  end if;

  if v_reward.cost_points then
    v_cost := (v_reward.config ->> 'points_needed_value')::integer;

    if v_points < v_cost then
      raise exception 'Not enough points: % of % needed', v_points, v_cost;
    end if;

    update public.user_stores
    set points = v_points - v_cost
    where user_id = p_user_id and store_id = v_reward.store_id;

    insert into public.history (user_id, store_id, transaction_amount, previous_points, new_points, operation_type)
    values (p_user_id, v_reward.store_id, v_cost, v_points, v_points - v_cost, 'reward_redemption');
  end if;

  if v_reward.type = 'BUY_N_GET_1' then
    v_required := (v_reward.config ->> 'required_purchases')::integer;

    select purchases into v_purchases
    from public.reward_progress
    where user_id = p_user_id and reward_id = p_reward_id
    for update;

    if coalesce(v_purchases, 0) < v_required then
      raise exception 'Only % of % purchases done', coalesce(v_purchases, 0), v_required;
    end if;

    update public.reward_progress
    set purchases = 0, updated_at = now()
    where user_id = p_user_id and reward_id = p_reward_id;
  end if;

  insert into public.user_rewards (user_id, reward_id, store_id, config, status)
  values (p_user_id, p_reward_id, v_reward.store_id, v_reward.config, 'used')
  returning id into v_user_reward_id;

  return v_user_reward_id;
end;
$$;

-- Numbers for the admin dashboard
create or replace function public.get_store_stats(p_store_id uuid)
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_store_owner(p_store_id) then
    raise exception 'Only the store owner can see these numbers';
  end if;

  return json_build_object(
    'customers', (select count(*) from public.user_stores where store_id = p_store_id),
    'points_given', (
      select coalesce(sum(transaction_amount), 0) from public.history
      where store_id = p_store_id and operation_type = 'add'
    ),
    'rewards_given', (select count(*) from public.user_rewards where store_id = p_store_id)
  );
end;
$$;

-- Replaced by add_purchase
drop function if exists public.increment_purchases_by_one(uuid);
