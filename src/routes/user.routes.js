import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js" //for using multer storage .. and its middleware
import { verifyJWT } from "../middleware/auth.middleware.js"

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

router.route.apply("/logout").post(verifyJWT,logOutUser)


export default router