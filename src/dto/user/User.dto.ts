export interface UserModel {
    id: string;
    username: string;
    email: string;
    is_active: boolean;
    is_banned: boolean;
    has_accepted_terms_and_conditions: boolean;
}

export interface UserDto {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    isBanned: boolean;
    hasAcceptedTermsAndConditions: boolean;
    roles?: string[];
}

export interface UserTokenDto {
    id: string;
    username: string;
    email: string;
    roles?: string[];
}