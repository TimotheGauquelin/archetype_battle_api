import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/interfaces/IAuthService';
import { LoginRequest } from '../dto/auth/Login.dto';

export default class AuthController {
  constructor(private authService: IAuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginRequest = {
        email: req.body.email,
        password: req.body.password,
      };

      const result = await this.authService.login(loginData);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}