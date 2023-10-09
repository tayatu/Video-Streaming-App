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
  init_video,
  mongo_video,
  mongo_image,
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

import multer from "multer";
import fs from "fs";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../server/public/videos");
//   },
//   filename: (req, file, cb) => {
//     const originalnameWithoutSpaces = file.originalname.replace(/\s+/g, '_');

//     cb(null, Date.now() + "-" + originalnameWithoutSpaces);
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationFolder;

    // Check the file's mimetype to determine if it's a video or image
    if (file.mimetype.startsWith('video/')) {
      destinationFolder = '../server/public/videos';
    } else if (file.mimetype.startsWith('image/')) {
      destinationFolder = '../server/public/images';
    } else {
      // Handle other file types or errors as needed
      return cb(new Error('Unsupported file type'));
    }

    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const originalnameWithoutSpaces = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + "-" + originalnameWithoutSpaces);
  },
});

// const upload = multer({ storage: storage });
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/", verifyToken, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.put("/view/:id", addView);
router.put("/share/:id", addShareCount);
router.post("/like/:id", verifyToken, likeVideo);
router.post("/unlike/:id", verifyToken, unlikeVideo);
router.get("/is-liked/:id", verifyToken, checkVideoLiked);

router.get("/init-video", init_video);
router.get("/mongo-video", mongo_video);

router.get("/subscribed", verifyToken, getSubscribedChannelVideos);

router.get("/random", getRandomVideos);
router.get("/trends", getTrendingVideos);
router.get("/tags", getVideosByTags);
router.get("/search", searchVideos);


router.get("/images/:imageId", mongo_image);

export default router;
