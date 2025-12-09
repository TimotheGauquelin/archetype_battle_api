import { LoginRequest, LoginResponse } from "../../dto/auth/Login.dto";
import { RegisterRequest } from "../../dto/auth/Register.dto";
import { UserDto } from "../../dto/user/User.dto";

export interface IAuthService {
  login(user: UserDto, loginData: LoginRequest): Promise<LoginResponse>;
  register(registerData: RegisterRequest): Promise<UserDto>;
}