// Modelos para Empleados

export interface Person {
  peoples_id: number;
  name: string;
  last_name: string;
  email: string;
  cellphone_number: string;
  created_at?: string;
  updated_at?: string;
}

export interface Employee {
  employees_id: number;
  mechanical_workshops_id: number;
  peoples_id: number;
  created_at?: string;
  updated_at?: string;
  person?: Person;
  positions?: EmployeePosition[];
}

export interface EmployeePosition {
  positions_id: number;
  name: string;
  mechanical_workshops_id: number;
  created_at?: string;
  updated_at?: string;
  pivot?: {
    employees_id: number;
    positions_id: number;
  };
}

// DTOs para requests
export interface CreateEmployeeRequest {
  name: string;
  last_name: string;
  email: string;
  cellphone_number: string;
  positions_id: number;
  mechanicals_id: number;
}

export interface UpdateEmployeeRequest {
  name: string;
  last_name: string;
  email: string;
  cellphone_number: string;
  positions_id: number;
  new_positions_id: number;
  peoples_id: number;
  employees_id: number;
}

export interface DeleteEmployeeRequest {
  peoples_id: number;
  employees_id: number;
}

export interface ListEmployeesRequest {
  mechanical_workshops_id: number;
}

// DTOs para responses
export interface CreateEmployeeResponse {
  message: string;
  Person: Person;
  Employee: Employee;
}

export interface UpdateEmployeeResponse {
  message: string;
  Person: Person;
  Employee: Employee;
}

export interface DeleteEmployeeResponse {
  message: string;
}

export type ListEmployeesResponse = Employee[];
