import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDatasoruceImpl, AuthRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const database = new AuthDatasoruceImpl();
    const authRepository = new AuthRepositoryImpl(database);

    const controller = new AuthController(authRepository);
    router.use("/login", controller.loginUser);
    router.use("/register", controller.registerUser);

    router.get("/", [AuthMiddleware.validateJWT], controller.getUsers);

    return router;
  }
}
