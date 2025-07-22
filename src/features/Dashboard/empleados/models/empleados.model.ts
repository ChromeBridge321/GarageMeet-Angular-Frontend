export interface RESTEmployee {
  employees_id:            number;
  mechanical_workshops_id: number;
  peoples_id:              number;
  person:                  Person;
  positions:               Position[];
}

export interface Person {
  peoples_id:       number;
  name:             string;
  last_name:        string;
  email:            string;
  cellphone_number: string;
}

export interface Position {
  positions_id:            number;
  name:                    string;
  mechanical_workshops_id: number;
  pivot:                   Pivot;
}

export interface Pivot {
  employees_id: number;
  positions_id: number;
}
