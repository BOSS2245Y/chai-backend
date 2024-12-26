import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addComment,updateComment,deleteComment } from "../controllers/comment.controller.js";

const router = Router()


router.route("/addComment/:videoId").post(verifyJWT,addComment)
router.route("/updateComment/:commentId").patch(verifyJWT,updateComment)
router.route("/deleteComment/:commentId").delete(verifyJWT,deleteComment)


export default router