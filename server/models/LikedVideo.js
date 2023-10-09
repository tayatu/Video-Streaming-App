import mongoose from "mongoose";

const LikedVideo = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true }
});

export default mongoose.model("LikedVideo", LikedVideo);
