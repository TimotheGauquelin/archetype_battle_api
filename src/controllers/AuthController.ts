import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/interfaces/IAuthService';
import { LoginRequest } from '../dto/auth/Login.dto';
import { CustomError } from '../utils/CustomError';
import { RegisterRequest } from '../dto/auth/Register.dto';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { UserDto, UserTokenDto } from '../dto/user/User.dto';

export default class AuthController {
  constructor(
    private authService: IAuthService, 
    private userRepository: IUserRepository
  ) { }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { email } = req.body;

    try {

      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new CustomError('Email ou mot de passe incorrect', 401);
      }
  
      if (!user.isActive) {
        throw new CustomError('Votre compte n\'est pas activé', 400);
      }

      if (!user.hasAcceptedTermsAndConditions) {
        throw new CustomError('Vous devez accepter les conditions d\'utilisation', 400);
      }
  
      if (user.isBanned) {
        throw new CustomError('Votre compte est banni', 400);
      }

      const loginData: LoginRequest = {
        email: req.body.email,
        password: req.body.password,
      };

      const userData: UserTokenDto = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles || [],
      };

      const result = await this.authService.login(userData as UserDto, loginData);

      res.status(200).json({
        message: "Vous êtes connecté !",
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const { email, password, username, hasAcceptedTermsAndConditions } = req.body;

      if (!email || !password) {
        throw new CustomError("L'email et le mot de passe sont requis", 400);
      }

      if (!hasAcceptedTermsAndConditions) {
        throw new CustomError('Vous devez accepter les conditions d\'utilisation', 400);
      }

      const registerData: RegisterRequest = {
        email: email,
        username: username,
        password: password,
        has_accepted_terms_and_conditions: hasAcceptedTermsAndConditions,
      };

      await this.authService.register(registerData);

      res.status(201).json({
        success: true,
        message: "Inscription réussie",
      });

    } catch (error) {
      next(error);
    }
  };
}