import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const addComment = async (req, res, next) => {
  try {
    const { videoId, desc } = req.body;
    const userId = req.user.id;

    const newComment = new Comment({
      userId,
      videoId,
      desc,
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json("Comment not found");
    }

    const video = await Video.findById(comment.videoId);
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      return res.status(200).json("The comment has been deleted.");
    }
    return res.status(403).json("You are not authorized to delete the comment");
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
