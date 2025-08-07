export interface MechanicalREST {
  id:               number;
  users_id:         null;
  cities_id:        number;
  states_id:        number;
  name:             string;
  cellphone_number: string;
  email:            string;
  address:          string;
  google_maps_link: string;
  state:            State;
  city:             City;
}

export interface City {
  cities_id: number;
  name:      string;
}

export interface State {
  states_id: number;
  name:      string;
}

