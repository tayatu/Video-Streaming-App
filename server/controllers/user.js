import User from "../models/User.js";
import Video from "../models/Video.js";
import LikedVideo from "../models/LikedVideo.js";
import { createError } from "../error.js";


export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userIdToUpdate = req.params.id;
    const requestingUserId = req.user.id;

    if (userIdToUpdate !== requestingUserId) {
      return next(createError(403, "You are not authorized"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userIdToUpdate,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userIdToDelete = req.params.id;
    const requestingUserId = req.user.id;

    if (userIdToDelete !== requestingUserId) {
      return next(createError(403, "You are not authorized"));
    }

    const deletedUser = await User.findByIdAndRemove(userIdToDelete);

    if (!deletedUser) {
      return next(createError(404, "User not found"));
    }

    const subscribedChannels = deletedUser.subscribedChannels;

    const subscribers = deletedUser.subscribersList;

    await User.updateMany(
      { _id: { $in: subscribedChannels } },
      {
        $pull: { subscribersList: userIdToDelete }, 
        $inc: { subscribers: -1 },
      }
    );

    await User.updateMany(
      { _id: { $in: subscribers } },
      {
        $pull: { subscribedChannels: userIdToDelete },
      }
    );

    res.status(200).json("User deleted successfully");
  } catch (err) {
    next(err);
  }
};

export const getAllSubscribedChannels = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const subscribedChannelIds = user.subscribedChannels;

    const subscribedChannels = await User.find({ _id: { $in: subscribedChannelIds } });
    res.status(200).json(subscribedChannels);
  } catch (error) {
    next(error)
  }
}
export const getAllSubscribers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const subscriberIds = user.subscribersList;
    const subscribers = await User.find({ _id: { $in: subscriberIds } });
    res.status(200).json(subscribers);

  } catch (error) {
    next(error)
  }
}

export const subscribe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.id;

    const channel = await User.findById(channelId);

    if (!channel) {
      return next(createError(404, "Channel not found"));
    }

    if (channel.subscribersList.includes(userId)) {
      return next(createError(400, "You are already subscribed to this user"));
    }

    await User.findByIdAndUpdate(userId, {
      $push: { subscribedChannels: channelId },
    });

    await User.findByIdAndUpdate(channelId, {
      $push: { subscribersList: userId }, 
      $inc: { subscribers: 1 },
    });

    res.status(200).json("You have subscribed to the user");
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.id;

    const channel = await User.findById(channelId);

    if (!channel) {
      return next(createError(404, "User not found"));
    }

    if (!channel.subscribersList.includes(userId)) {
      return next(createError(400, "You are not subscribed to this user"));
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { subscribedChannels: channelId },
    });

    await User.findByIdAndUpdate(channelId, {
      $pull: { subscribersList: userId }, 
      $inc: { subscribers: -1 }, 
    });

    res.status(200).json("You have unsubscribed from the user");
  } catch (err) {
    next(err);
  }
};

export const removeSubscriber = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const subscriberId = req.params.id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return next(createError(404, "User not found"));
    }

    if (!currentUser.subscribersList.includes(currentUserId)) {
      return next(createError(400, "User is not your subscriber"));
    }

    await User.findByIdAndUpdate(subscriberId, {
      $pull: { subscribedChannels: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { subscribersList: subscriberId }, 
      $inc: { subscribers: -1 },
    });

    res.status(200).json("You have removed the subscriber");
  } catch (err) {
    next(err);
  }
};


export const getLikedVideos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const likedVideoInteractions = await LikedVideo.find({
      user: userId
    });

    const likedVideoIds = likedVideoInteractions.map(
      (interaction) => interaction.video
    );

    const likedVideoDetails = await Video.find({
      _id: { $in: likedVideoIds },
    });

    res.status(200).json(likedVideoDetails);
  } catch (err) {
    next(err);
  }
};



