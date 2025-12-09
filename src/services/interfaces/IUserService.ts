import { UserDto } from "../../dto/user/User.dto";

export interface IUserService {
  generateUserToken(user: UserDto): string;
}