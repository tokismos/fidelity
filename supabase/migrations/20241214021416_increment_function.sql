alter table "public"."rewards" alter column "description" set not null;

alter table "public"."user_rewards" add column "store_id" uuid not null;

CREATE UNIQUE INDEX unique_user_reward ON public.user_rewards USING btree (user_id, reward_id);

alter table "public"."user_rewards" add constraint "unique_user_reward" UNIQUE using index "unique_user_reward";

alter table "public"."user_rewards" add constraint "user_rewards_store_id_fkey" FOREIGN KEY (store_id) REFERENCES stores(id) not valid;

alter table "public"."user_rewards" validate constraint "user_rewards_store_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.increment_purchases_by_one(reward_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  update user_rewards
  set config =
      jsonb_set(
        config,
        '{nbr_of_purchases}',
        (coalesce((config->'nbr_of_purchases')::int, 0) + 1)::text::jsonb
      )
  where id = $1;
end;$function$
;
