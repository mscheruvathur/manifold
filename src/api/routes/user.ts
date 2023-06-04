import { UserController } from "../controller/user";
import { Router } from "express";

const userRouter = Router()

userRouter.post('/', UserController.register)

export default userRouter;