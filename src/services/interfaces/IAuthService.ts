import { LoginRequest, LoginResponse } from "../../dto/auth/Login.dto";

export interface IAuthService {
  login(loginData: LoginRequest): Promise<LoginResponse>;
}