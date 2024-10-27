export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      history: {
        Row: {
          created_at: string
          id: string
          new_points: number
          operation_type: Database["public"]["Enums"]["operation_type"]
          previous_points: number
          store_id: string
          transaction_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_points: number
          operation_type: Database["public"]["Enums"]["operation_type"]
          previous_points: number
          store_id: string
          transaction_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          new_points?: number
          operation_type?: Database["public"]["Enums"]["operation_type"]
          previous_points?: number
          store_id?: string
          transaction_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "history_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          config: Json
          cost_points: boolean | null
          created_at: string
          description: string | null
          id: string
          status: Database["public"]["Enums"]["reward_status"]
          store_id: string
          title: string
          type: Database["public"]["Enums"]["reward_types"]
        }
        Insert: {
          config: Json
          cost_points?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["reward_status"]
          store_id: string
          title: string
          type: Database["public"]["Enums"]["reward_types"]
        }
        Update: {
          config?: Json
          cost_points?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["reward_status"]
          store_id?: string
          title?: string
          type?: Database["public"]["Enums"]["reward_types"]
        }
        Relationships: [
          {
            foreignKeyName: "reward_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          created_at: string
          id: string
          image_url: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_owner_id_fkey1"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stores: {
        Row: {
          created_at: string
          id: string
          points: number
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          store_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_cost_points_required_types: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      update_points_with_history: {
        Args: {
          p_user_id: string
          p_store_id: string
          p_transaction_amount: number
          p_operation_type: Database["public"]["Enums"]["operation_type"]
        }
        Returns: Json
      }
      validate_numeric_value: {
        Args: {
          key: string
          value: number
        }
        Returns: undefined
      }
      validate_string_value: {
        Args: {
          key: string
          value: string
        }
        Returns: undefined
      }
    }
    Enums: {
      operation_type: "add" | "subtract" | "reward_redemption"
      reward_status: "active" | "paused"
      reward_types:
        | "BUY_N_GET_1"
        | "DISCOUNT_PERCENTAGE"
        | "DISCOUNT_FIX"
        | "FREE_ITEM"
        | "FREE_ITEM_WITH_PURCHASE"
      role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

