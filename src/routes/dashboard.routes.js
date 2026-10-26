import {Router} from "express"
import { getChannelstats , getChannelVideos } from "../controllers/dashboard.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"


const router = Router()

router.use(verifyJWT)

router.route("/stats").get(getChannelstats)

router.route("/video/:videoId").get(getChannelVideos)

export default router