import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createTweet , getUserTweets, updateTweet,deleteTweet } from "../controllers/tweet.controller.js";



const router = Router()

router.route("/createTweet").post(verifyJWT,createTweet)
router.route("/getUserTweet/:userId").get(verifyJWT,getUserTweets)
router.route("/updateTweet/:tweetId").patch(verifyJWT,updateTweet)
router.route("/deleteTweet/:tweetId").delete(verifyJWT,deleteTweet)




export default router