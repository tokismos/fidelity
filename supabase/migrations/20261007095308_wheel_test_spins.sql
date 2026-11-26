-- Test mode for the prize wheel: unlimited spins, only where the database allows it.
-- The function gets a new parameter, so the old version is removed first.

drop function public.spin_wheel(uuid);

-- Spin the wheel of a store for the signed in customer.
-- p_ignore_wait skips the 3 day wait, only on a database where app.test_spins is on (local, set in seed.sql).
create function public.spin_wheel(p_store_id uuid, p_ignore_wait boolean default false)
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

  if p_ignore_wait and coalesce(current_setting('app.test_spins', true), '') <> 'on' then
    raise exception 'Test spins are only allowed on a local database';
  end if;

  select max(created_at) into v_last_spin
  from public.wheel_spins
  where user_id = v_user_id and store_id = p_store_id;

  if not p_ignore_wait and v_last_spin is not null and v_last_spin > now() - interval '3 days' then
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
