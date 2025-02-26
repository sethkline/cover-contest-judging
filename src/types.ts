export type Contest = {
  id: string;
  name: string;
  type: 'cover' | 'bookmark';
  is_active: boolean;
  created_at: string;
};

export type AgeCategory = {
  id: string;
  name: string;
  min_age: number;
  max_age: number | null;
  created_at: string;
};

export type Entry = {
  id: string;
  contest_id: string;
  entry_number: number;
  age_category_id: string | null;
  front_image_path: string;
  back_image_path: string | null;
  participant_name: string;
  participant_age: number;
  artist_statement: string | null;
  created_at: string;
};