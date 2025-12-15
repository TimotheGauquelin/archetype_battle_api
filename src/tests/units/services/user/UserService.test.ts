import { UserService } from '../../../../services/user/UserService';
// import { CustomError } from '../../../../utils/CustomError';
import { UserDto } from '../../../../dto/user/User.dto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CustomError } from '../../../../utils/CustomError';
import { User } from '../../../../models';

jest.mock('../../../../models', () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateUserToken', () => {
    it('should generate a valid JWT token with user data', () => {
      const user: UserDto = {
        id: '123',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        isActive: true,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
        roles: ['User'],
      };

      const expectedToken = 'mock-jwt-token';
      (jwt.sign as jest.Mock).mockReturnValue(expectedToken);

      const token = userService.generateUserToken(user);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          roles: user.roles,
        },
        'test-secret-key',
        { expiresIn: '2h' }
      );

      expect(token).toBe(expectedToken);
    });

    it('devrait lancer une erreur si JWT_SECRET n\'est pas configuré', () => {
      delete process.env.JWT_SECRET;
      const user: UserDto = {
        id: '123',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        isActive: true,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
      };

      expect(() => userService.generateUserToken(user)).toThrow(CustomError);
      expect(() => userService.generateUserToken(user)).toThrow('JWT_SECRET is not configured');
    });
  });

  describe('verifyPassword', () => {
    it('should return true if the password is correct', async () => {
      const userId = '123';
      const password = 'password123';
      const hashedPassword = '$2b$10$hashedpassword';

      const mockUser = {
        get: jest.fn().mockReturnValue(hashedPassword),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await userService.verifyPassword(password, userId);

      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false if the password is incorrect', async () => {
      const userId = '123';
      const password = 'wrongpassword';
      const hashedPassword = '$2b$10$hashedpassword';

      const mockUser = {
        get: jest.fn().mockReturnValue(hashedPassword),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await userService.verifyPassword(password, userId);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = '999';
      const password = 'password123';

      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(userService.verifyPassword(password, userId)).rejects.toThrow(CustomError);
      await expect(userService.verifyPassword(password, userId)).rejects.toThrow('Utilisateur non trouvé');
    });
  });
});


