import { UserEntity } from "../entities/user.entity";
import { LoginUserDto, RegisterUserDto } from "..";

export abstract class AuthDatasoruce {
  abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
