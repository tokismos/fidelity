import { Tables } from "./database.types"

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export type Stores = Tables<"stores">

export type Id = string | null
