import { UserRepository } from '../../../repositories/users/UserRepository';
import { User, Role } from '../../../models';
import { UserDto } from '../../../dto/user/User.dto';
// import { RegisterRequest } from '../../../dto/auth/Register.dto';
import { mapUserModelToUserDto } from '../../../map/user';
// import { Transaction } from 'sequelize';

jest.mock('../../../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Role: {},
}));

jest.mock('../../../map/user', () => ({
  mapUserModelToUserDto: jest.fn(),
}));

describe('UserRepository', () => {
  let userRepository: UserRepository;
  // let mockTransaction: Transaction;

  beforeEach(() => {
    userRepository = new UserRepository();
    // mockTransaction = {
    //   commit: jest.fn(),
    //   rollback: jest.fn(),
    //   finished: false,
    // } as unknown as Transaction;
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return a UserDto if the user exists', async () => {
      const email = 'testuser@archetypebattle.com';
      const mockUser = {
        id: '123',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        is_active: true,
        is_banned: false,
        has_accepted_terms_and_conditions: true,
        roles: [],
      };

      const expectedUserDto: UserDto = {
        id: '123',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        isActive: true,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
        roles: [],
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (mapUserModelToUserDto as jest.Mock).mockReturnValue(expectedUserDto);

      const result = await userRepository.findByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({
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
      expect(mapUserModelToUserDto).toHaveBeenCalledWith(mockUser as any);
      expect(result).toEqual(expectedUserDto);
    });

    it('should return null if the user does not exist', async () => {
      const email = 'usertest@example.com';
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findByEmail(email);

      expect(User.findOne).toHaveBeenCalled();
      expect(mapUserModelToUserDto).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a UserDto if the user exists', async () => {
      const username = 'TestUser';
      const mockUser = {
        id: '123',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        is_active: true,
        is_banned: false,
        has_accepted_terms_and_conditions: true,
        roles: [],
      };

      const expectedUserDto: UserDto = {
        id: '123',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        isActive: true,
        isBanned: false,
        hasAcceptedTermsAndConditions: true,
        roles: [],
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (mapUserModelToUserDto as jest.Mock).mockReturnValue(expectedUserDto);

      const result = await userRepository.findByUsername(username);

      expect(User.findOne).toHaveBeenCalledWith({
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
      expect(mapUserModelToUserDto).toHaveBeenCalledWith(mockUser as any);
      expect(result).toEqual(expectedUserDto);
    });

    it('should return null if the user does not exist', async () => {
      const username = 'nonexistent';
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findByUsername(username);

      expect(User.findOne).toHaveBeenCalled();
      expect(mapUserModelToUserDto).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});