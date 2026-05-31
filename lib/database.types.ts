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
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: number | null
          created_at: string
          id: number
          ip_address: unknown
          metadata: Json | null
          target_id: number | null
          target_label: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: number | null
          created_at?: string
          id?: number
          ip_address?: unknown
          metadata?: Json | null
          target_id?: number | null
          target_label?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: number | null
          created_at?: string
          id?: number
          ip_address?: unknown
          metadata?: Json | null
          target_id?: number | null
          target_label?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_events: {
        Row: {
          color: string | null
          created_at: string
          created_by: number | null
          id: number
          scheduled_at: string
          time_label: string | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: number | null
          id?: number
          scheduled_at: string
          time_label?: string | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: number | null
          id?: number
          scheduled_at?: string
          time_label?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_notifications: {
        Row: {
          action_url: string | null
          created_at: string
          icon: string | null
          id: number
          message: string | null
          read_at: string | null
          title: string
          type: string
          user_id: number
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          icon?: string | null
          id?: number
          message?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: number
        }
        Update: {
          action_url?: string | null
          created_at?: string
          icon?: string | null
          id?: number
          message?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "app_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
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
      blog_articles: {
        Row: {
          author: string
          content_html: string
          created_at: string
          excerpt: string | null
          id: number
          image_alt: string | null
          image_url: string | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          read_time: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          content_html: string
          created_at?: string
          excerpt?: string | null
          id?: number
          image_alt?: string | null
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content_html?: string
          created_at?: string
          excerpt?: string | null
          id?: number
          image_alt?: string | null
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          last_message_preview: string | null
          session_token: string
          status: string
          unread_admin_count: number
          unread_visitor_count: number
          updated_at: string
          user_id: number | null
          visitor_email: string | null
          visitor_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          session_token: string
          status?: string
          unread_admin_count?: number
          unread_visitor_count?: number
          updated_at?: string
          user_id?: number | null
          visitor_email?: string | null
          visitor_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          session_token?: string
          status?: string
          unread_admin_count?: number
          unread_visitor_count?: number
          updated_at?: string
          user_id?: number | null
          visitor_email?: string | null
          visitor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: number
          read_at: string | null
          sender_admin_id: number | null
          sender_type: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: number
          read_at?: string | null
          sender_admin_id?: number | null
          sender_type: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: number
          read_at?: string | null
          sender_admin_id?: number | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_admin_id_fkey"
            columns: ["sender_admin_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      error_logs: {
        Row: {
          count: number
          created_at: string
          exception_class: string | null
          file: string | null
          fingerprint: string
          first_seen_at: string
          id: number
          ip_address: unknown
          last_seen_at: string
          level: string
          line: number | null
          message: string
          method: string | null
          status: string
          trace: string | null
          updated_at: string
          url: string | null
          user_agent: string | null
          user_id: number | null
        }
        Insert: {
          count?: number
          created_at?: string
          exception_class?: string | null
          file?: string | null
          fingerprint: string
          first_seen_at?: string
          id?: number
          ip_address?: unknown
          last_seen_at?: string
          level?: string
          line?: number | null
          message: string
          method?: string | null
          status?: string
          trace?: string | null
          updated_at?: string
          url?: string | null
          user_agent?: string | null
          user_id?: number | null
        }
        Update: {
          count?: number
          created_at?: string
          exception_class?: string | null
          file?: string | null
          fingerprint?: string
          first_seen_at?: string
          id?: number
          ip_address?: unknown
          last_seen_at?: string
          level?: string
          line?: number | null
          message?: string
          method?: string | null
          status?: string
          trace?: string | null
          updated_at?: string
          url?: string | null
          user_agent?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          artisan_id: number
          created_at: string
          id: number
          user_id: number
        }
        Insert: {
          artisan_id: number
          created_at?: string
          id?: number
          user_id: number
        }
        Update: {
          artisan_id?: number
          created_at?: string
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "favorites_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_comments: {
        Row: {
          author_id: number
          content: string
          created_at: string
          id: number
          post_id: number
          status: string
        }
        Insert: {
          author_id: number
          content: string
          created_at?: string
          id?: number
          post_id: number
          status?: string
        }
        Update: {
          author_id?: number
          content?: string
          created_at?: string
          id?: number
          post_id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_likes: {
        Row: {
          created_at: string
          post_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          post_id: number
          user_id: number
        }
        Update: {
          created_at?: string
          post_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "feed_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_posts: {
        Row: {
          approved_at: string | null
          approved_by: number | null
          author_id: number
          city: string | null
          comments_count: number
          content: string
          created_at: string
          id: number
          images: Json
          kind: string
          likes_count: number
          metier_id: number | null
          rejection_reason: string | null
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: number | null
          author_id: number
          city?: string | null
          comments_count?: number
          content: string
          created_at?: string
          id?: number
          images?: Json
          kind: string
          likes_count?: number
          metier_id?: number | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: number | null
          author_id?: number
          city?: string | null
          comments_count?: number
          content?: string
          created_at?: string
          id?: number
          images?: Json
          kind?: string
          likes_count?: number
          metier_id?: number | null
          rejection_reason?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_posts_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_posts_metier_id_fkey"
            columns: ["metier_id"]
            isOneToOne: false
            referencedRelation: "metiers"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_reports: {
        Row: {
          comment_id: number | null
          created_at: string
          id: number
          post_id: number | null
          reason: string
          reporter_id: number
          resolved_at: string | null
          resolved_by: number | null
        }
        Insert: {
          comment_id?: number | null
          created_at?: string
          id?: number
          post_id?: number | null
          reason: string
          reporter_id: number
          resolved_at?: string | null
          resolved_by?: number | null
        }
        Update: {
          comment_id?: number | null
          created_at?: string
          id?: number
          post_id?: number | null
          reason?: string
          reporter_id?: number
          resolved_at?: string | null
          resolved_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "feed_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_reports_resolved_by_fkey"
            columns: ["resolved_by"]
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
      message_threads: {
        Row: {
          created_at: string
          id: number
          last_message_at: string | null
          last_message_preview: string | null
          unread_a_count: number
          unread_b_count: number
          updated_at: string
          user_a_id: number
          user_b_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          last_message_at?: string | null
          last_message_preview?: string | null
          unread_a_count?: number
          unread_b_count?: number
          updated_at?: string
          user_a_id: number
          user_b_id: number
        }
        Update: {
          created_at?: string
          id?: number
          last_message_at?: string | null
          last_message_preview?: string | null
          unread_a_count?: number
          unread_b_count?: number
          updated_at?: string
          user_a_id?: number
          user_b_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_user_a_id_fkey"
            columns: ["user_a_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_user_b_id_fkey"
            columns: ["user_b_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: number
          read_at: string | null
          sender_id: number
          thread_id: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: number
          read_at?: string | null
          sender_id: number
          thread_id: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: number
          read_at?: string | null
          sender_id?: number
          thread_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
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
      newsletter_subscribers: {
        Row: {
          audience: string
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string
          email: string
          id: number
          ip_address: unknown
          name: string | null
          source: string | null
          status: string
          unsubscribe_token: string
          unsubscribed_at: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          audience?: string
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          email: string
          id?: number
          ip_address?: unknown
          name?: string | null
          source?: string | null
          status?: string
          unsubscribe_token: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          audience?: string
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          email?: string
          id?: number
          ip_address?: unknown
          name?: string | null
          source?: string | null
          status?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      password_resets: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: number
          ip_address: string | null
          token_hash: string
          used_at: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: number
          ip_address?: string | null
          token_hash: string
          used_at?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: number
          ip_address?: string | null
          token_hash?: string
          used_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      profile_reports: {
        Row: {
          admin_note: string | null
          created_at: string
          detail: string | null
          handled_at: string | null
          handled_by: number | null
          id: number
          ip_address: unknown
          reason: string
          reported_user_id: number
          reporter_email: string | null
          reporter_id: number | null
          status: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          detail?: string | null
          handled_at?: string | null
          handled_by?: number | null
          id?: number
          ip_address?: unknown
          reason?: string
          reported_user_id: number
          reporter_email?: string | null
          reporter_id?: number | null
          status?: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          detail?: string | null
          handled_at?: string | null
          handled_by?: number | null
          id?: number
          ip_address?: unknown
          reason?: string
          reported_user_id?: number
          reporter_email?: string | null
          reporter_id?: number | null
          status?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_reports_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      quote_requests: {
        Row: {
          artisan_id: number | null
          budget_range: string
          city: string | null
          client_id: number | null
          closed_at: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          description: string
          id: number
          ip_address: unknown
          metier_id: number | null
          photos: Json | null
          postal_code: string | null
          responded_at: string | null
          seen_at: string | null
          status: string
          submitter_name: string | null
          submitter_phone: string | null
          title: string
          updated_at: string
          urgency: string
          user_agent: string | null
        }
        Insert: {
          artisan_id?: number | null
          budget_range?: string
          city?: string | null
          client_id?: number | null
          closed_at?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          description: string
          id?: number
          ip_address?: unknown
          metier_id?: number | null
          photos?: Json | null
          postal_code?: string | null
          responded_at?: string | null
          seen_at?: string | null
          status?: string
          submitter_name?: string | null
          submitter_phone?: string | null
          title: string
          updated_at?: string
          urgency?: string
          user_agent?: string | null
        }
        Update: {
          artisan_id?: number | null
          budget_range?: string
          city?: string | null
          client_id?: number | null
          closed_at?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          description?: string
          id?: number
          ip_address?: unknown
          metier_id?: number | null
          photos?: Json | null
          postal_code?: string | null
          responded_at?: string | null
          seen_at?: string | null
          status?: string
          submitter_name?: string | null
          submitter_phone?: string | null
          title?: string
          updated_at?: string
          urgency?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_metier_id_fkey"
            columns: ["metier_id"]
            isOneToOne: false
            referencedRelation: "metiers"
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
          moderated_at: string | null
          moderated_by: number | null
          moderation_note: string | null
          quote_request_id: number | null
          rating: number
          status: string
          updated_at: string
          user_id: number
        }
        Insert: {
          artisan_profile_id: number
          comment?: string | null
          created_at?: string
          id?: number
          is_flagged?: boolean
          moderated_at?: string | null
          moderated_by?: number | null
          moderation_note?: string | null
          quote_request_id?: number | null
          rating: number
          status?: string
          updated_at?: string
          user_id: number
        }
        Update: {
          artisan_profile_id?: number
          comment?: string | null
          created_at?: string
          id?: number
          is_flagged?: boolean
          moderated_at?: string | null
          moderated_by?: number | null
          moderation_note?: string | null
          quote_request_id?: number | null
          rating?: number
          status?: string
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
            foreignKeyName: "reviews_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
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
