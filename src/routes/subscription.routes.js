import {Router} from "express"
import {toggleSubscription , getSubscribedChannels , getUserChannelSubscribers} from "../routes/subscription.routes.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/c/:channelId").post(toggleSubscription)

router.route("/c/:channelId").get(getUserChannelSubscribers) //get subscribers of a channel

router.route("/u/:subsciberId").get(getSubscribedChannels) // get channels subscribed by user

export default router;