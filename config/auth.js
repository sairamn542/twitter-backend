import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { User } from "../models/userSchema.js";
dotenv.config()
export const isAuthentication = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            })
        }
        const decode = jwt.verify(token, process.env.TOKEN_SECRET)
        const user = await User.findById(decode.userId);
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
         return res.status(401).json({
        message: "Authentication failed",
        success: false
    });
    }
}