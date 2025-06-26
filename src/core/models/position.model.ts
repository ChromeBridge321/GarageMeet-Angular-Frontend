// Modelos para Cargos/Posiciones

export interface Position {
  positions_id?: number;
  name: string;
  mechanical_workshops_id: number;
  created_at?: string;
  updated_at?: string;
}

// DTOs para requests
export interface CreatePositionRequest {
  name: string;
  mechanical_workshops_id: number;
}

export interface UpdatePositionRequest {
  positions_id: number;
  name: string;
}

export interface DeletePositionRequest {
  positions_id: number;
}

export interface ListPositionsRequest {
  mechanical_workshops_id: number;
}

// DTOs para responses
export interface CreatePositionResponse {
  message: string;
  data: Position;
}

export interface UpdatePositionResponse {
  message: string;
  data: Position;
}

export interface DeletePositionResponse {
  message: string;
}

export interface ListPositionsResponse {
  message: string;
  data: Position[];
}
