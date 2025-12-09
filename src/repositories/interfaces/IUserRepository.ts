import { UserDto } from "../../dto/user/User.dto";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserDto | null>;
  findByUsername(username: string): Promise<UserDto | null>;
}