import {Router} from "express"
import {toggleSubscription , getSubscribedChannels , getUserChannelSubscribers} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/c/:channelId").post(toggleSubscription)

router.route("/c/:channelId").get(getUserChannelSubscribers) //get subscribers of a channel

router.route("/u/:subscriberId").get(getSubscribedChannels) // get channels subscribed by user

export default router;