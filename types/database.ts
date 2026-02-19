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
      videos: {
        Row: {
          id: string;
          title: string | null;
          video_url: string;
          caption: string;
          rating_tag: string;
          rating_rank: number;
          proposed_post_date: string | null;
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
          proposed_post_date?: string | null;
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
          proposed_post_date?: string | null;
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
