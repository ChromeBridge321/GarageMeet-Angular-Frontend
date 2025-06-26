export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: user;
}

interface user {
    id: number;
    email: string;
    mechanical_workshop: mechanical_workshop | null;

}

interface mechanical_workshop {
    id: number;
    user_id: number;
    cities_id: string;
    name: string;
    cellphone_number: string;
    email: string;
    address: string;
    google_maps_link: string;
}
