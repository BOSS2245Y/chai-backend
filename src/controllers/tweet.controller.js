import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Tweet} from "../models/tweet.model.js"
import mongoose, { mongo }  from "mongoose"


const createTweet = asyncHandler(async(req,res) =>{
    
    const { content }= req.body
    if(!content){
        throw new ApiError(400, "content is required")

    }
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(400,"user not found ")

    }

    const tweet = await Tweet.create(
        {
            content,
            owner:user
        }
    )
    if(!tweet){
        throw new ApiError(400,"error while tweeting")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"tweet created successfully"))
})

const getUserTweets = asyncHandler(async(req,res) =>{
    const { userId } = req.params
    if(!userId){
        throw new ApiError(400, "userId Id required")
    }

    const allTweets = await Tweet.find({owner:userId})

    if(!allTweets){
        throw new ApiError(400,"something went wrong while getting tweets")
    }



return res
.status(200)
.json(
    new ApiResponse(200,allTweets,"all tweets are  fetched")
)
})

const updateTweet = asyncHandler(async(req,res) => {
    const {tweetId}= req.params
    const {content} = req.body

    if(!tweetId && !content){
        throw new ApiError(400,"tweetId and content is required")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content:content
            }
        },{new:true}
    )

    if(!tweet){
        throw new ApiError(400, "error while updating ")
    }

    return res
    .status(200)
    .json(
        200,new ApiResponse(200,tweet,"tweet is updated successfully")
    )
})

const deleteTweet = asyncHandler(async(req,res) => {
    const {tweetId}= req.params
    if(!tweetId){
        throw new ApiError(400, "tweetId is required")
    }
     

    const tweet = await Tweet.findByIdAndDelete(tweetId)
    if(!tweet){
        throw new ApiError(400, "error while deleting tweet")
    }

    return res.status(200).json(new ApiResponse(200,{},"tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}