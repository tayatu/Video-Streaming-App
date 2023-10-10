import express from "express";
import {
  addVideo,
  updateVideo,
  deleteVideo,
  getVideo,
  addView,
  addShareCount,
  likeVideo,
  unlikeVideo,
  getSubscribedChannelVideos,
  getRandomVideos,
  getTrendingVideos,
  getVideosByTags,
  searchVideos,
  checkVideoLiked,
  mongo_video,
  mongo_image,
} from "../controllers/video.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/multerFileStorage.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  addVideo
);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.put("/view/:id", addView);
router.put("/share/:id", addShareCount);
router.post("/like/:id", verifyToken, likeVideo);
router.post("/unlike/:id", verifyToken, unlikeVideo);
router.get("/is-liked/:id", verifyToken, checkVideoLiked);

router.get("/mongo-video", mongo_video);

router.get("/subscribed", verifyToken, getSubscribedChannelVideos);

router.get("/random", getRandomVideos);
router.get("/trends", getTrendingVideos);
router.get("/tags", getVideosByTags);
router.get("/search", searchVideos);

router.get("/images/:imageId", mongo_image);

export default router;
