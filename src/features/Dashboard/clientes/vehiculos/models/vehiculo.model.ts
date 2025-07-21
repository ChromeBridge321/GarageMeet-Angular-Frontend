export interface Model {
  model_id: number;
  name: string;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Make {
  make_id: number;
  name: string;
  created_at: Date | null;
  updated_at: Date | null;
}
