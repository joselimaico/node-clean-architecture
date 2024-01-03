import { UserModel } from "../../data/mongodb";
import { BcryptAdapter } from "../../config/bcrypt";
import {
  AuthDatasoruce,
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasoruceImpl implements AuthDatasoruce {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;
    try {
      const emailExists = await UserModel.findOne({ email });
      if (emailExists) throw CustomError.badRequest("User already exists");

      const user = await UserModel.create({
        name,
        email,
        password: this.hashPassword(password),
      });

      await user.save();

      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) throw CustomError.badRequest("invalid credentials");
      const isValidPassword = this.comparePassword(password, user.password);
      if (!isValidPassword) throw CustomError.badRequest("invalid credentials");
      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
