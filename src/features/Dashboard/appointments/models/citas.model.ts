export interface CreaCita {
  mechanical_workshops_id: number;
  client_name:             string;
  client_email:            string;
  client_phone:            string;
  description:             string;
  created_by:              string;
}


export interface RESTCita {
  appointment_id:          number;
  mechanical_workshops_id: number;
  client_name:             string;
  client_email:            string;
  client_phone:            string;
  description:             string;
  appointment_date:        string;
  status:                  string;
  created_by:              string;
  cancellation_token:      string;
  notes:                   null;
  created_at:              Date;
  updated_at:              Date;
  workshop:                Workshop;
}

export interface Workshop {
  id:               number;
  users_id:         number;
  states_id:        number;
  cities_id:        number;
  name:             string;
  cellphone_number: string;
  email:            string;
  address:          string;
  google_maps_link: string;
}
