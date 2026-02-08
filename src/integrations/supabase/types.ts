export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      atualizar: {
        Row: {
          created_at: string
          id: number
          numero: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          numero?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          numero?: number | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          page: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          id?: string
          page: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          page?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      itens_pedido: {
        Row: {
          created_at: string
          id: string
          moldura_tipo: string
          pedido_id: string
          produto_nome: string
          quantidade: number
          subtotal: number
          tamanho: string
          valor_unitario: number
        }
        Insert: {
          created_at?: string
          id?: string
          moldura_tipo: string
          pedido_id: string
          produto_nome: string
          quantidade: number
          subtotal: number
          tamanho: string
          valor_unitario: number
        }
        Update: {
          created_at?: string
          id?: string
          moldura_tipo?: string
          pedido_id?: string
          produto_nome?: string
          quantidade?: number
          subtotal?: number
          tamanho?: string
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_itens_pedido_pedido"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhooks: {
        Row: {
          created_at: string
          error_message: string | null
          event_data: Json
          event_type: string
          id: string
          payment_id: string
          pedido_id: string | null
          processed: boolean | null
          processed_at: string | null
          request_id: string | null
          signature: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_data: Json
          event_type: string
          id?: string
          payment_id: string
          pedido_id?: string | null
          processed?: boolean | null
          processed_at?: string | null
          request_id?: string | null
          signature?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          payment_id?: string
          pedido_id?: string | null
          processed?: boolean | null
          processed_at?: string | null
          request_id?: string | null
          signature?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_webhooks_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          created_at: string
          cupom_aplicado: string | null
          data_pedido: string
          desconto: number
          forma_pagamento: string
          frete: number
          id: string
          installments: number | null
          numero_pedido: string | null
          payment_approved_at: string | null
          payment_id: string | null
          payment_metadata: Json | null
          payment_method_id: string | null
          payment_method_type: string | null
          payment_status: string | null
          pix_qr_code: string | null
          pix_qr_code_text: string | null
          pix_ticket_url: string | null
          shipping_address: string | null
          shipping_company: string | null
          shipping_delivery_time: number | null
          shipping_metadata: Json | null
          shipping_method: string | null
          shipping_service_id: number | null
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string
          webhook_received_at: string | null
        }
        Insert: {
          created_at?: string
          cupom_aplicado?: string | null
          data_pedido?: string
          desconto?: number
          forma_pagamento: string
          frete?: number
          id?: string
          installments?: number | null
          numero_pedido?: string | null
          payment_approved_at?: string | null
          payment_id?: string | null
          payment_metadata?: Json | null
          payment_method_id?: string | null
          payment_method_type?: string | null
          payment_status?: string | null
          pix_qr_code?: string | null
          pix_qr_code_text?: string | null
          pix_ticket_url?: string | null
          shipping_address?: string | null
          shipping_company?: string | null
          shipping_delivery_time?: number | null
          shipping_metadata?: Json | null
          shipping_method?: string | null
          shipping_service_id?: number | null
          status?: string
          subtotal: number
          total: number
          updated_at?: string
          user_id: string
          webhook_received_at?: string | null
        }
        Update: {
          created_at?: string
          cupom_aplicado?: string | null
          data_pedido?: string
          desconto?: number
          forma_pagamento?: string
          frete?: number
          id?: string
          installments?: number | null
          numero_pedido?: string | null
          payment_approved_at?: string | null
          payment_id?: string | null
          payment_metadata?: Json | null
          payment_method_id?: string | null
          payment_method_type?: string | null
          payment_status?: string | null
          pix_qr_code?: string | null
          pix_qr_code_text?: string | null
          pix_ticket_url?: string | null
          shipping_address?: string | null
          shipping_company?: string | null
          shipping_delivery_time?: number | null
          shipping_metadata?: Json | null
          shipping_method?: string | null
          shipping_service_id?: number | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
          webhook_received_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedidos_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string
          birth_date: string
          cep: string
          city: string
          complement: string | null
          country: string
          cpf_cnpj: string
          created_at: string
          email: string
          full_name: string
          id: string
          is_admin: boolean | null
          neighborhood: string
          number: string
          person_type: Database["public"]["Enums"]["person_type_enum"]
          phone: string
          ponto_referencia: string | null
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          birth_date: string
          cep: string
          city: string
          complement?: string | null
          country?: string
          cpf_cnpj: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_admin?: boolean | null
          neighborhood: string
          number: string
          person_type?: Database["public"]["Enums"]["person_type_enum"]
          phone: string
          ponto_referencia?: string | null
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          birth_date?: string
          cep?: string
          city?: string
          complement?: string | null
          country?: string
          cpf_cnpj?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_admin?: boolean | null
          neighborhood?: string
          number?: string
          person_type?: Database["public"]["Enums"]["person_type_enum"]
          phone?: string
          ponto_referencia?: string | null
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_current_user_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      person_type_enum: "fisica" | "juridica"
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
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      person_type_enum: ["fisica", "juridica"],
    },
  },
} as const
