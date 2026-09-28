import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js" //for using multer storage .. and its middleware
import { verifyJWT } from "../middleware/auth.middleware.js"
import { loginUser , logoutUser , refreshAccessToken } from "../controllers/user.controller.js"

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

export default router