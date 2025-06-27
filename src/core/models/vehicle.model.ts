// Modelos para Vehículos

export interface Vehicle {
  vehicles_id: number;
  clients_id: number;
  plates: string;
  model: string;
  make: string;
  created_at?: string;
  updated_at?: string;
  client?: {
    clients_id: number;
    mechanical_workshops_id: number;
    peoples_id: number;
    person?: {
      peoples_id: number;
      name: string;
      last_name: string;
      email: string;
      cellphone_number: string;
    };
  };
}

// DTOs para requests
export interface ListVehiclesRequest {
  mechanical_workshops_id: number;
}

// DTOs para responses
export type ListVehiclesResponse = Vehicle[];
