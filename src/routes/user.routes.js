import { Router } from "express";
import { loginUser , logoutUser, registerUser} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()



router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]),
    registerUser
    
    )

router.route("/login").post(loginUser)

//secure routes
router.route("/logoutUser").post(verfiyJWT, logoutUser)





export default router