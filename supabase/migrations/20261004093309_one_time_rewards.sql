-- A reward is reusable (can be earned again) or one time per customer
alter table public.rewards add column is_one_time boolean not null default false;

-- True when a one time reward was already given to this customer
create or replace function public.is_one_time_reward_used(p_user_id uuid, p_reward_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Not signed in';
  end if;

  return exists (
    select 1 from public.rewards r
    join public.user_rewards ur on ur.reward_id = r.id
    where r.id = p_reward_id and r.is_one_time and ur.user_id = p_user_id
  );
end;
$$;

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

  if public.is_one_time_reward_used(p_user_id, p_reward_id) then
    raise exception 'This one time reward was already given to this customer';
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

  if public.is_one_time_reward_used(p_user_id, p_reward_id) then
    raise exception 'This one time reward was already given to this customer';
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
