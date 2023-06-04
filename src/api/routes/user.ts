import { UserController } from "../controller/user";
import { Router } from "express";
import { zodValidation } from "../middleware/request_validator";
import { userRegistrationSchema, userLoginSchema, userUpdatingSchema, forgotPasswordSchema, passwordResetSchema } from "../schema/user";

const userRouter = Router()

userRouter.post('/', zodValidation(userRegistrationSchema), UserController.register)
userRouter.put('/', zodValidation(userUpdatingSchema), UserController.update)
userRouter.post('/login', zodValidation(userLoginSchema), UserController.login)
userRouter.post('/logout', UserController.logout)
userRouter.post('/password/forgot', zodValidation(forgotPasswordSchema), UserController.forgotPassword)
userRouter.post('/password/reset', zodValidation(passwordResetSchema), UserController.resetPassword)

export default userRouter;