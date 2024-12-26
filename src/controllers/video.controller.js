import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video} from "../models/video.model.js"
import mongoose, { mongo }  from "mongoose"

import jwt from "jsonwebtoken"






const publishAVideo= asyncHandler(async (req,res) =>{
    const {title, description}= req.body

    if (
        [title,description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }



    const videoLocalPath = req.files?.videoFile[0]?.path;
    console.log("videoLocalPath",videoLocalPath)

    if (!videoLocalPath) {
        throw new ApiError(400, "videoFile file is required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)

    // console.log("videoFile",videoFile)

    if (!videoFile) {
        throw new ApiError(400, "videoFile file is required2")

    }

    const thumbnailLocalPath = req.files?.thumbnailFile[0]?.path;
    
    if (!videoLocalPath) {
        throw new ApiError(400, "thumbnailFile file is required")
    }

    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath)

    
    if (!thumbnailFile) {
        throw new ApiError(400, "thumbnailFile file is required2")

    }

    

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnailFile: thumbnailFile?.url || "", // Add thumbnail 
        title,
        description,
        duration:videoFile.duration, // Add duration
        views: 1,
        isPublished: true,
        
       
    })

    const uploadedVideo = await Video.findById(video._id)
    if (!uploadedVideo) {
        throw new ApiError(500, "Something went wrong while uploading video");

    }

    return res.status(201).json(
        new ApiResponse(200, video, "video uploaded successfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { id } = req.params
    
       
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400,"Invalid video id ")
        }
        const video = await Video.findById(id);
        if (!video) {
        throw new ApiError(404, "Video not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, video, "Video fetched successfully"));
   
});
  

const updateVideo= asyncHandler(async(req,res) =>{

    const { videoId} = req.params

    const { title, description} = req.body

    const thumbnailLocalPath = req.file?.path

    if(!title ||  !description || !thumbnailLocalPath){
        throw new ApiError(400,"All fields are required")
    }
     const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
     if(!thumbnail.url){
        throw new ApiError(400,"Thumbnail is required")
     }
    
     const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title:title,
                description:description,
                thumbnail:thumbnail.url
            }
        },{new:true}
     )
      
    
    return res
        .status(200)
        .json(
            new ApiResponse(200,{}, "video details updated successfully")
        )


})

const deleteVideo = asyncHandler(async(req,res) =>{
    const {videoId} = req.params

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "invalid video id ")
    }
    
    const video = await Video.findByIdAndDelete(videoId)
    if(!video){
        throw new ApiError(401,"video not found ")
    }

    return res
    .status(200)
    .json(200,"video has been deleted ")

})

const togglePublicStatus = asyncHandler(async(req,res) => {
    const { videoId } = req.params
    const { title } = req.body
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "invalid video id ")
    }

    const video = await Video.findById( videoId)

    video.title=title
    await video.save({validateBeforeSave:false})
       
        
   

     if(!video){
        throw new ApiError(401,"video not found ")
    }

   
    return res
    .status(200)
    .json(200,video,"Video publish status is updated ")



    




})

const getAllVideos = asyncHandler(async(req,res) => {
    const user = await User.aggregate([
        
            {
              $match: {
                _id:new mongoose.Types.ObjectId(req.user._id)
              },
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"watchHistory",
                    foreignField:"_id",
                    as:"watchHistory",
                }
            },
            {
              $project: {
                _id: 1,
                thumbnailFile: 1,
                title: 1,
                description: 1,
                duration: 1,
              },
            },
          
    ])
    if(!video || video.length===0){
        throw new ApiError(401,"no video ")
    }

    return res
    .status(200)
    .json(200, video[0],"all videos are fetched")
})


export {
    publishAVideo,
    getVideoById ,
    updateVideo,
    deleteVideo,
    togglePublicStatus,
    getAllVideos
}
      

