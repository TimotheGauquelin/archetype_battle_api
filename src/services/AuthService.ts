import { IAuthService } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { CustomError } from '../utils/CustomError';
import { LoginRequest, LoginResponse } from '../dto/auth/Login.dto';
import { IUserService } from './interfaces/IUserService';
import { RegisterRequest } from '../dto/auth/Register.dto';
import { UserDto, UserModel } from '../dto/user/User.dto';
import sequelize from '../../config/Sequelize';
import { mapUserModelToUserDto } from '../map/user';
import { EmailService } from './mailing/EmailService';


export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private userService: IUserService,
    private emailService: EmailService
  ) { }

  async login(user: UserDto, loginData: LoginRequest): Promise<LoginResponse> {

    const isValidPassword = await this.userService.verifyPassword(
      loginData.password,
      user.id
    );

    if (!isValidPassword) {
      throw new CustomError('Email ou mot de passe incorrect', 401);
    }

    const token = this.userService.generateUserToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles || [],
      },
    };
  }

  async register(registerData: RegisterRequest): Promise<UserDto> {

    const { email, username, password, has_accepted_terms_and_conditions } = registerData;

    const transaction = await sequelize.transaction();

    try {
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        await transaction.rollback();
        throw new CustomError('Un utilisateur avec cet email existe déjà', 400);
      }

      const existingUsername = await this.userRepository.findByUsername(username);
      if (existingUsername) {
        await transaction.rollback();
        throw new CustomError('Un utilisateur avec ce nom d\'utilisateur existe déjà', 400);
      }

      const user = await this.userRepository.createUser(
        { 
          username, 
          email, 
          password: password,
          has_accepted_terms_and_conditions 
        }, 
        { transaction }
      );

      await this.emailService.sendWaitingApprovalEmail(user as unknown as UserModel);

      await transaction.commit();

      return mapUserModelToUserDto(user as unknown as UserModel);

    } catch (error) {
      if (transaction) {
        try {
          await transaction.rollback();
        } catch (rollbackError) {
        }
      }
      throw error;
    }
  }
}