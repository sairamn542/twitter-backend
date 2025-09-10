import express from "express"
import { BookMarks, Follow, GetMyProfile, GetOtherUsers, Login, Logout, Register, Unfollow } from "../controllers/userController.js"
import { isAuthentication } from "../config/auth.js"
const router = express.Router()
router.route("/register").post(Register)
router.route("/login").post(Login)
router.route("/logout").get(Logout)
router.route("/bookmark/:id").put(isAuthentication,BookMarks)
router.route("/profile/:id").get(isAuthentication, GetMyProfile)
router.route("/otheruser/:id").get(isAuthentication, GetOtherUsers)
router.route("/follow/:id").post(isAuthentication, Follow)
router.route("/unfollow/:id").post(isAuthentication, Unfollow)
export default router;