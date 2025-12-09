import { UserDto } from "../../dto/user/User.dto";

export interface IUserService {
  generateUserToken(user: UserDto): string;
  verifyPassword(password: string, userId: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}