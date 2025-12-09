import { Transaction } from 'sequelize';
import { Role, User } from '../../models';
import { UserDto, UserModel } from '../../dto/user/User.dto';
import { IUserRepository } from '../interfaces/IUserRepository';
import { RegisterRequest } from '../../dto/auth/Register.dto';
import { mapUserModelToUserDto } from '../../map/user';

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

    return mapUserModelToUserDto(user as unknown as UserModel);
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

    return mapUserModelToUserDto(user as unknown as UserModel);
  }

  async createUser(userData: RegisterRequest, options?: { transaction?: Transaction }): Promise<UserModel> {

    const { username, email, password, has_accepted_terms_and_conditions } = userData;
    
    const user = await User.create({
      username,
      email,
      password,
      has_accepted_terms_and_conditions,
    }, {
      transaction: options?.transaction,
    });

    return user as unknown as UserModel;
  }
}