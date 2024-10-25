
create type "public"."reward_status" as enum ('active', 'paused');

create type "public"."reward_types" as enum ('BUY_N_GET_1', 'DISCOUNT_PERCENTAGE', 'DISCOUNT_FIX', 'FREE_ITEM', 'FREE_ITEM_WITH_PURCHASE');

drop policy "Enable insert for authenticated users only" on "public"."rewards";

drop policy "Enable read access for all users" on "public"."rewards";

alter table "public"."rewards" drop constraint "rewards_store_id_fkey";

alter table "public"."rewards" drop constraint "rewards_store_id_fkey1";

alter table "public"."rewards" drop constraint "rewards_pkey";

drop index if exists "public"."rewards_pkey";

alter table "public"."rewards" drop column "points_cost";

alter table "public"."rewards" add column "config" jsonb not null;

alter table "public"."rewards" add column "cost_points" boolean not null;

alter table "public"."rewards" add column "status" reward_status not null;

alter table "public"."rewards" add column "type" reward_types not null;

CREATE UNIQUE INDEX reward_pkey ON public.rewards USING btree (id);

alter table "public"."rewards" add constraint "reward_pkey" PRIMARY KEY using index "reward_pkey";

alter table "public"."rewards" add constraint "reward_store_id_fkey" FOREIGN KEY (store_id) REFERENCES stores(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."rewards" validate constraint "reward_store_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_cost_points_required_types()
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN ARRAY['FREE_ITEM', 'DISCOUNT_PERCENTAGE' ,'DISCOUNT_FIX'];
END;
$function$
;

CREATE OR REPLACE FUNCTION public.validate_numeric_value(key text, value numeric)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    CASE key
        WHEN 'required_purchases' THEN
            IF value <= 0 OR value != trunc(value) THEN
                RAISE EXCEPTION 'required_purchases must be a positive integer';
            END IF;
        WHEN 'discount_percentage' THEN
            IF value <= 0 OR value > 100 THEN
                RAISE EXCEPTION 'discount_percentage must be between 0 and 100';
            END IF;
        WHEN 'discount_amount' THEN
            IF value <= 0 THEN
                RAISE EXCEPTION 'discount_amount must be greater than 0';
            END IF;
        WHEN 'points_needed_value' THEN
            IF value <= 0 OR value != trunc(value) THEN
                RAISE EXCEPTION 'points_needed_value must be a positive integer';
            END IF;
    END CASE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.validate_reward_config()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
    allowed_keys text[];
    config_keys text[];
    base_key_map jsonb;
    key text;
    value_type text;
BEGIN

IF NEW.type::text IN (SELECT unnest(get_cost_points_required_types())) THEN
    IF NOT NEW.cost_points THEN
        RAISE EXCEPTION 'cost_points must be true for reward type: %', NEW.type;
    END IF;
ELSE
    IF NEW.cost_points THEN
        RAISE EXCEPTION 'cost_points must be false for reward type: %', NEW.type;
    END IF;
END IF;

    -- ADD NEW REWARD TYPES AND THEIR KEY HERE
    base_key_map := jsonb_build_object(
        'BUY_N_GET_1', jsonb_build_array('required_purchases'),
        'DISCOUNT_PERCENTAGE', jsonb_build_array('discount_percentage'),
        'DISCOUNT_FIX', jsonb_build_array('discount_amount'),
        'FREE_ITEM', jsonb_build_array('item_name'),
        'FREE_ITEM_WITH_PURCHASE', jsonb_build_array('item_name', 'free_item_name')
    );

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

CREATE OR REPLACE FUNCTION public.validate_string_value(key text, value text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF length(value) = 0 THEN
        RAISE EXCEPTION 'The value for key % cannot be empty', key;
    END IF;
    -- Add any additional string validation rules here
END;
$function$
;

CREATE TRIGGER validate_reward_config_trigger BEFORE INSERT OR UPDATE ON public.rewards FOR EACH ROW EXECUTE FUNCTION validate_reward_config();