export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: { Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json }; Returns: Json }
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
          email: string | null
          id: string
          role: Database["public"]["Enums"]["role"]
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["role"]
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["role"]
        }
        Relationships: []
      }
      reward_progress: {
        Row: {
          created_at: string
          id: string
          purchases: number
          reward_id: string
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          purchases?: number
          reward_id: string
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          purchases?: number
          reward_id?: string
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_progress_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_progress_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          config: NonNullable<Json>
          cost_points: boolean
          created_at: string
          description: string
          id: string
          status: Database["public"]["Enums"]["reward_status"]
          store_id: string
          title: string
          type: Database["public"]["Enums"]["reward_types"]
        }
        Insert: {
          config: NonNullable<Json>
          cost_points: boolean
          created_at?: string
          description: string
          id?: string
          status: Database["public"]["Enums"]["reward_status"]
          store_id: string
          title: string
          type: Database["public"]["Enums"]["reward_types"]
        }
        Update: {
          config?: NonNullable<Json>
          cost_points?: boolean
          created_at?: string
          description?: string
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
      user_rewards: {
        Row: {
          config: NonNullable<Json>
          created_at: string
          id: string
          reward_id: string
          status: Database["public"]["Enums"]["user_reward_status"]
          store_id: string
          user_id: string
        }
        Insert: {
          config: NonNullable<Json>
          created_at?: string
          id?: string
          reward_id: string
          status?: Database["public"]["Enums"]["user_reward_status"]
          store_id: string
          user_id: string
        }
        Update: {
          config?: NonNullable<Json>
          created_at?: string
          id?: string
          reward_id?: string
          status?: Database["public"]["Enums"]["user_reward_status"]
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_user_id_fkey"
            columns: ["user_id"]
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
      add_purchase: { Args: { p_reward_id: string; p_user_id: string }; Returns: number }
      get_cost_points_required_types: { Args: Record<PropertyKey, never>; Returns: string[] }
      get_store_stats: {
        Args: { p_store_id: string }
        Returns: {
          customers: number
          points_given: number
          rewards_given: number
        }[]
      }
      give_reward: { Args: { p_reward_id: string; p_user_id: string }; Returns: string }
      is_store_owner: { Args: { p_store_id: string }; Returns: boolean }
      update_points_with_history: {
        Args: {
          p_operation_type: Database["public"]["Enums"]["operation_type"]
          p_store_id: string
          p_transaction_amount: number
          p_user_id: string
        }
        Returns: Json
      }
      validate_numeric_value: { Args: { key: string; value: number }; Returns: undefined }
      validate_string_value: { Args: { key: string; value: string }; Returns: undefined }
    }
    Enums: {
      operation_type: "add" | "subtract" | "reward_redemption"
      reward_status: "active" | "paused"
      reward_types: "BUY_N_GET_1" | "DISCOUNT_PERCENTAGE" | "DISCOUNT_FIX" | "FREE_ITEM" | "FREE_ITEM_WITH_PURCHASE"
      role: "user" | "admin"
      user_reward_status: "redeemed" | "canceled" | "used"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      operation_type: ["add", "subtract", "reward_redemption"],
      reward_status: ["active", "paused"],
      reward_types: ["BUY_N_GET_1", "DISCOUNT_PERCENTAGE", "DISCOUNT_FIX", "FREE_ITEM", "FREE_ITEM_WITH_PURCHASE"],
      role: ["user", "admin"],
      user_reward_status: ["redeemed", "canceled", "used"],
    },
  },
} as const
