export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface SetupIntent {
  client_secret: string;
  setup_intent_id: string;
}
