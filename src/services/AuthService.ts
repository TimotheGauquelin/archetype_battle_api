import { IAuthService } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { CustomError } from '../utils/CustomError';
import { LoginRequest, LoginResponse } from '../dto/auth/Login.dto';
import { IUserService } from './interfaces/IUserService';

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private userService: IUserService
  ) { }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    this.validateLoginData(loginData);

    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new CustomError('Account is not active', 403);
    }

    if (user.isBanned) {
      throw new CustomError('Account is banned', 403);
    }

    const isValidPassword = this.userService.verifyPassword(
      loginData.password,
      user.id
    );

    if (!isValidPassword) {
      throw new CustomError('Invalid email or password', 401);
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

  private validateLoginData(data: LoginRequest): void {
    if (!data.email || !data.email.includes('@')) {
      throw new CustomError('Valid email is required', 400);
    }

    if (!data.password || data.password.length < 6) {
      throw new CustomError('Password must be at least 6 characters', 400);
    }
  }

}