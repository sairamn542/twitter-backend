import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs"
import jwt from"jsonwebtoken"
export const Register = async (req, res)=> {
    try {
        const{name, username, email, password} = req.body;
        if(!name || !username || !email || !password) {
            return res.status(401).json({
                message : "All fields are required",
                success : false
            })
        }
        const user = await User.findOne({email});
        if(user) {
            return res.status(401).json({
                message : "user already exists",
                success : false
            })
        }
        const hashedPassword = await bcryptjs.hash(password, 16)
        await User.create({
            name, username, email, password : hashedPassword
        })
        return res.status(201).json({
            message : "Account created successfully",
            success : true
        })
    } catch(err) {
        console.log(true)
    }
}

export const Login = async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(401).json({
                message : "All fields are required",
                success : false
            })
        }
        const user = await User.findOne({email})
        if(!user) {
            return res.status(401).json({
                message : "Email and password incorrect",
                success : false
            })
        }
        const isMatch =  bcryptjs.compare(password, user.password)
        if(!isMatch) {
            return res.status(401).json({
                message : "Email && password required",
                success : false
            })
        }
        const tokenData = {
            userId : user._id
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn : "1d"})
        return res.status(201).cookie("token", token, {expiresIn : "1d", httpOnly : true}).json({
            message : `Welcome back ${user.name}`,
            user,
            success : true
        })
    } catch(err) {
        console.log(err);
    }
}
export const Logout = (req,res)=>{
    return res.cookie("token", "", {expiresIn : new Date(Date.now())}).json({
        message : "User loggesout successfully",
        success : true
    })
}
export const BookMarks = async (req,res)=>{
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId)
        if(user.bookmark.includes(tweetId)) {
            await User.findByIdAndUpdate(loggedInUserId, {$pull : {bookmark : tweetId}})
            return res.status(200).json({
                message : "Removed from Bookmark",
            })
        } else {
            await User.findByIdAndUpdate(loggedInUserId, {$push : {bookmark : tweetId}})
            return res.status(200).json({
                message : "Saved to Bookmark",
            })
        }
    } catch(err) {
        console.log(err)
    }
}
export const GetMyProfile = async (req, res)=> {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user
        })
    } catch(err) {
        console.log(err)
    }
}
export const GetOtherUsers = async (req,res)=>{
    try {
        const {id} = req.params;
        const otherUsers = await User.find({_id : {$ne:id}}).select("-password")
        if(!otherUsers)  {
            return res.status(401).json({
                message : "No users found"
            })
        }
        return res.status(200).json({
            otherUsers
        })
    } catch(err){
        console.log(err)
    }
}

export const Follow = async (req, res)=>{
    try {
        const loggedInUserId = req.body.id;
        const UserId = req.params.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(UserId);
        if(!user.followers.includes(loggedInUserId)) {
            await user.updateOne({$push : {followers : loggedInUserId}})
            await loggedInUser.updateOne({$push : {following : UserId}})
        } else {
            return res.status(400).json({
                message : `user already follow to ${user.name}`
            })
        }
        return res.status(200).json({
            message : `${loggedInUser.name} recently follw to ${user.name}`
        })
    } catch(err) {
        console.log(err)
    }
}
export const Unfollow = async (req, res)=> {
    try {
        const loggedinUserId = req.body.id;
        const userId = req.params.id;
        const loggedinUser = await User.findById(loggedinUserId);
        const user = await User.findById(userId);
        if(loggedinUser.following.includes(userId)) {
            await loggedinUser.updateOne({$pull : {following : userId}})
            await user.updateOne({$pull : {followers : loggedinUserId}})
        } else {
            return res.status(400).json({
                message : `user has not followed yet`
            })
        }
        return res.status(200).json({
            message : `${loggedinUser.name} unfollow ${user.name}`
        })
    }  catch(err) {
        console.log(err)
    }
}

