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
    PostgrestVersion: "14.5"
  }
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      artisan_connections: {
        Row: {
          created_at: string
          follower_id: number
          following_id: number
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          follower_id: number
          following_id: number
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          follower_id?: number
          following_id?: number
          id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artisan_connections_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisan_connections_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      artisan_post_comments: {
        Row: {
          content: string
          created_at: string
          id: number
          post_id: number
          updated_at: string
          user_id: number
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          post_id: number
          updated_at?: string
          user_id: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          post_id?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "artisan_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "artisan_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisan_post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      artisan_post_likes: {
        Row: {
          created_at: string
          id: number
          post_id: number
          updated_at: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: number
          updated_at?: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "artisan_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "artisan_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisan_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      artisan_posts: {
        Row: {
          content: string
          created_at: string
          id: number
          image: string | null
          is_news: boolean
          updated_at: string
          user_id: number
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          image?: string | null
          is_news?: boolean
          updated_at?: string
          user_id: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          image?: string | null
          is_news?: boolean
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "artisan_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      artisan_profile_metier: {
        Row: {
          artisan_profile_id: number
          id: number
          metier_id: number
        }
        Insert: {
          artisan_profile_id: number
          id?: number
          metier_id: number
        }
        Update: {
          artisan_profile_id?: number
          id?: number
          metier_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "artisan_profile_metier_artisan_profile_id_fkey"
            columns: ["artisan_profile_id"]
            isOneToOne: false
            referencedRelation: "artisan_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisan_profile_metier_metier_id_fkey"
            columns: ["metier_id"]
            isOneToOne: false
            referencedRelation: "metiers"
            referencedColumns: ["id"]
          },
        ]
      }
      artisan_profiles: {
        Row: {
          availability: string | null
          business_hours: string | null
          company_name: string | null
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          latitude: number | null
          longitude: number | null
          metier_id: number
          rcs_verified: boolean
          service_radius: number | null
          siret: string | null
          siret_verified: boolean
          updated_at: string
          user_id: number
        }
        Insert: {
          availability?: string | null
          business_hours?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          metier_id: number
          rcs_verified?: boolean
          service_radius?: number | null
          siret?: string | null
          siret_verified?: boolean
          updated_at?: string
          user_id: number
        }
        Update: {
          availability?: string | null
          business_hours?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          metier_id?: number
          rcs_verified?: boolean
          service_radius?: number | null
          siret?: string | null
          siret_verified?: boolean
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "artisan_profiles_metier_id_fkey"
            columns: ["metier_id"]
            isOneToOne: false
            referencedRelation: "metiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artisan_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          human_mode: boolean
          id: number
          last_activity_at: string | null
          page_url: string | null
          status: string
          updated_at: string
          visitor_email: string | null
          visitor_id: string
          visitor_name: string | null
        }
        Insert: {
          created_at?: string
          human_mode?: boolean
          id?: number
          last_activity_at?: string | null
          page_url?: string | null
          status?: string
          updated_at?: string
          visitor_email?: string | null
          visitor_id: string
          visitor_name?: string | null
        }
        Update: {
          created_at?: string
          human_mode?: boolean
          id?: number
          last_activity_at?: string | null
          page_url?: string | null
          status?: string
          updated_at?: string
          visitor_email?: string | null
          visitor_id?: string
          visitor_name?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          body: string
          conversation_id: number
          created_at: string
          id: number
          read_at: string | null
          sender: string
          sender_name: string | null
          updated_at: string
        }
        Insert: {
          body: string
          conversation_id: number
          created_at?: string
          id?: number
          read_at?: string | null
          sender: string
          sender_name?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          conversation_id?: number
          created_at?: string
          id?: number
          read_at?: string | null
          sender?: string
          sender_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_submissions: {
        Row: {
          created_at: string
          file_mime: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: number
          message: string | null
          read_at: string | null
          recipient_user_id: number
          sender_email: string
          sender_name: string
          sender_phone: string | null
          sender_user_id: number | null
          status: string
        }
        Insert: {
          created_at?: string
          file_mime?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: number
          message?: string | null
          read_at?: string | null
          recipient_user_id: number
          sender_email: string
          sender_name: string
          sender_phone?: string | null
          sender_user_id?: number | null
          status?: string
        }
        Update: {
          created_at?: string
          file_mime?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: number
          message?: string | null
          read_at?: string | null
          recipient_user_id?: number
          sender_email?: string
          sender_name?: string
          sender_phone?: string | null
          sender_user_id?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cv_submissions_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cv_submissions_sender_user_id_fkey"
            columns: ["sender_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: number
          following_id: number
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          follower_id: number
          following_id: number
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          follower_id?: number
          following_id?: number
          id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          artisan_profile_id: number | null
          caption: string | null
          created_at: string
          id: number
          image_path: string
          sort_order: number
          updated_at: string
          user_id: number | null
        }
        Insert: {
          artisan_profile_id?: number | null
          caption?: string | null
          created_at?: string
          id?: number
          image_path: string
          sort_order?: number
          updated_at?: string
          user_id?: number | null
        }
        Update: {
          artisan_profile_id?: number | null
          caption?: string | null
          created_at?: string
          id?: number
          image_path?: string
          sort_order?: number
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_artisan_profile_id_fkey"
            columns: ["artisan_profile_id"]
            isOneToOne: false
            referencedRelation: "artisan_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_subscribers: {
        Row: {
          created_at: string
          email: string
          id: number
          ip_address: string | null
          notified_at: string | null
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          ip_address?: string | null
          notified_at?: string | null
          token: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          ip_address?: string | null
          notified_at?: string | null
          token?: string
        }
        Relationships: []
      }
      metiers: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: number
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          id: number
          profile_user_id: number
          viewed_at: string
        }
        Insert: {
          id?: number
          profile_user_id: number
          viewed_at?: string
        }
        Update: {
          id?: number
          profile_user_id?: number
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_user_id_fkey"
            columns: ["profile_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          channel: string | null
          created_at: string
          id: number
          ip: string | null
          referral_code: string
          referred_user_id: number | null
          referrer_id: number
          signed_up_at: string | null
          status: string
          updated_at: string
          user_agent: string | null
          validated_at: string | null
        }
        Insert: {
          channel?: string | null
          created_at?: string
          id?: number
          ip?: string | null
          referral_code: string
          referred_user_id?: number | null
          referrer_id: number
          signed_up_at?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          validated_at?: string | null
        }
        Update: {
          channel?: string | null
          created_at?: string
          id?: number
          ip?: string | null
          referral_code?: string
          referred_user_id?: number | null
          referrer_id?: number
          signed_up_at?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          artisan_profile_id: number
          comment: string | null
          created_at: string
          id: number
          is_flagged: boolean
          rating: number
          updated_at: string
          user_id: number
        }
        Insert: {
          artisan_profile_id: number
          comment?: string | null
          created_at?: string
          id?: number
          is_flagged?: boolean
          rating: number
          updated_at?: string
          user_id: number
        }
        Update: {
          artisan_profile_id?: number
          comment?: string | null
          created_at?: string
          id?: number
          is_flagged?: boolean
          rating?: number
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_artisan_profile_id_fkey"
            columns: ["artisan_profile_id"]
            isOneToOne: false
            referencedRelation: "artisan_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          artisan_profile_id: number
          created_at: string
          id: number
          name: string
          price: string | null
          updated_at: string
        }
        Insert: {
          artisan_profile_id: number
          created_at?: string
          id?: number
          name: string
          price?: string | null
          updated_at?: string
        }
        Update: {
          artisan_profile_id?: number
          created_at?: string
          id?: number
          name?: string
          price?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_artisan_profile_id_fkey"
            columns: ["artisan_profile_id"]
            isOneToOne: false
            referencedRelation: "artisan_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          city: string | null
          client_number: string | null
          cover_photo: string | null
          created_at: string
          cv_about: string | null
          cv_available_from: string | null
          cv_data: Json | null
          cv_metier_id: number | null
          cv_published: boolean
          cv_search_city: string | null
          cv_search_radius: number | null
          cv_title: string | null
          cv_updated_at: string | null
          deleted_at: string | null
          description: string | null
          email: string
          email_verified_at: string | null
          id: number
          name: string
          oauth_id: string | null
          oauth_provider: string | null
          password: string | null
          phone: string | null
          profile_photo: string | null
          referral_code: string | null
          referred_by_user_id: number | null
          rejection_reason: string | null
          remember_token: string | null
          role: string
          siren: string | null
          siren_closed_at: string | null
          siren_last_checked_at: string | null
          siren_status: string | null
          updated_at: string
          validated_at: string | null
          validated_by: number | null
          validation_status: string
        }
        Insert: {
          city?: string | null
          client_number?: string | null
          cover_photo?: string | null
          created_at?: string
          cv_about?: string | null
          cv_available_from?: string | null
          cv_data?: Json | null
          cv_metier_id?: number | null
          cv_published?: boolean
          cv_search_city?: string | null
          cv_search_radius?: number | null
          cv_title?: string | null
          cv_updated_at?: string | null
          deleted_at?: string | null
          description?: string | null
          email: string
          email_verified_at?: string | null
          id?: number
          name: string
          oauth_id?: string | null
          oauth_provider?: string | null
          password?: string | null
          phone?: string | null
          profile_photo?: string | null
          referral_code?: string | null
          referred_by_user_id?: number | null
          rejection_reason?: string | null
          remember_token?: string | null
          role?: string
          siren?: string | null
          siren_closed_at?: string | null
          siren_last_checked_at?: string | null
          siren_status?: string | null
          updated_at?: string
          validated_at?: string | null
          validated_by?: number | null
          validation_status?: string
        }
        Update: {
          city?: string | null
          client_number?: string | null
          cover_photo?: string | null
          created_at?: string
          cv_about?: string | null
          cv_available_from?: string | null
          cv_data?: Json | null
          cv_metier_id?: number | null
          cv_published?: boolean
          cv_search_city?: string | null
          cv_search_radius?: number | null
          cv_title?: string | null
          cv_updated_at?: string | null
          deleted_at?: string | null
          description?: string | null
          email?: string
          email_verified_at?: string | null
          id?: number
          name?: string
          oauth_id?: string | null
          oauth_provider?: string | null
          password?: string | null
          phone?: string | null
          profile_photo?: string | null
          referral_code?: string | null
          referred_by_user_id?: number | null
          rejection_reason?: string | null
          remember_token?: string | null
          role?: string
          siren?: string | null
          siren_closed_at?: string | null
          siren_last_checked_at?: string | null
          siren_status?: string | null
          updated_at?: string
          validated_at?: string | null
          validated_by?: number | null
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_cv_metier_id_fkey"
            columns: ["cv_metier_id"]
            isOneToOne: false
            referencedRelation: "metiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_referred_by_user_id_fkey"
            columns: ["referred_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "users"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
