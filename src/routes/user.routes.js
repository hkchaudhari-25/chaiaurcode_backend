import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js" //for using multer storage .. and its middleware

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

export default router