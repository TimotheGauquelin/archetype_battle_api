import { UserDto } from "../user/User.dto";

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    has_accepted_terms_and_conditions: boolean;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        username: string;
        email: string;
        roles: string[];
    };
}