import { Model } from 'sequelize';
import { Role, User } from '../../models';
import { UserDto } from '../../dto/user/User.dto';
import { IUserRepository } from '../interfaces/IUserRepository';

export class UserRepository implements IUserRepository {

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await User.findOne({
      where: { email },
      attributes: {
        exclude: ['password', 'reset_password_token'],
      },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return null;
    }

    return this.mapToDto(user);
  }

  async findByUsername(username: string): Promise<UserDto | null> {
    const user = await User.findOne({
      where: { username },
      attributes: {
        exclude: ['password', 'reset_password_token'],
      },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return null;
    }

    return this.mapToDto(user);
  }

  private mapToDto(user: Model): UserDto {
    const userData = user.toJSON() as any;
    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      isActive: userData.is_active,
      isBanned: userData.is_banned,
      hasAcceptedTermsAndConditions: userData.has_accepted_terms_and_conditions,
      roles: userData.roles?.map((role: any) => role.label) || [],
    };
  }
}