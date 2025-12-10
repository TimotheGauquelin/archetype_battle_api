import { UserDto, UserModel } from "../../dto/user/User.dto";
import { CustomError } from "../../utils/CustomError";
import jwt from 'jsonwebtoken';
import { IUserService } from "../interfaces/IUserService";
import { User } from "../../models";
import bcrypt from 'bcryptjs';

export class UserService implements IUserService {

    public generateUserToken(user: UserDto): string {
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles || [],
        };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new CustomError('JWT_SECRET is not configured', 500);
        }

        return jwt.sign(payload, secret, { expiresIn: '2h' });
    }

    public async verifyPassword(password: string, userId: string): Promise<boolean> {
        const user = await User.findByPk(userId);
    
        if (!user || !user.get('password')) {
          throw new CustomError('Utilisateur non trouvé', 404);
        }
    
        const isValidPassword = await bcrypt.compare(password, user.get('password') as string);
        return isValidPassword;
    }

    public async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}
