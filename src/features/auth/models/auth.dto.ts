export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    name: string;
    last_name: string;
    email: string;
    password: string;
    type_user: number;
}
