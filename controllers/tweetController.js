import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";

export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;
        if (!description || !id) {
            return res.status(401).json({
                message: "Fields are required",
                success: false
            })
        }
        const user = await User.findById(id).select("-password")
        await Tweet.create({
            description,
            userId: id,
            userDetails : user
        })
        return res.status(201).json({
            message: "Tweet created Successfully",
            success: true
        })
    } catch (err) {
        console.log(err)
    }
}
export const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params;
        await Tweet.findByIdAndDelete(id)
        res.status(200).json({
            message: "Tweet Delete Successfully",
            success: true
        })
    } catch (err) {
        console.log(err)
    }
}
export const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if (tweet.like.includes(loggedInUserId)) {
            await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInUserId } })
            return res.status(200).json({
                message: "User Disliked Your Tweet"
            })
        } else {
            await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInUserId } })

            return res.status(200).json({
                message: "User Liked Your Tweet"
            })
        }
    } catch (err) {
        console.log(err)
    }
}
export const getAllTweets = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedinUser = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({ userId: id })
        const followingUserTweets = await Promise.all(loggedinUser.following.map((otherUserid) => {
            return Tweet.find({ userId: otherUserid })
        }));
        res.status(200).json({
            tweets: loggedInUserTweets.concat(...followingUserTweets)
        })
    } catch (err) {
        console.log(err)
    }
}

export const getFollowingUserTweet = async (req, res) => {
    try {
        const id = req.params.id;
        const loggedinUser = await User.findById(id);
        const followingUserTweet = await Promise.all(loggedinUser.following.map((alltweet) => {
            return Tweet.find({ userId: alltweet })
        }))
        res.status(200).json({
            tweets: [].concat(...followingUserTweet)
        })
    } catch (err) {
        console.log(err)
    }
}