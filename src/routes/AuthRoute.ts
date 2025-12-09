import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/users/UserRepository';
import { UserService } from '../services/user/UserService';
import { passwordHandler } from '../middlewares/passwordHandler';
import usernameHandler from '../middlewares/usernameHandler';

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService();
const authService = new AuthService(userRepository, userService);
const authController = new AuthController(authService, userRepository);

router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/register', usernameHandler, passwordHandler, (req, res, next) => authController.register(req, res, next));

export default router;