import {Router} from "express"
import { changeCurrentPassword, registerUser } from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js" //for using multer storage .. and its middleware
import { verifyJWT } from "../middleware/auth.middleware.js"
import { loginUser , 
         logoutUser , 
         refreshAccessToken , 
         getCurrentUser ,
         updateAccountDetails ,
         updateUserAvatar , 
         updateUserCoverImage ,
         getUserChannelProfile ,
         getwatchHistory } from "../controllers/user.controller.js"
import { verify } from "jsonwebtoken"

const router = Router()

router.route("/register").post(
    upload.fields([ // for file handling
        {
            name : "avatar",
            maxCount: 1
        },
        {
            name : "coverimage",
            maxCount : 1
        }
    ])
    ,registerUser)

router.route("/login").post(loginUser)
//secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT , getCurrentUser)
router.route("/update-account").patch(verifyJWT , updateAccountDetails)
router.route("/avatar").patch(verifyJWT , upload.single("avatar") , updateUserAvatar)

router.route("/cover-image").patch(verifyJWT , upload.single("/coverImage") , updateUserCoverImage)

router.route("/c/:username").get(verifyJWT , getUserChannelProfile)
router.route("/history").get(verifyJWT , getwatchHistory)


export default router