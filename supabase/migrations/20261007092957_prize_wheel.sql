-- Prize wheel: a customer spins once every 3 days per store. The prize is picked here, never on the phone.

-- Points won on the wheel are saved in the history with their own operation type
alter type public.operation_type add value if not exists 'wheel_bonus';

-- Slices of a store's wheel. A slice gives points or a reward.
create table public.wheel_slices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  store_id uuid not null references public.stores (id) on update cascade on delete cascade,
  points integer check (points > 0),
  reward_id uuid references public.rewards (id) on update cascade on delete cascade,
  -- Chance compared to the other slices: a slice with 10 comes twice as often as one with 5
  weight integer not null check (weight between 1 and 1000),
  -- Most wins of this slice per 7 days in the store, null means no limit
  weekly_limit integer check (weekly_limit > 0),
  constraint wheel_slice_one_prize check ((points is null) <> (reward_id is null))
);

alter table public.wheel_slices enable row level security;

create policy "Signed in users can view wheel slices"
on public.wheel_slices
as permissive
for select
to authenticated
using (true);

create policy "Store owners can add wheel slices"
on public.wheel_slices
as permissive
for insert
to authenticated
with check (
  public.is_store_owner(store_id)
  and (
    reward_id is null
    or exists (select 1 from public.rewards r where r.id = reward_id and r.store_id = wheel_slices.store_id)
  )
);

create policy "Store owners can remove wheel slices"
on public.wheel_slices
as permissive
for delete
to authenticated
using (public.is_store_owner(store_id));

-- Every spin. A reward prize waits until the store owner gives it (given_at).
create table public.wheel_spins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null references public.profiles (id) on update cascade on delete cascade,
  store_id uuid not null references public.stores (id) on update cascade on delete cascade,
  slice_id uuid references public.wheel_slices (id) on update cascade on delete set null,
  points integer,
  reward_id uuid references public.rewards (id) on update cascade on delete set null,
  given_at timestamp with time zone
);

create index wheel_spins_user_store_idx on public.wheel_spins (user_id, store_id, created_at desc);
create index wheel_spins_slice_idx on public.wheel_spins (slice_id, created_at desc);

alter table public.wheel_spins enable row level security;

create policy "Customers and store owners can view spins"
on public.wheel_spins
as permissive
for select
to authenticated
using (user_id = (select auth.uid()) or public.is_store_owner(store_id));

-- Rewards given from a wheel prize cost no points
alter table public.user_rewards add column from_wheel boolean not null default false;

-- Spin the wheel of a store for the signed in customer
create or replace function public.spin_wheel(p_store_id uuid)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_points integer;
  v_last_spin timestamp with time zone;
  v_slice_id uuid;
  v_slice_points integer;
  v_slice_reward_id uuid;
  v_spin_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not signed in';
  end if;

  -- One spin at a time per store, so two taps or two customers can't pass the checks together
  perform 1 from public.stores where id = p_store_id for update;

  select points into v_points
  from public.user_stores
  where user_id = v_user_id and store_id = p_store_id
  for update;

  if v_points is null then
    raise exception 'You are not a member of this store';
  end if;

  select max(created_at) into v_last_spin
  from public.wheel_spins
  where user_id = v_user_id and store_id = p_store_id;

  if v_last_spin is not null and v_last_spin > now() - interval '3 days' then
    raise exception 'You can spin again on %', to_char(v_last_spin + interval '3 days', 'YYYY-MM-DD HH24:MI UTC');
  end if;

  -- Slices that can be won right now: reward active, one time reward not received yet, weekly limit not reached.
  -- A number from 0 to the total weight is drawn, the slice whose running total passes it wins.
  with open_slices as (
    select s.id, s.created_at, s.points, s.reward_id, s.weight
    from public.wheel_slices s
    left join public.rewards r on r.id = s.reward_id
    where s.store_id = p_store_id
      and (s.reward_id is null or (r.status = 'active' and not public.is_one_time_reward_used(v_user_id, s.reward_id)))
      -- A one time reward already won and waiting to be given can't be won again
      and not exists (
        select 1 from public.wheel_spins w
        where w.user_id = v_user_id and w.reward_id = s.reward_id and w.given_at is null and r.is_one_time
      )
      and (
        s.weekly_limit is null
        or (
          select count(*) from public.wheel_spins w
          where w.slice_id = s.id and w.created_at > now() - interval '7 days'
        ) < s.weekly_limit
      )
  ),
  draw as (
    select floor(random() * sum(weight))::integer as pick from open_slices
  ),
  running as (
    select o.*, sum(o.weight) over (order by o.created_at, o.id) as running_total from open_slices o
  )
  select running.id, running.points, running.reward_id into v_slice_id, v_slice_points, v_slice_reward_id
  from running, draw
  where running.running_total > draw.pick
  order by running.running_total
  limit 1;

  if v_slice_id is null then
    raise exception 'The wheel is not available right now';
  end if;

  if v_slice_points is not null then
    update public.user_stores
    set points = v_points + v_slice_points
    where user_id = v_user_id and store_id = p_store_id;

    insert into public.history (user_id, store_id, transaction_amount, previous_points, new_points, operation_type)
    values (v_user_id, p_store_id, v_slice_points, v_points, v_points + v_slice_points, 'wheel_bonus');
  end if;

  insert into public.wheel_spins (user_id, store_id, slice_id, points, reward_id)
  values (v_user_id, p_store_id, v_slice_id, v_slice_points, v_slice_reward_id)
  returning id into v_spin_id;

  return json_build_object(
    'spin_id', v_spin_id,
    'slice_id', v_slice_id,
    'points', v_slice_points,
    'reward_id', v_slice_reward_id
  );
end;
$$;

-- The store owner gives a reward won on the wheel. It costs no points.
create or replace function public.give_wheel_prize(p_spin_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_spin public.wheel_spins%rowtype;
  v_reward public.rewards%rowtype;
  v_user_reward_id uuid;
begin
  select * into v_spin from public.wheel_spins where id = p_spin_id for update;

  if v_spin.id is null then
    raise exception 'Prize not found';
  end if;

  if not public.is_store_owner(v_spin.store_id) then
    raise exception 'Only the store owner can give a prize';
  end if;

  if v_spin.reward_id is null then
    raise exception 'This spin did not win a reward';
  end if;

  if v_spin.given_at is not null then
    raise exception 'This prize was already given';
  end if;

  select * into v_reward from public.rewards where id = v_spin.reward_id;

  if public.is_one_time_reward_used(v_spin.user_id, v_reward.id) then
    raise exception 'This one time reward was already given to this customer';
  end if;

  insert into public.user_rewards (user_id, reward_id, store_id, config, status, from_wheel)
  values (v_spin.user_id, v_reward.id, v_spin.store_id, v_reward.config, 'used', true)
  returning id into v_user_reward_id;

  update public.wheel_spins set given_at = now() where id = p_spin_id;

  return v_user_reward_id;
end;
$$;
