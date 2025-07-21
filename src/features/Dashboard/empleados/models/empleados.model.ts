export interface RESTEmployee {
  employees_id: number;
  peoples_id:   number;
  person:       Person;
}

export interface Person {
  peoples_id:       number;
  name:             string;
  last_name:        string;
  email:            string;
  cellphone_number: string;
  positions:        Positions;
  pivot:            Pivot;
}

export interface Pivot {
  employees_id: number;
  positions_id: number;
}

export interface Positions {
  positions_id: number;
  name:         string;
}
