import express from "express"
import { isAuthentication } from "../config/auth.js";
import { createTweet, deleteTweet, getAllTweets, getFollowingUserTweet, likeOrDislike } from "../controllers/tweetController.js";
const router = express.Router();
router.route("/create").post(isAuthentication, createTweet)
router.route("/delete/:id").delete(isAuthentication,deleteTweet)
router.route("/like/:id").put(isAuthentication,likeOrDislike)
router.route("/alltweets/:id").get(isAuthentication,getAllTweets)
router.route("/followingtweets/:id").get(isAuthentication,getFollowingUserTweet)
export default router;