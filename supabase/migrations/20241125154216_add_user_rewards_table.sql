
create type "public"."user_reward_status" as enum ('redeemed', 'canceled', 'used');

create table "public"."user_rewards" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "reward_id" uuid not null,
    "config" jsonb not null,
    "status" user_reward_status not null default 'redeemed'::user_reward_status
);


CREATE UNIQUE INDEX user_rewards_pkey ON public.user_rewards USING btree (id);

alter table "public"."user_rewards" add constraint "user_rewards_pkey" PRIMARY KEY using index "user_rewards_pkey";

alter table "public"."user_rewards" add constraint "user_rewards_reward_id_fkey" FOREIGN KEY (reward_id) REFERENCES rewards(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_rewards" validate constraint "user_rewards_reward_id_fkey";

alter table "public"."user_rewards" add constraint "user_rewards_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_rewards" validate constraint "user_rewards_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.validate_reward_config()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    allowed_keys text[];
    config_keys text[];
    base_key_map jsonb;
    key text;
    value_type text;
    numeric_value numeric;

BEGIN

    NEW.cost_points := NEW.type::text = ANY(get_cost_points_required_types());


    -- ADD NEW REWARD TYPES AND THEIR KEY HERE
    base_key_map := jsonb_build_object(
        'BUY_N_GET_1', jsonb_build_array('required_purchases','image_path'),
        'DISCOUNT_PERCENTAGE', jsonb_build_array('discount_percentage'),
        'DISCOUNT_FIX', jsonb_build_array('discount_amount'),
        'FREE_ITEM', jsonb_build_array('item_name'),
        'FREE_ITEM_WITH_PURCHASE', jsonb_build_array('item_name', 'free_item_name')
    );

    -- Validate basic structure
    IF NEW.config IS NULL THEN
        RAISE EXCEPTION 'Config cannot be null';
    END IF;


    -- Get allowed and config keys
    allowed_keys := ARRAY(
        SELECT jsonb_array_elements_text(base_key_map -> NEW.type::text)
    );
    config_keys := ARRAY(
        SELECT jsonb_object_keys(NEW.config)
    );

    -- Handle points_needed_value field
    IF NEW.cost_points = true THEN
        allowed_keys := array_append(allowed_keys, 'points_needed_value');
    END IF;

    -- Verify if the config keys are allowed
    IF NOT (config_keys <@ allowed_keys) THEN
        RAISE EXCEPTION 'Invalid keys in config. Allowed keys for % are: %',
            NEW.type, array_to_string(allowed_keys, ', ');
    END IF;

    -- To see if all required keys are present in the config obj
    IF NOT (allowed_keys <@ config_keys) THEN
        RAISE EXCEPTION 'Missing required keys in config for %: %',
            NEW.type, array_to_string(allowed_keys, ', ');
    END IF;

    -- ADD HERE THE KEYS THAT SHOULD BE NUMERIC
    FOREACH key IN ARRAY config_keys LOOP
        value_type := jsonb_typeof(NEW.config -> key);

        IF key IN ('required_purchases', 'discount_percentage', 'discount_amount', 'points_needed_value') THEN
            IF value_type != 'number' THEN
                RAISE EXCEPTION 'The value for key % must be a number', key;
            END IF;
            -- Call numeric validation function
            PERFORM validate_numeric_value(key, (NEW.config ->> key)::numeric);
        ELSE
            IF value_type != 'string' THEN
                RAISE EXCEPTION 'The value for key % must be a string', key;
            END IF;
            -- Call string validation function
            PERFORM validate_string_value(key, NEW.config ->> key);
        END IF;
    END LOOP;

    RETURN NEW;
END;$function$
;

grant delete on table "public"."user_rewards" to "anon";

grant insert on table "public"."user_rewards" to "anon";

grant references on table "public"."user_rewards" to "anon";

grant select on table "public"."user_rewards" to "anon";

grant trigger on table "public"."user_rewards" to "anon";

grant truncate on table "public"."user_rewards" to "anon";

grant update on table "public"."user_rewards" to "anon";

grant delete on table "public"."user_rewards" to "authenticated";

grant insert on table "public"."user_rewards" to "authenticated";

grant references on table "public"."user_rewards" to "authenticated";

grant select on table "public"."user_rewards" to "authenticated";

grant trigger on table "public"."user_rewards" to "authenticated";

grant truncate on table "public"."user_rewards" to "authenticated";

grant update on table "public"."user_rewards" to "authenticated";

grant delete on table "public"."user_rewards" to "service_role";

grant insert on table "public"."user_rewards" to "service_role";

grant references on table "public"."user_rewards" to "service_role";

grant select on table "public"."user_rewards" to "service_role";

grant trigger on table "public"."user_rewards" to "service_role";

grant truncate on table "public"."user_rewards" to "service_role";

grant update on table "public"."user_rewards" to "service_role";
