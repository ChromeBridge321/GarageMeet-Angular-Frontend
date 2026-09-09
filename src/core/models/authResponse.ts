export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: user;
}

interface user {
    id: number;
    email: string;
    type_user: string | null;
    name: string;
    last_name: string;
    mechanical_workshop: mechanical_workshop | null;


}

interface mechanical_workshop {
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
    municipality: {
        id: number;
        name: string;
        official_code: string;
        type: 'municipality' | 'alcaldia';
    } | null;
    state: {
        id: number;
        name: string;
        official_code: string;
        abbreviation: string | null;
    } | null;
}
