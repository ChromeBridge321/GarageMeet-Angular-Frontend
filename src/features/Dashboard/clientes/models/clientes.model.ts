export interface RESTClient {
  clientInfo:              string;
  clients_id:              number;
  peoples_id:              number;
  vehicles_id:             number;
  mechanical_workshops_id: number;
  person:                  Person;
  vehicles:                Vehicle[];
}

export interface Person {
  peoples_id:       number;
  name:             string;
  last_name:        string;
  email:            string;
  cellphone_number: string;
}

export interface Vehicle {
  vehicles_id:    number;
  plates:         string;
  makes_model_id: number;
  clients_id:     number;
  make:           string;
  model:          string;
  model_id:      number;
  make_id:       number;
}
