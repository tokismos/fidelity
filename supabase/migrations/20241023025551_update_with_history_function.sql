create type "public"."operation_type" as enum ('add', 'subtract', 'reward_redemption');

create table "public"."history" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "store_id" uuid not null,
    "operation_type" operation_type not null,
    "previous_points" integer not null,
    "new_points" integer not null,
    "transaction_amount" integer not null
);


CREATE UNIQUE INDEX history_pkey ON public.history USING btree (id);

alter table "public"."history" add constraint "history_pkey" PRIMARY KEY using index "history_pkey";

alter table "public"."history" add constraint "history_store_id_fkey" FOREIGN KEY (store_id) REFERENCES stores(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."history" validate constraint "history_store_id_fkey";

alter table "public"."history" add constraint "history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."history" validate constraint "history_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_points_with_history(p_user_id uuid, p_store_id uuid, p_transaction_amount integer, p_operation_type operation_type)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  v_current_points integer;
  v_new_points integer;
begin

  -- Get current points (or initialize if not exists)
  select points into v_current_points
  from user_stores
  where user_id = p_user_id and store_id = p_store_id;

  -- Calculate new points based on operation type
  case p_operation_type
    when 'add' then
      v_new_points := v_current_points + p_transaction_amount;
    when 'subtract' then
      v_new_points := v_current_points - p_transaction_amount;
    when 'reward_redemption' then
      v_new_points := v_current_points - p_transaction_amount;
    else
      raise exception 'Invalid operation type';
  end case;

  -- Validate new points value
  if v_new_points < 0 then
    raise exception 'Points cannot go below zero. Current: %, Amount: %', v_current_points, p_transaction_amount;
  end if;

  -- Update points in user_stores
  update user_stores
  set points = v_new_points
  where user_id = p_user_id and store_id = p_store_id;

  -- Insert record into history
  insert into history (
    user_id,
    store_id,
    transaction_amount,
    previous_points,
    new_points,
    operation_type
  ) values (
    p_user_id,
    p_store_id,
    p_transaction_amount,
    v_current_points,
    v_new_points,
    p_operation_type
  );

  -- Return the result
  return json_build_object(
    'success', true,
    'previous_points', v_current_points,
    'new_points', v_new_points,
    'transaction_amount', p_transaction_amount,
    'operation_type', p_operation_type
  );

exception
  when others then
    -- Roll back any changes if error occurs
    raise exception 'Transaction failed: %', sqlerrm;
end;$function$
;

grant delete on table "public"."history" to "anon";

grant insert on table "public"."history" to "anon";

grant references on table "public"."history" to "anon";

grant select on table "public"."history" to "anon";

grant trigger on table "public"."history" to "anon";

grant truncate on table "public"."history" to "anon";

grant update on table "public"."history" to "anon";

grant delete on table "public"."history" to "authenticated";

grant insert on table "public"."history" to "authenticated";

grant references on table "public"."history" to "authenticated";

grant select on table "public"."history" to "authenticated";

grant trigger on table "public"."history" to "authenticated";

grant truncate on table "public"."history" to "authenticated";

grant update on table "public"."history" to "authenticated";

grant delete on table "public"."history" to "service_role";

grant insert on table "public"."history" to "service_role";

grant references on table "public"."history" to "service_role";

grant select on table "public"."history" to "service_role";

grant trigger on table "public"."history" to "service_role";

grant truncate on table "public"."history" to "service_role";

grant update on table "public"."history" to "service_role";