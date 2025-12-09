export interface UserDto {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    isBanned: boolean;
    hasAcceptedTermsAndConditions: boolean;
    roles?: string[];
}