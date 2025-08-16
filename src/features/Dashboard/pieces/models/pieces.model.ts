export interface Piece {
  pieces_id: number;
  name: string;
  price: number;
  mechanical_workshops_id: number;
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
