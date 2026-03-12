export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          created_at: string;
          password_protected: boolean;
          password_hash: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          created_at?: string;
          password_protected?: boolean;
          password_hash?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          created_at?: string;
          password_protected?: boolean;
          password_hash?: string | null;
        };
      };
      videos: {
        Row: {
          id: string;
          title: string | null;
          video_url: string;
          caption: string;
          rating_tag: string;
          rating_rank: number;
          rating_author_name: string | null;
          proposed_post_date: string | null;
          project_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          video_url: string;
          caption: string;
          rating_tag: string;
          rating_rank: number;
          rating_author_name?: string | null;
          proposed_post_date?: string | null;
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          video_url?: string;
          caption?: string;
          rating_tag?: string;
          rating_rank?: number;
          rating_author_name?: string | null;
          proposed_post_date?: string | null;
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      video_comments: {
        Row: {
          id: string;
          video_id: string;
          comment: string;
          author_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          video_id: string;
          comment: string;
          author_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          video_id?: string;
          comment?: string;
          author_name?: string | null;
          created_at?: string;
        };
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          caption: string;
          created_at: string;
          rating_tag: string | null;
          rating_rank: number;
          rating_author_name: string | null;
          proposed_post_date: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          caption?: string;
          created_at?: string;
          rating_tag?: string | null;
          rating_rank?: number;
          rating_author_name?: string | null;
          proposed_post_date?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_url?: string;
          caption?: string;
          created_at?: string;
          rating_tag?: string | null;
          rating_rank?: number;
          rating_author_name?: string | null;
          proposed_post_date?: string | null;
        };
      };
      project_image_comments: {
        Row: {
          id: string;
          image_id: string;
          comment: string;
          author_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_id: string;
          comment: string;
          author_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_id?: string;
          comment?: string;
          author_name?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Video = Database["public"]["Tables"]["videos"]["Row"];
export type VideoInsert = Database["public"]["Tables"]["videos"]["Insert"];
export type VideoUpdate = Database["public"]["Tables"]["videos"]["Update"];

export type VideoComment = Database["public"]["Tables"]["video_comments"]["Row"];
export type VideoCommentInsert =
  Database["public"]["Tables"]["video_comments"]["Insert"];
export type VideoCommentUpdate =
  Database["public"]["Tables"]["video_comments"]["Update"];

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

export type ProjectImage = Database["public"]["Tables"]["project_images"]["Row"];
export type ProjectImageInsert = Database["public"]["Tables"]["project_images"]["Insert"];
export type ProjectImageUpdate = Database["public"]["Tables"]["project_images"]["Update"];

export type ProjectImageComment = Database["public"]["Tables"]["project_image_comments"]["Row"];
export type ProjectImageCommentInsert =
  Database["public"]["Tables"]["project_image_comments"]["Insert"];
