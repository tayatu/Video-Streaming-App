import User from "../models/User.js";
import Video from "../models/Video.js";

import util from "util";

import LikedVideo from "../models/LikedVideo.js";
import fs from "fs";
import mongodb from "mongodb";
import { createError } from "../error.js";
import { ObjectId } from "mongodb";
import { exec } from "child_process";
import mongoose from "mongoose";
import sharp from "sharp"

const execAsync = util.promisify(exec);

const deleteLocalVideoFile = (localFilePath) => {
  fs.unlink(localFilePath, (err) => {
    if (err) {
      console.error("Error deleting local video file:", err);
    } else {
      console.log("Local video file deleted:", localFilePath);
    }
  });
};

export const init_video = async (videoPath, videoId) => {
  try {
    const client = mongoose.connection.getClient();
    const db = client.db("videos");
    const bucket = new mongodb.GridFSBucket(db);
    const inputVideoPath = `../server/public/videos/${videoPath}`;
    const resolutions = [
      { name: "720p", width: 1280, height: 720 },
      { name: "480p", width: 854, height: 480 },
      { name: "360p", width: 640, height: 360 },
    ];

    const resolutionPromises = resolutions.map(async (resolution) => {
      const { name, width, height } = resolution;
      const outputHLSPath = `../server/public/videos/${name}${videoId}.mp4`;
      const command = `ffmpeg -i ${inputVideoPath} -vf "scale=${width}:${height}" -c:v libx264 -crf 23 -c:a aac ${outputHLSPath}`;

      try {
        await execAsync(command);
        console.log(`Transcoding to ${name} completed.`);

        const videoUploadStream = bucket.openUploadStream(
          `${name}${videoId}.mp4`
        );

        const videoReadStream = fs.createReadStream(outputHLSPath);
        videoReadStream.pipe(videoUploadStream);

        await new Promise((resolve) => {
          videoUploadStream.on("finish", () => {
            console.log(`Video upload to GridFS (${name}) completed.`);
            // deleteLocalVideoFile(outputHLSPath);
            resolve();
          });
        });
      } catch (error) {
        console.error(`Error transcoding to ${name}: ${error.message}`);
      }
    });

    await Promise.all(resolutionPromises);
    // deleteLocalVideoFile(inputVideoPath);
  } catch (error) {
    console.error("Error uploading video:", error);
    next(error);
  }
};

export const init_image = async (imageURL) => {
  try {
    const client = mongoose.connection.getClient();
    const db = client.db("images");
    const bucket = new mongodb.GridFSBucket(db);
    const inputImagePath = `../server/public/images/${imageURL}`;

    const imageUploadStream = bucket.openUploadStream(`${imageURL}`);

    const imageReadStream = fs.createReadStream(inputImagePath);

    const compressedImage = sharp(imageReadStream.buffer)
    .resize({ width: 800 }) // You can adjust the dimensions as needed.
    .jpeg({ quality: 80 }) 


    compressedImage.pipe(imageUploadStream);

    await new Promise((resolve) => {
      imageUploadStream.on("finish", () => {
        // deleteLocalVideoFile(inputImagePath);
        resolve();
      });
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    next(error);
  }
};

export const mongo_video = async (req, res, next) => {
  const client = mongoose.connection.getClient();

  try {
    const { videoId, quality } = req.query;

    const db = client.db("videos");
    const bucket = new mongodb.GridFSBucket(db);

    const playlistFileName = `${quality}${videoId}.mp4`;

    const criteria = {
      filename: playlistFileName,
    };


    const video = await db.collection("fs.files").findOne(criteria);

    const videoSize = video.length;
    const start = 0;
    const end = videoSize - 1;

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const downloadStream = bucket.openDownloadStreamByName(playlistFileName);
    downloadStream.pipe(res);

    console.log("File downloaded successfully.");
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};



export const mongo_image = async (req, res, next) => {
  const client = mongoose.connection.getClient();

  try {
    const { imageId } = req.params;
    const db = client.db("images");
    const bucket = new mongodb.GridFSBucket(db);
    const imageName = `${imageId}`;
    const criteria = {
      filename: imageName,
    };
    const imageFile = await db.collection("fs.files").findOne(criteria);
    if (!imageFile) {
      return res.status(404).json({ error: "Image not found" });
    }
    const headers = {
      "Content-Type": "'application/octet-stream'",
    };
    const readStream = bucket.openDownloadStream(imageFile._id);
    res.writeHead(206, headers);
    readStream.pipe(res);
  } catch (error) {
    console.error("Error fetching and streaming image:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addVideo = async (req, res, next) => {
  try {
    const { title, desc } = req.body;
    const userId = req.user.id;
    const videoUrl = req.files.video[0].filename;
    const imgUrl = req.files.image[0].filename;
    console.log(req.files.image[0].filename);
    const newVideo = new Video({
      userId,
      title,
      desc,
      imgUrl
    });

    const savedVideo = await newVideo.save();
    init_video(videoUrl, savedVideo._id);
    init_image(imgUrl);
    res.status(201).json(savedVideo);
  } catch (err) {
    next(err);
  }
};
export const updateVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const { title, desc, videoUrl, tags } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json("Video not found");
    }

    if (req.user.id != video.userId) {
      return res.status(400).json("You are not authorized to update the video");
    }

    video.title = title;
    video.desc = desc;
    video.videoUrl = videoUrl;
    video.tags = tags;

    // Save the updated video document
    const updatedVideo = await video.save();

    res.status(200).json(updatedVideo);
  } catch (err) {
    console.log("Hell");
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted.");
    } else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};
export const addShareCount = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { shareCount: 1 },
    });
    res.status(200).json("The Share Count has been increased.");
  } catch (err) {
    next(err);
  }
};
export const likeVideo = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming you have the user's ID in req.user
    const videoId = req.params.id;

    const existingLike = await LikedVideo.findOne({
      user: userId,
      video: videoId,
    });

    if (existingLike) {
      return res.status(400).json("You've already liked this video");
    }

    const likeInteraction = new LikedVideo({
      user: userId,
      video: videoId,
    });

    await likeInteraction.save();

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
      $inc: { likes: 1 },
    });

    const updatedLikeCount = updatedVideo.likes;

    res.status(200).json({
      message: "You've liked the video",
      likeCount: updatedLikeCount,
    });
  } catch (err) {
    next(err);
  }
};

export const unlikeVideo = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming you have the user's ID in req.user
    const videoId = req.params.id;

    const existinglike = await LikedVideo.findOne({
      user: userId,
      video: videoId,
    });

    if (!existinglike) {
      return res.status(400).json("You've not liked this video");
    }

    await LikedVideo.findByIdAndDelete(existinglike.id);

    await Video.findByIdAndUpdate(videoId, {
      $inc: { likes: -1 },
    });

    res.status(200).json("You've unliked the video");
  } catch (err) {
    next(err);
  }
};

export const getRandomVideos = async (req, res, next) => {
  try {
    const numberOfVideos = 30; // Change this number as needed

    // Use the aggregate pipeline to get random videos
    const randomVideos = await Video.aggregate([
      { $sample: { size: numberOfVideos } },
    ]);

    res.status(200).json(randomVideos);
  } catch (err) {
    next(err);
  }
};

export const getTrendingVideos = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const getSubscribedChannelVideos = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find the user by ID to get their subscribedUsers array
    const user = await User.findById(userId);

    // Retrieve videos of the subscribed users
    const subscribedUserVideos = await Video.find({
      userId: { $in: user.subscribedChannels },
    });

    res.status(200).json(subscribedUserVideos);
  } catch (err) {
    next(err);
  }
};

export const getVideosByTags = async (req, res, next) => {
  try {
    const { tags } = req.query; // Assuming tags are passed as a query parameter

    // Convert the tags query parameter into an array
    const tagsArray = tags.split(",");

    // Use the find method to retrieve videos with matching tags
    const videosWithTags = await Video.find({ tags: { $in: tagsArray } });

    res.status(200).json(videosWithTags);
  } catch (err) {
    next(err);
  }
};

export const searchVideos = async (req, res, next) => {
  try {
    const { query } = req.query;
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const checkVideoLiked = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    const existingLike = await LikedVideo.findOne({
      user: userId,
      video: videoId,
    });

    if (existingLike) {
      res.status(200).json({ isLiked: true });
    } else {
      res.status(200).json({ isLiked: false });
    }
  } catch (err) {
    next(err);
  }
};
