import express from "express"
import { changeUserPassword, createUser, getUser, loginUser, updateUserProfile, googleLogin } from "../controllers/userController.js"
import authorizeUser from "../lib/jwtMiddleware.js"

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login" , loginUser)
userRouter.post("/update-password", authorizeUser, changeUserPassword)
userRouter.put("/", authorizeUser, updateUserProfile)
userRouter.get("/profile", authorizeUser, getUser)
userRouter.post("/google-login", googleLogin);

export default userRouter