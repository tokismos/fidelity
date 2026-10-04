-- Reward picture is optional and allowed for every reward type
create or replace function public.validate_reward_config()
returns trigger
language plpgsql
as $$
declare
  v_required_keys text[];
  v_allowed_keys text[];
  v_config_keys text[];
  v_key_map jsonb;
  v_key text;
  v_value_type text;
begin
  new.cost_points := new.type::text = any(public.get_cost_points_required_types());

  -- Required keys for each reward type
  v_key_map := jsonb_build_object(
    'BUY_N_GET_1', jsonb_build_array('required_purchases'),
    'DISCOUNT_PERCENTAGE', jsonb_build_array('discount_percentage'),
    'DISCOUNT_FIX', jsonb_build_array('discount_amount'),
    'FREE_ITEM', jsonb_build_array('item_name'),
    'FREE_ITEM_WITH_PURCHASE', jsonb_build_array('item_name', 'free_item_name')
  );

  if new.config is null then
    raise exception 'Config cannot be null';
  end if;

  v_required_keys := array(select jsonb_array_elements_text(v_key_map -> new.type::text));
  v_config_keys := array(select jsonb_object_keys(new.config));

  if new.cost_points then
    v_required_keys := array_append(v_required_keys, 'points_needed_value');
  end if;

  v_allowed_keys := array_append(v_required_keys, 'image_path');

  if not (v_config_keys <@ v_allowed_keys) then
    raise exception 'Invalid keys in config. Allowed keys for % are: %',
      new.type, array_to_string(v_allowed_keys, ', ');
  end if;

  if not (v_required_keys <@ v_config_keys) then
    raise exception 'Missing required keys in config for %: %',
      new.type, array_to_string(v_required_keys, ', ');
  end if;

  foreach v_key in array v_config_keys loop
    v_value_type := jsonb_typeof(new.config -> v_key);

    if v_key in ('required_purchases', 'discount_percentage', 'discount_amount', 'points_needed_value') then
      if v_value_type != 'number' then
        raise exception 'The value for key % must be a number', v_key;
      end if;
      perform public.validate_numeric_value(v_key, (new.config ->> v_key)::numeric);
    else
      if v_value_type != 'string' then
        raise exception 'The value for key % must be a string', v_key;
      end if;
      perform public.validate_string_value(v_key, new.config ->> v_key);
    end if;
  end loop;

  return new;
end;
$$;
