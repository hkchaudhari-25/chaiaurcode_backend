import { Router } from "express"
import {createPlaylist , getUserPlaylist , getPlaylistbyId , addVideoToPlaylist , removeVideoFromPlaylist , deletePlaylist , updatePlaylist } from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/").post(createPlaylist)

router
.route("/:playlistId")
.get(getPlaylistbyId)
.patch(updatePlaylist)
.delete(deletePlaylist);
// router.get("/test/:playlistId", (req, res) => {
//     res.json({
//         receivedPlaylistId: req.params.playlistId
//     });
// });

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

router.route("/user/:userId").patch(getUserPlaylist)

export default router 