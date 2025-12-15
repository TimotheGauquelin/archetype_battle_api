import { AuthService } from '../../../services/AuthService';
import { UserRepository } from '../../../repositories/users/UserRepository';
import { UserService } from '../../../services/user/UserService';
import { EmailService } from '../../../services/mailing/EmailService';
import { RegisterRequest } from '../../../dto/auth/Register.dto';
import { User, Role, UserRole } from '../../../models';
import { syncDatabase } from '../../../models';
import { CustomError } from '../../../utils/CustomError';
import bcrypt from 'bcryptjs';
import { LoginRequest } from '../../../dto/auth/Login.dto';

jest.mock('../../../services/mailing/EmailService');

describe('AuthService Integration Tests', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let userService: UserService;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(async () => {
    await syncDatabase(true);

    await Role.create({
      label: 'User',
    });
    await Role.create({
      label: 'Admin',
    });

    userRepository = new UserRepository();
    userService = new UserService();
    mockEmailService = {
      sendWaitingApprovalEmail: jest.fn().mockResolvedValue(undefined),
      sendMail: jest.fn().mockResolvedValue(undefined),
    } as any;

    authService = new AuthService(userRepository, userService, mockEmailService);
  });

  afterEach(async () => {
    await UserRole.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    await Role.destroy({ where: {}, force: true });
  });

  describe('register', () => {
    it('should create a user in database', async () => {

      const registerData: RegisterRequest = {
        email: 'testuser@archetypebattle.com',
        username: 'TestUser',
        password: 'Password123!',
        has_accepted_terms_and_conditions: true,
      };

      const result = await authService.register(registerData);

      expect(result).toBeDefined();
      expect(result.email).toBe(registerData.email);
      expect(result.username).toBe(registerData.username);

      const userInDb = await User.findOne({ where: { email: registerData.email } });
      expect(userInDb).not.toBeNull();
      expect(userInDb?.get('email')).toBe(registerData.email);
      expect(userInDb?.get('username')).toBe(registerData.username);

      const passwordInDb = userInDb?.get('password') as string;
      expect(passwordInDb).not.toBe(registerData.password);
      
      // check the password begin by $2a$, $2b$ or $2y$
      expect(passwordInDb).toMatch(/^\$2[aby]\$/);
    });

    it('should reject if the email already exists', async () => {
      await User.create({
        id: '550e8400-e29b-41d4-a716-446655440010',
        email: 'testuser@archetypebattle.com',
        username: 'TestUser',
        password: 'Password123!',
        has_accepted_terms_and_conditions: true,
        is_active: true,
        is_banned: false,
      });

      const registerData: RegisterRequest = {
        email: 'testuser@archetypebattle.com',
        username: 'NewUser',
        password: 'Password123!',
        has_accepted_terms_and_conditions: true,
      };

      await expect(authService.register(registerData)).rejects.toThrow(CustomError);
      await expect(authService.register(registerData)).rejects.toThrow('Un utilisateur avec cet email existe déjà');

      const users = await User.findAll({ where: { email: 'testuser@archetypebattle.com' } });
      expect(users.length).toBe(1);
    });

    it('should reject if the username already exists', async () => {
      await User.create({
        id: '550e8400-e29b-41d4-a716-446655440011',
        email: 'newuser@archetypebattle.com',
        username: 'TestUser',
        password: 'Password123!',
        has_accepted_terms_and_conditions: true,
        is_active: true,
        is_banned: false,
      });

      const registerData: RegisterRequest = {
        email: 'testuser@archetypebattle.com',
        username: 'TestUser',
        password: 'Password123!',
        has_accepted_terms_and_conditions: true,
      };

      await expect(authService.register(registerData)).rejects.toThrow(CustomError);
      await expect(authService.register(registerData)).rejects.toThrow('Un utilisateur avec ce nom d\'utilisateur existe déjà');
    });

    it('should verify that the password is correctly hashed with bcrypt', async () => {
      const registerData: RegisterRequest = {
        email: 'bcrypt-test@example.com',
        username: 'bcryptuser',
        password: 'MySecurePassword123!',
        has_accepted_terms_and_conditions: true,
      };

      await authService.register(registerData);

      const userInDb = await User.findOne({ where: { email: registerData.email } });
      const hashedPassword = userInDb?.get('password') as string;

      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);

      const isValid = await bcrypt.compare(registerData.password, hashedPassword);
      expect(isValid).toBe(true);
    });
  });

  describe('login', () => {
    it('should allow the login with an existing user in the database', async () => {
      const plainPassword = 'CorrectPassword123!';

      const user = await User.create({
        id: '550e8400-e29b-41d4-a716-446655440012',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        password: plainPassword,
        has_accepted_terms_and_conditions: true,
        is_active: true,
        is_banned: false,
      });

      const userRole = await Role.findOne({ where: { label: 'User' } });
      if (userRole) {
        await UserRole.create({
          user_id: user.get('id') as string,
          role_id: userRole.get('id') as string,
        });
      }

      const userDto = await userRepository.findByEmail('testuser@archetypebattle.com');
      expect(userDto).not.toBeNull();

      const loginData: LoginRequest = {
        email: 'testuser@archetypebattle.com',
        password: plainPassword,
      };

      const result = await authService.login(userDto!, loginData);

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('testuser@archetypebattle.com');
      expect(result.user.username).toBe('TestUser');
    });

    it('should reject the login with a wrong password', async () => {
      const plainPassword = 'CorrectPassword123!';
      const wrongPassword = 'WrongPassword123!';

      await User.create({
        id: '550e8400-e29b-41d4-a716-446655440013',
        username: 'TestUser',
        email: 'testuser@archetypebattle.com',
        password: plainPassword,
        has_accepted_terms_and_conditions: true,
        is_active: true,
        is_banned: false,
      });

      const userDto = await userRepository.findByEmail('testuser@archetypebattle.com');
      expect(userDto).not.toBeNull();

      const loginData: LoginRequest = {
        email: 'testuser@archetypebattle.com',
        password: wrongPassword,
      };

      await expect(authService.login(userDto!, loginData)).rejects.toThrow(CustomError);
      await expect(authService.login(userDto!, loginData)).rejects.toThrow('Email ou mot de passe incorrect');
    });
  });  
});