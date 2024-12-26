import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

import { publishAVideo,getVideoById,updateVideo,deleteVideo, togglePublicStatus, getAllVideos } from "../controllers/video.controller.js"

const router = Router()

router.route("/publish-video").post( verifyJWT, upload.fields([
    {
        name:"videoFile",
        maxCount:1
    },
    {
        name:"thumbnailFile",
        maxCount:1
    }

]) , publishAVideo)

router.route("/videos/:id").get(verifyJWT, getVideoById)
router.route("/deleteVideo/:videoId").patch(verifyJWT, deleteVideo)
router.route("/videoUpdate").patch(verifyJWT,upload.single("thumbnail"),updateVideo)
router.route("/togglePublishedStatus/:videoId").patch(verifyJWT,togglePublicStatus)
router.route("/getAllVideos").get(verifyJWT,getAllVideos)




export default router