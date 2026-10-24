import Router from "express";
import {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    } from "../routes/comments.routes.js"

import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/:videoId")
        .get(getVideoComments)
        .post(addComment)
        
router.route("/:commentId")
        .delete(deleteComment)
        .patch(updateComment)

        export default router