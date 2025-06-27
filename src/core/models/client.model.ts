// Modelos para Clientes

export interface Person {
  peoples_id: number;
  name: string;
  last_name: string;
  email: string;
  cellphone_number: string;
  created_at?: string;
  updated_at?: string;
}

export interface Vehicle {
  vehicles_id?: number;
  clients_id?: number;
  plates: string;
  model: string;
  make: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  clients_id: number;
  mechanical_workshops_id: number;
  peoples_id: number;
  created_at?: string;
  updated_at?: string;
  person?: Person;
  vehicles?: Vehicle[];
}

// DTOs para requests
export interface CreateClientRequest {
  name: string;
  last_name: string;
  email: string;
  cellphone_number: string;
  mechanicals_id: number;
  vehicle: {
    plates: string;
    model: string;
    make: string;
  }[];
}

export interface UpdateClientRequest {
  peoples_id: number;
  clients_id: number;
  name: string;
  last_name: string;
  email: string;
  cellphone_number: string;
  vehicle: {
    vehicles_id?: number;
    plates: string;
    model: string;
    make: string;
  }[];
}

export interface DeleteClientRequest {
  clients_id: number;
  peoples_id: number;
}

export interface ListClientsRequest {
  mechanical_workshops_id: number;
}

// DTOs para responses
export interface CreateClientResponse {
  message: string;
  Person: Person;
  Client: {
    clients_id: number;
    mechanical_workshops_id: number;
    peoples_id: number;
  };
  Vehicle: Vehicle;
}

export interface UpdateClientResponse {
  message: string;
  Person: Person;
  Client_id: number;
  Vehicle: Vehicle;
}

export interface DeleteClientResponse {
  message: string;
}

export type ListClientsResponse = Client[];
