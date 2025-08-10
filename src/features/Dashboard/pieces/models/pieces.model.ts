export interface Piece {
  pieces_id: number;
  name: string;
  price: number;
  mechanical_workshops_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePiece {
  name: string;
  price: number;
  mechanical_workshops_id: number;
}

export interface UpdatePiece {
  pieces_id: number;
  name: string;
  price: number;
}
