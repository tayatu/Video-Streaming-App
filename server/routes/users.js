import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  subscribe,
  unsubscribe,
  getLikedVideos,
  getAllSubscribedChannels,
  getAllSubscribers,
  removeSubscriber
} from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = express.Router();

router.get("/find/:id", getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/liked-videos", verifyToken, getLikedVideos);

router.put("/subscribe/:id", verifyToken, subscribe);
router.put("/unsubscribe/:id", verifyToken, unsubscribe);
router.get("/subscribed-channels", verifyToken, getAllSubscribedChannels);


router.put("/remove-subscriber/:id", verifyToken, removeSubscriber);
router.get("/subscribers", verifyToken, getAllSubscribers);

export default router;
