export type LocationType = 'state' | 'municipality';

export interface LocationOption {
  id: number;
  type: LocationType;
  name: string;
  label: string;
  official_code: string;
  abbreviation?: string | null;
  state?: StateLocation | null;
}

export interface StateLocation {
  id: number;
  name: string;
  official_code: string;
  abbreviation?: string | null;
}
