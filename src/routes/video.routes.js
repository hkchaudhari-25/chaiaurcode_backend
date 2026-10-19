import {Router} from "express";
import {
     publishVideo , getVideobyId ,  getAllVideos , updateVideo , deleteVideo , togglePublishStatus
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multur.middleware.js";

const router = Router()

router.route("/")
      .get(getAllVideos)
      .post(verifyJWT,
        upload.fields([
            {name: "videofile" , maxcount :1} ,
            {name : "thumbnail" , maxcount :1},
        ]),
        publishVideo
      );

router
    .route("/toggle/publish/:videoId")
    .patch(verifyJWT, togglePublishStatus)

router
      .route("/:videoId")
      .get(getVideobyId)
      .patch( verifyJWT , 
        upload.single("thumbnail"),
        updateVideo
      )
      .delete(verifyJWT , deleteVideo);

      export default router ;

