export interface Service {
  services_id: number;
  name: string;
  description?: string;
  price?: number;
  mechanical_workshops_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateService {
  name: string;
  description?: string;
  price?: number;
  mechanical_workshops_id: number;
}

export interface UpdateService {
  services_id: number;
  name: string;
  description?: string;
  price?: number;
  mechanical_workshops_id: number;
}
