export interface Sale {
  services_sales_id: number;
  payment_types_id: number;
  employee: EmployeeOption;
  vehicles: VehicleOption;
  mechanical_workshops_id: number;
  date: string;
  price: number;
  services?: ServiceOption[];  // Related services
  pieces?: PieceOption[];      // Related pieces
}

export interface ServiceOption {
  services_id: number;
  name: string;
}

export interface PieceOption {
  pieces_id: number;
  name: string;
  price?: number;
}

export interface EmployeeOption {
  employees_id: number;
  name: string;
  last_name: string;
  email: string;
  cellphone_number: string;
}

export interface VehicleOption {
  vehicles_id: number;
  plates: string;
  make: string;
  model: string;
}

export interface CreateSale {
  payment_types_id: number;
  employees_id: number;
  vehicles_id: number;
  mechanical_workshops_id: number;
  date: string;
  price: number;
  services: number[];  // Array de IDs de servicios
  pieces: number[];    // Array de IDs de piezas
}

export interface UpdateSale {
  services_sales_id: number;
  payment_types_id?: number;
  employees_id?: number;
  vehicles_id?: number;
  mechanical_workshops_id?: number;
  date?: string;
  price?: number;
  services?: number[];
  pieces?: number[];
}

// Interfaces para dropdowns/selects
export interface PaymentType {
  payment_types_id: number;
  name: string;
}

export interface Employee {
  employees_id: number;
  name: string;
}

export interface Vehicle {
  vehicles_id: number;
  model: string;
  year?: number;
  brand?: string;
  license_plate?: string;
  display_name?: string; // Computed field for display
}


