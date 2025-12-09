import { Transaction } from 'sequelize';
import { RegisterRequest } from "../../dto/auth/Register.dto";
import { UserDto, UserModel } from "../../dto/user/User.dto";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserDto | null>;
  findByUsername(username: string): Promise<UserDto | null>;
  createUser(userData: RegisterRequest, options?: { transaction?: Transaction }): Promise<UserModel>;
}