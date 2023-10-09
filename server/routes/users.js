import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  subscribe,
  unsubscribe,
  getLikedVideos,
  getAllSubscribedChannels,
  getAllSubscribers
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";


const router = express.Router();

//get the user
router.get("/find/:id", getUser);

//update the user
router.put("/:id", verifyToken, updateUser);

//delete the user
router.delete("/:id", verifyToken, deleteUser);

//like a video
router.get("/liked-videos", verifyToken, getLikedVideos);

router.put("/subscribe/:id", verifyToken, subscribe);

//unsubscribe a user
router.put("/unsubscribe/:id", verifyToken, unsubscribe);


router.get("/subscribed-channels", verifyToken, getAllSubscribedChannels);

router.get("/subscribers", verifyToken, getAllSubscribers);




export default router;
