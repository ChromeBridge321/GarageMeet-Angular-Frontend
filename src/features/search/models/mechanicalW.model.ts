export interface MechanicalREST {
  id: number;
  users_id: number;
  municipality_id: number;
  name: string;
  cellphone_number: string;
  email: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  google_maps_link: string | null;
  state: State | null;
  municipality: Municipality | null;
}

export interface Municipality {
  id: number;
  name:      string;
  official_code: string;
  type: 'municipality' | 'alcaldia';
}

export interface State {
  id: number;
  name:      string;
  official_code: string;
  abbreviation: string | null;
}
