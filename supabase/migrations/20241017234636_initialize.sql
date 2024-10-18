create type "public"."role" as enum ('user', 'admin');

create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "role" role not null default 'user'::role
);


alter table "public"."profiles" enable row level security;

create table "public"."rewards" (
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "description" text,
    "points_cost" integer not null,
    "store_id" uuid not null,
    "id" uuid not null default gen_random_uuid()
);


create table "public"."stores" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "owner_id" uuid not null,
    "image_url" text not null default 'https://img.freepik.com/premium-vector/flat-icon-userprofile_941526-9219.jpg'::text
);


alter table "public"."stores" enable row level security;

create table "public"."user_stores" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "store_id" uuid not null,
    "points" integer not null default 0
);


CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX rewards_pkey ON public.rewards USING btree (id);

CREATE UNIQUE INDEX stores_pkey1 ON public.stores USING btree (id);

CREATE UNIQUE INDEX user_stores_pkey ON public.user_stores USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."rewards" add constraint "rewards_pkey" PRIMARY KEY using index "rewards_pkey";

alter table "public"."stores" add constraint "stores_pkey1" PRIMARY KEY using index "stores_pkey1";

alter table "public"."user_stores" add constraint "user_stores_pkey" PRIMARY KEY using index "user_stores_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."rewards" add constraint "rewards_store_id_fkey" FOREIGN KEY (store_id) REFERENCES stores(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."rewards" validate constraint "rewards_store_id_fkey";

alter table "public"."rewards" add constraint "rewards_store_id_fkey1" FOREIGN KEY (store_id) REFERENCES stores(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."rewards" validate constraint "rewards_store_id_fkey1";

alter table "public"."stores" add constraint "stores_owner_id_fkey1" FOREIGN KEY (owner_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."stores" validate constraint "stores_owner_id_fkey1";

alter table "public"."user_stores" add constraint "user_stores_store_id_fkey" FOREIGN KEY (store_id) REFERENCES stores(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_stores" validate constraint "user_stores_store_id_fkey";

alter table "public"."user_stores" add constraint "user_stores_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_stores" validate constraint "user_stores_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$function$
;

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."rewards" to "anon";

grant insert on table "public"."rewards" to "anon";

grant references on table "public"."rewards" to "anon";

grant select on table "public"."rewards" to "anon";

grant trigger on table "public"."rewards" to "anon";

grant truncate on table "public"."rewards" to "anon";

grant update on table "public"."rewards" to "anon";

grant delete on table "public"."rewards" to "authenticated";

grant insert on table "public"."rewards" to "authenticated";

grant references on table "public"."rewards" to "authenticated";

grant select on table "public"."rewards" to "authenticated";

grant trigger on table "public"."rewards" to "authenticated";

grant truncate on table "public"."rewards" to "authenticated";

grant update on table "public"."rewards" to "authenticated";

grant delete on table "public"."rewards" to "service_role";

grant insert on table "public"."rewards" to "service_role";

grant references on table "public"."rewards" to "service_role";

grant select on table "public"."rewards" to "service_role";

grant trigger on table "public"."rewards" to "service_role";

grant truncate on table "public"."rewards" to "service_role";

grant update on table "public"."rewards" to "service_role";

grant delete on table "public"."stores" to "anon";

grant insert on table "public"."stores" to "anon";

grant references on table "public"."stores" to "anon";

grant select on table "public"."stores" to "anon";

grant trigger on table "public"."stores" to "anon";

grant truncate on table "public"."stores" to "anon";

grant update on table "public"."stores" to "anon";

grant delete on table "public"."stores" to "authenticated";

grant insert on table "public"."stores" to "authenticated";

grant references on table "public"."stores" to "authenticated";

grant select on table "public"."stores" to "authenticated";

grant trigger on table "public"."stores" to "authenticated";

grant truncate on table "public"."stores" to "authenticated";

grant update on table "public"."stores" to "authenticated";

grant delete on table "public"."stores" to "service_role";

grant insert on table "public"."stores" to "service_role";

grant references on table "public"."stores" to "service_role";

grant select on table "public"."stores" to "service_role";

grant trigger on table "public"."stores" to "service_role";

grant truncate on table "public"."stores" to "service_role";

grant update on table "public"."stores" to "service_role";

grant delete on table "public"."user_stores" to "anon";

grant insert on table "public"."user_stores" to "anon";

grant references on table "public"."user_stores" to "anon";

grant select on table "public"."user_stores" to "anon";

grant trigger on table "public"."user_stores" to "anon";

grant truncate on table "public"."user_stores" to "anon";

grant update on table "public"."user_stores" to "anon";

grant delete on table "public"."user_stores" to "authenticated";

grant insert on table "public"."user_stores" to "authenticated";

grant references on table "public"."user_stores" to "authenticated";

grant select on table "public"."user_stores" to "authenticated";

grant trigger on table "public"."user_stores" to "authenticated";

grant truncate on table "public"."user_stores" to "authenticated";

grant update on table "public"."user_stores" to "authenticated";

grant delete on table "public"."user_stores" to "service_role";

grant insert on table "public"."user_stores" to "service_role";

grant references on table "public"."user_stores" to "service_role";

grant select on table "public"."user_stores" to "service_role";

grant trigger on table "public"."user_stores" to "service_role";

grant truncate on table "public"."user_stores" to "service_role";

grant update on table "public"."user_stores" to "service_role";

create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Enable insert for authenticated users only"
on "public"."rewards"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."rewards"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."stores"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."stores"
as permissive
for select
to public
using (true);