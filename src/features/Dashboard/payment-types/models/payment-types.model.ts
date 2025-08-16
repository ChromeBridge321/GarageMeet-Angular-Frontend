export interface PaymentType {
  payment_types_id: number;
  name: string;
  description?: string;
  mechanical_workshops_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePaymentType {
  name: string;
  description?: string;
  mechanical_workshops_id: number;
}

export interface UpdatePaymentType {
  payment_types_id: number;
  name: string;
  description?: string;
  mechanical_workshops_id: number;
}
