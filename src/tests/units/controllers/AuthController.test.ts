import AuthController from '../../../controllers/AuthController';
import { IAuthService } from '../../../services/interfaces/IAuthService';
import { IUserRepository } from '../../../repositories/interfaces/IUserRepository';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../../utils/CustomError';
import { LoginRequest } from '../../../dto/auth/Login.dto';
import { RegisterRequest } from '../../../dto/auth/Register.dto';
import { UserDto } from '../../../dto/user/User.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<IAuthService>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
    } as any;

    mockUserRepository = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      createUser: jest.fn(),
    } as any;

    authController = new AuthController(mockAuthService, mockUserRepository);

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 200 with a token and user data for a successful login', async () => {
      const loginData: LoginRequest = {
        email: 'testuser@archetypebattle.com',
        password: 'Password123!',
      };

      const user: UserDto = {
        id: '123',
        username: 'testuser',
        email: 'testuser@archetypebattle.com',
        isActive: true,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
        roles: ['User'],
      };

      const loginResponse = {
        token: 'mock-jwt-token',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles || [],
        },
      };

      mockRequest.body = loginData;
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(loginResponse);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
        }),
        loginData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Vous êtes connecté !',
        data: loginResponse,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with an error if the user does not exist', async () => {
      const loginData: LoginRequest = {
        email: 'nonexistent@archetypebattle.com',
        password: 'Password123!',
      };

      mockRequest.body = loginData;
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(mockAuthService.login).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email ou mot de passe incorrect',
          statusCode: 401,
        })
      );
    });

    it('should call next with an error if the account is not active', async () => {
      const loginData: LoginRequest = {
        email: 'testuser@archetypebattle.com',
        password: 'Password123!',
      };

      const user: UserDto = {
        id: '123',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        isActive: false,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
      };

      mockRequest.body = loginData;
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Votre compte n\'est pas activé',
          statusCode: 400,
        })
      );
    });

    it('should call next with an error if the terms and conditions are not accepted', async () => {
      const loginData: LoginRequest = {
        email: 'testuser@archetypebattle.com',
        password: 'Password123!',
      };

      const user: UserDto = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        isActive: true,
        isBanned: false,
        hasAcceptedTermsAndConditions: false,
      };

      mockRequest.body = loginData;
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Vous devez accepter les conditions d\'utilisation',
          statusCode: 400,
        })
      );
    });

    it('should call next with an error if the account is banned', async () => {
      const loginData: LoginRequest = {
        email: 'testuser@archetypebattle.com',
        password: 'Password123!',
      };

      const user: UserDto = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        isActive: true,
        isBanned: true,
        hasAcceptedTermsAndConditions: true,
      };

      mockRequest.body = loginData;
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Votre compte est banni',
          statusCode: 400,
        })
      );
    });
  });

  describe('register', () => {
    it('should return 201 with a success message for a successful registration', async () => {
      const registerData: RegisterRequest = {
        email: 'newuser@archetypebattle.com',
        username: 'NewUser',
        password: 'Password123!',
        has_accepted_terms_and_conditions: true,
      };

      const createdUser: UserDto = {
        id: '456',
        username: 'NewUser',
        email: 'newuser@archetypebattle.com',
        isActive: false,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
      };

      mockRequest.body = {
        email: registerData.email,
        username: registerData.username,
        password: registerData.password,
        hasAcceptedTermsAndConditions: registerData.has_accepted_terms_and_conditions,
      };

      mockAuthService.register.mockResolvedValue(createdUser);

      await authController.register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Inscription réussie',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with an error if the email or password are missing', async () => {
      mockRequest.body = {
        username: 'NewUser',
        hasAcceptedTermsAndConditions: true,
      };

      await authController.register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.register).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'L\'email et le mot de passe sont requis',
          statusCode: 400,
        })
      );
    });

    it('should call next with an error if the terms and conditions are not accepted', async () => {
      mockRequest.body = {
        email: 'newuser@archetypebattle.com',
        username: 'NewUser',
        password: 'Password123!',
        hasAcceptedTermsAndConditions: false,
      };

      await authController.register(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockAuthService.register).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Vous devez accepter les conditions d\'utilisation',
          statusCode: 400,
        })
      );
    });
  });
});


