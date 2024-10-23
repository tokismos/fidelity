import { Tables } from "./database.types"

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export type Stores = Tables<"stores">

export type Id = string | null | undefined

export type UserStore = Omit<Tables<"user_stores">, "created_at">
