import { AuthService } from '../../../services/AuthService';
import { UserRepository } from '../../../repositories/users/UserRepository';
import { UserService } from '../../../services/user/UserService';
import { EmailService } from '../../../services/mailing/EmailService';
import { CustomError } from '../../../utils/CustomError';
import { LoginRequest, LoginResponse } from '../../../dto/auth/Login.dto';
import { UserDto, UserModel } from '../../../dto/user/User.dto';

jest.mock('../../../repositories/users/UserRepository');
jest.mock('../../../services/user/UserService');
jest.mock('../../../services/mailing/EmailService');
jest.mock('../../../map/user');

jest.mock('../../../../config/Sequelize', () => {
  const transaction = {
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
  };
  return {
    __esModule: true,
    default: {
      transaction: jest.fn().mockResolvedValue(transaction),
    },
  };
});

import sequelize from '../../../../config/Sequelize';
import { RegisterRequest } from '../../../dto/auth/Register.dto';
import { mapUserModelToUserDto } from '../../../map/user';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserService: jest.Mocked<UserService>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    (sequelize.transaction as jest.Mock).mockClear();

    mockUserRepository = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      createUser: jest.fn(),
    } as any;

    mockUserService = {
      verifyPassword: jest.fn(),
      generateUserToken: jest.fn(),
      hashPassword: jest.fn(),
    } as any;

    mockEmailService = {
      sendWaitingApprovalEmail: jest.fn(),
      sendMail: jest.fn(),
    } as any;

    authService = new AuthService(mockUserRepository, mockUserService, mockEmailService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token and user data with valid credentials', async () => {
      const user: UserDto = {
        id: '123',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        isActive: true,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
        roles: ['User'],
      };

      const loginData: LoginRequest = {
        email: 'testuser@archetypebattle.com',
        password: 'Password123!',
      };

      const expectedToken = 'mock-jwt-token';
      const expectedResponse: LoginResponse = {
        token: expectedToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles || [],
        },
      };

      mockUserService.verifyPassword.mockResolvedValue(true);
      mockUserService.generateUserToken.mockReturnValue(expectedToken);

      const result = await authService.login(user, loginData);

      expect(mockUserService.verifyPassword).toHaveBeenCalledWith(loginData.password, user.id);
      expect(mockUserService.generateUserToken).toHaveBeenCalledWith(user);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if the password is incorrect', async () => {
      const user: UserDto = {
        id: '123',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        isActive: true,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
      };

      const loginData: LoginRequest = {
        email: 'testuser@archetypebattle.com',
        password: 'WrongPassword123!',
      };

      mockUserService.verifyPassword.mockResolvedValue(false);

      await expect(authService.login(user, loginData)).rejects.toThrow(CustomError);
      await expect(authService.login(user, loginData)).rejects.toThrow('Email ou mot de passe incorrect');
      expect(mockUserService.generateUserToken).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should create a user with valid data', async () => {
      const registerData: RegisterRequest = {
        email: 'testuser@archetypebattle.com',
        username: 'TestUser',
        password: 'Password123!',
        has_accepted_terms_and_conditions: true,
      };

      const mockCreatedUser: UserModel = {
        id: '456',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        is_active: false,
        is_banned: false,
        has_accepted_terms_and_conditions: true,
      };

      const expectedUserDto: UserDto = {
        id: '456',
        username: 'newuser',
        email: 'newuser@example.com',
        isActive: false,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
        roles: [],
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockUserRepository.createUser.mockResolvedValue(mockCreatedUser as any);
      (mapUserModelToUserDto as jest.Mock).mockReturnValue(expectedUserDto);

      const result = await authService.register(registerData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(registerData.username);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(
        {
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          has_accepted_terms_and_conditions: registerData.has_accepted_terms_and_conditions,
        },
        { transaction: expect.any(Object) }
      );
      expect(mockEmailService.sendWaitingApprovalEmail).toHaveBeenCalledWith(mockCreatedUser as any);
      expect(sequelize.transaction).toHaveBeenCalled();
      expect(result).toEqual(expectedUserDto);
    });

    it('should reject if the email already exists', async () => {
      const registerData: RegisterRequest = {
        email: 'existinguser@archetypebattle.com',
        username: 'ExistingUser',
        password: 'Password123!',
        has_accepted_terms_and_conditions: true,
      };

      const existingUser: UserDto = {
        id: '123',
        username: 'ExistingUser',
        email: 'existinguser@archetypebattle.com',
        isActive: true,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(authService.register(registerData)).rejects.toThrow(CustomError);
      await expect(authService.register(registerData)).rejects.toThrow('Un utilisateur avec cet email existe déjà');
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
      expect(sequelize.transaction).toHaveBeenCalled();
    });

    it('should reject if the username already exists', async () => {
      const registerData: RegisterRequest = {
        email: 'newuser@archetypebattle.com',
        username: 'ExistingUser',
        password: 'Password123!',
        has_accepted_terms_and_conditions: true,
      };

      const existingUser: UserDto = {
        id: '123',
        username: 'ExistingUser',
        email: 'existinguser@archetypebattle.com',
        isActive: true,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByUsername.mockResolvedValue(existingUser);

      await expect(authService.register(registerData)).rejects.toThrow(CustomError);
      await expect(authService.register(registerData)).rejects.toThrow('Un utilisateur avec ce nom d\'utilisateur existe déjà');
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
      expect(sequelize.transaction).toHaveBeenCalled();
    });

    it('should rollback the transaction in case of error', async () => {
      const registerData: RegisterRequest = {
        email: 'newuser@archetypebattle.com',
        username: 'NewUser',
        password: 'Password123!',
        has_accepted_terms_and_conditions: true,
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockUserRepository.createUser.mockRejectedValue(new Error('Database error'));

      await expect(authService.register(registerData)).rejects.toThrow('Database error');
      expect(sequelize.transaction).toHaveBeenCalled();
      expect(mockEmailService.sendWaitingApprovalEmail).not.toHaveBeenCalled();
    });
  });
});


