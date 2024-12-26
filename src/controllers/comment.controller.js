import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Video }  from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.model.js"
import mongoose, { mongo }  from "mongoose"


const addComment = asyncHandler(async(req,res) =>{
    const { videoId } =req.params
    const { content } = req.body

    if(!videoId && !content ){
        throw new ApiError(400, "all videoId and content required")
    }
    
    const video = await Video.findById(videoId)
    const user = await User.findById(req.user?._id)

    if(!video && !user){
        throw new ApiError ( 400, "video or user not found ?")
    }

    const comment = await Comment.create({
        content,
        video:video._id,
        owner:user._id
    })

    if(!comment){
        throw new ApiError(400, "failed while creating comment")
    }

    const commentedVideo = await Video.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"video",
                as:"videoComments"
            }
        },
        {
            $addFields:{
                videoComments:{
                    $concatArrays:["$videoComments",[comment]]
                }
            }
        },
        {
            $project:{
                title:1,
                description:1,
                videoFile:1,
                thumbnail:1,
                duration:1,
                isPublished:1,
                owner:1,
                views:1,
                videoComments:1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200,{comment,commentedVideo},"comment added successfully"))
})

const updateComment = asyncHandler(async(req,res) =>{
    const { commentId } = req.params
    const {  content } = req.body

    if(!commentId && !content ){
        throw new ApiError ( 400," all fields are required ")

    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content:content
            }
        },{new : true}
    )
    if(!comment){
        throw new ApiError(400,"error while updating")
    }

    return res.status(200).json(new ApiResponse(200,comment,"comment updated successfully"))
})

const deleteComment = asyncHandler(async(req,res) =>{
    const { commentId } = req.params
    if(!commentId){
        throw new ApiError ( 400," commentId is  required ")

    }
    const comment = await Comment.findByIdAndDelete(commentId)
    if(!comment){
        throw new ApiError(400,"error while deleting")
    }
    return res.status(200).json(new ApiResponse(200,{},"comment deleted successfully"))

})

export {
    addComment,
    updateComment,
    deleteComment
}