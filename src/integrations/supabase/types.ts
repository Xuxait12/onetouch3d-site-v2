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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      cupons: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          id: string
          parceiro_id: string | null
          tipo: string
          usos_totais: number
          valor: number | null
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          id?: string
          parceiro_id?: string | null
          tipo: string
          usos_totais?: number
          valor?: number | null
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          id?: string
          parceiro_id?: string | null
          tipo?: string
          usos_totais?: number
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cupons_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      custos_insumos: {
        Row: {
          embalagem: number
          filamento: number
          foto: number
          id: string
          mdf: number
          montagem: number
          outros: number | null
          tamanho_id: string
          taxas: number
          updated_at: string
          vidro: number
        }
        Insert: {
          embalagem?: number
          filamento?: number
          foto?: number
          id?: string
          mdf?: number
          montagem?: number
          outros?: number | null
          tamanho_id: string
          taxas?: number
          updated_at?: string
          vidro?: number
        }
        Update: {
          embalagem?: number
          filamento?: number
          foto?: number
          id?: string
          mdf?: number
          montagem?: number
          outros?: number | null
          tamanho_id?: string
          taxas?: number
          updated_at?: string
          vidro?: number
        }
        Relationships: [
          {
            foreignKeyName: "custos_insumos_tamanho_id_fkey"
            columns: ["tamanho_id"]
            isOneToOne: true
            referencedRelation: "tamanhos"
            referencedColumns: ["id"]
          },
        ]
      }
      custos_molduras: {
        Row: {
          caixa_alta: number | null
          caixa_baixa: number | null
          custo: number | null
          id: string
          tamanho_id: string | null
          tipo_moldura_id: string | null
          updated_at: string
        }
        Insert: {
          caixa_alta?: number | null
          caixa_baixa?: number | null
          custo?: number | null
          id?: string
          tamanho_id?: string | null
          tipo_moldura_id?: string | null
          updated_at?: string
        }
        Update: {
          caixa_alta?: number | null
          caixa_baixa?: number | null
          custo?: number | null
          id?: string
          tamanho_id?: string | null
          tipo_moldura_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custos_molduras_tamanho_id_fkey"
            columns: ["tamanho_id"]
            isOneToOne: false
            referencedRelation: "tamanhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_molduras_tipo_moldura_id_fkey"
            columns: ["tipo_moldura_id"]
            isOneToOne: true
            referencedRelation: "tipos_moldura"
            referencedColumns: ["id"]
          },
        ]
      }
      links_pagamento: {
        Row: {
          created_at: string
          cupom_id: string | null
          id: string
          modalidade_id: string
          profile_id: string
          status: string
          tamanho_id: string
          tipo_moldura_id: string
          url: string | null
          valor: number
        }
        Insert: {
          created_at?: string
          cupom_id?: string | null
          id?: string
          modalidade_id: string
          profile_id: string
          status?: string
          tamanho_id: string
          tipo_moldura_id: string
          url?: string | null
          valor: number
        }
        Update: {
          created_at?: string
          cupom_id?: string | null
          id?: string
          modalidade_id?: string
          profile_id?: string
          status?: string
          tamanho_id?: string
          tipo_moldura_id?: string
          url?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "links_pagamento_cliente_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_pagamento_cupom_id_fkey"
            columns: ["cupom_id"]
            isOneToOne: false
            referencedRelation: "cupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_pagamento_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_pagamento_tamanho_id_fkey"
            columns: ["tamanho_id"]
            isOneToOne: false
            referencedRelation: "tamanhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_pagamento_tipo_moldura_id_fkey"
            columns: ["tipo_moldura_id"]
            isOneToOne: false
            referencedRelation: "tipos_moldura"
            referencedColumns: ["id"]
          },
        ]
      }
      modalidade_molduras: {
        Row: {
          id: string
          modalidade_id: string
          tipo_moldura_id: string
        }
        Insert: {
          id?: string
          modalidade_id: string
          tipo_moldura_id: string
        }
        Update: {
          id?: string
          modalidade_id?: string
          tipo_moldura_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "modalidade_molduras_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modalidade_molduras_tipo_moldura_id_fkey"
            columns: ["tipo_moldura_id"]
            isOneToOne: false
            referencedRelation: "tipos_moldura"
            referencedColumns: ["id"]
          },
        ]
      }
      modalidades: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          slug: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          slug: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          slug?: string
        }
        Relationships: []
      }
      parceiros: {
        Row: {
          ativo: boolean
          created_at: string
          cupom_id: string | null
          email: string | null
          id: string
          nome: string
          observacao: string | null
          phone: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          cupom_id?: string | null
          email?: string | null
          id?: string
          nome: string
          observacao?: string | null
          phone?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          cupom_id?: string | null
          email?: string | null
          id?: string
          nome?: string
          observacao?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_parceiros_cupom"
            columns: ["cupom_id"]
            isOneToOne: false
            referencedRelation: "cupons"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhooks: {
        Row: {
          created_at: string
          event_type: string | null
          id: string
          payment_id: string | null
          pedido_id: string | null
          raw_data: Json | null
          status: string | null
        }
        Insert: {
          created_at?: string
          event_type?: string | null
          id?: string
          payment_id?: string | null
          pedido_id?: string | null
          raw_data?: Json | null
          status?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string | null
          id?: string
          payment_id?: string | null
          pedido_id?: string | null
          raw_data?: Json | null
          status?: string | null
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
          canal_venda: string
          created_at: string
          cupom_id: string | null
          custo_insumos: number | null
          custo_moldura: number | null
          custo_total: number | null
          desconto_cupom: number | null
          desconto_pix: number | null
          entregue_em: string | null
          enviado_em: string | null
          fotos_recebidas_em: string | null
          id: string
          installments: number | null
          layout_aprovado_em: string | null
          layout_criado_em: string | null
          lucro: number | null
          margem_percentual: number | null
          metodo_pagamento: string | null
          modalidade_id: string
          observacao: string | null
          payment_id: string | null
          pix_qr_code: string | null
          pix_qr_code_text: string | null
          preco_final: number
          preco_total: number
          preco_unitario: number
          producao_iniciada_em: string | null
          pronto_em: string | null
          quantidade: number
          shipping_address: string | null
          shipping_cost: number | null
          shipping_delivery_time: number | null
          shipping_method: string | null
          status_pagamento: string
          status_producao: string
          tamanho_id: string
          tipo_moldura_id: string
          tracking_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          canal_venda?: string
          created_at?: string
          cupom_id?: string | null
          custo_insumos?: number | null
          custo_moldura?: number | null
          custo_total?: number | null
          desconto_cupom?: number | null
          desconto_pix?: number | null
          entregue_em?: string | null
          enviado_em?: string | null
          fotos_recebidas_em?: string | null
          id?: string
          installments?: number | null
          layout_aprovado_em?: string | null
          layout_criado_em?: string | null
          lucro?: number | null
          margem_percentual?: number | null
          metodo_pagamento?: string | null
          modalidade_id: string
          observacao?: string | null
          payment_id?: string | null
          pix_qr_code?: string | null
          pix_qr_code_text?: string | null
          preco_final: number
          preco_total: number
          preco_unitario: number
          producao_iniciada_em?: string | null
          pronto_em?: string | null
          quantidade?: number
          shipping_address?: string | null
          shipping_cost?: number | null
          shipping_delivery_time?: number | null
          shipping_method?: string | null
          status_pagamento?: string
          status_producao?: string
          tamanho_id: string
          tipo_moldura_id: string
          tracking_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          canal_venda?: string
          created_at?: string
          cupom_id?: string | null
          custo_insumos?: number | null
          custo_moldura?: number | null
          custo_total?: number | null
          desconto_cupom?: number | null
          desconto_pix?: number | null
          entregue_em?: string | null
          enviado_em?: string | null
          fotos_recebidas_em?: string | null
          id?: string
          installments?: number | null
          layout_aprovado_em?: string | null
          layout_criado_em?: string | null
          lucro?: number | null
          margem_percentual?: number | null
          metodo_pagamento?: string | null
          modalidade_id?: string
          observacao?: string | null
          payment_id?: string | null
          pix_qr_code?: string | null
          pix_qr_code_text?: string | null
          preco_final?: number
          preco_total?: number
          preco_unitario?: number
          producao_iniciada_em?: string | null
          pronto_em?: string | null
          quantidade?: number
          shipping_address?: string | null
          shipping_cost?: number | null
          shipping_delivery_time?: number | null
          shipping_method?: string | null
          status_pagamento?: string
          status_producao?: string
          tamanho_id?: string
          tipo_moldura_id?: string
          tracking_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cupom_id_fkey"
            columns: ["cupom_id"]
            isOneToOne: false
            referencedRelation: "cupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_tamanho_id_fkey"
            columns: ["tamanho_id"]
            isOneToOne: false
            referencedRelation: "tamanhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_tipo_moldura_id_fkey"
            columns: ["tipo_moldura_id"]
            isOneToOne: false
            referencedRelation: "tipos_moldura"
            referencedColumns: ["id"]
          },
        ]
      }
      precos: {
        Row: {
          ativo: boolean
          id: string
          modalidade_id: string
          preco: number
          tamanho_id: string
          tipo_moldura_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          id?: string
          modalidade_id: string
          preco: number
          tamanho_id: string
          tipo_moldura_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          id?: string
          modalidade_id?: string
          preco?: number
          tamanho_id?: string
          tipo_moldura_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "precos_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "precos_tamanho_id_fkey"
            columns: ["tamanho_id"]
            isOneToOne: false
            referencedRelation: "tamanhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "precos_tipo_moldura_id_fkey"
            columns: ["tipo_moldura_id"]
            isOneToOne: false
            referencedRelation: "tipos_moldura"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          cpf_cnpj: string | null
          created_at: string
          data_nascimento: string | null
          email: string
          endereco: string | null
          estado: string | null
          genero: string | null
          id: string
          nome_completo: string
          numero: string | null
          pais: string
          parceiro_id: string | null
          telefone: string | null
          tipo_pessoa: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          data_nascimento?: string | null
          email: string
          endereco?: string | null
          estado?: string | null
          genero?: string | null
          id?: string
          nome_completo: string
          numero?: string | null
          pais?: string
          parceiro_id?: string | null
          telefone?: string | null
          tipo_pessoa?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string
          endereco?: string | null
          estado?: string | null
          genero?: string | null
          id?: string
          nome_completo?: string
          numero?: string | null
          pais?: string
          parceiro_id?: string | null
          telefone?: string | null
          tipo_pessoa?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      tamanhos: {
        Row: {
          altura: number
          ativo: boolean
          created_at: string
          id: string
          largura: number
          nome: string
          ordem: number
        }
        Insert: {
          altura: number
          ativo?: boolean
          created_at?: string
          id?: string
          largura: number
          nome: string
          ordem?: number
        }
        Update: {
          altura?: number
          ativo?: boolean
          created_at?: string
          id?: string
          largura?: number
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      tipos_moldura: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          tem_3d: boolean
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          tem_3d: boolean
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          tem_3d?: boolean
        }
        Relationships: []
      }
      vendas_manuais: {
        Row: {
          created_at: string
          cupom_id: string | null
          data_venda: string | null
          desconto_pix: number | null
          id: string
          modalidade_id: string
          numero: number | null
          observacao: string | null
          profile_id: string
          quantidade: number | null
          tamanho_id: string
          tipo_moldura_id: string
          valor: number
          valor_frete: number | null
          valor_quadro: number | null
        }
        Insert: {
          created_at?: string
          cupom_id?: string | null
          data_venda?: string | null
          desconto_pix?: number | null
          id?: string
          modalidade_id: string
          numero?: number | null
          observacao?: string | null
          profile_id: string
          quantidade?: number | null
          tamanho_id: string
          tipo_moldura_id: string
          valor: number
          valor_frete?: number | null
          valor_quadro?: number | null
        }
        Update: {
          created_at?: string
          cupom_id?: string | null
          data_venda?: string | null
          desconto_pix?: number | null
          id?: string
          modalidade_id?: string
          numero?: number | null
          observacao?: string | null
          profile_id?: string
          quantidade?: number | null
          tamanho_id?: string
          tipo_moldura_id?: string
          valor?: number
          valor_frete?: number | null
          valor_quadro?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendas_manuais_cliente_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_manuais_cupom_id_fkey"
            columns: ["cupom_id"]
            isOneToOne: false
            referencedRelation: "cupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_manuais_modalidade_id_fkey"
            columns: ["modalidade_id"]
            isOneToOne: false
            referencedRelation: "modalidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_manuais_tamanho_id_fkey"
            columns: ["tamanho_id"]
            isOneToOne: false
            referencedRelation: "tamanhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_manuais_tipo_moldura_id_fkey"
            columns: ["tipo_moldura_id"]
            isOneToOne: false
            referencedRelation: "tipos_moldura"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
