import { UserDto, UserModel } from "../dto/user/User.dto";

export const mapUserModelToUserDto = (user: UserModel): UserDto => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        isActive: user.is_active,
        isBanned: user.is_banned,
        hasAcceptedTermsAndConditions: user.has_accepted_terms_and_conditions,
    };
}