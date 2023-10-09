import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import LikedVideo from "../models/LikedVideo.js";

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and exclude the password field
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Return the user data (without the password field)
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
      return res.status(403).json("You are not authorized to update this user");
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
      return res.status(403).json("You are not authorized to delete this user");
    }

    // Find the user to be deleted
    const deletedUser = await User.findByIdAndRemove(userIdToDelete);

    if (!deletedUser) {
      return res.status(404).json("User not found");
    }

    // Get the IDs of channels the user was subscribed to
    const subscribedChannels = deletedUser.subscribedChannels;

    // Get the IDs of users who were subscribed to this user
    const subscribers = deletedUser.subscribersList;

    // Update each channel's subscription data
    await User.updateMany(
      { _id: { $in: subscribedChannels } },
      {
        $pull: { subscribersList: userIdToDelete }, // Remove the user ID from subscribersList
        $inc: { subscribers: -1 }, // Decrement the subscribers count
      }
    );

    // Update the subscribersList of users who were subscribed to this user
    await User.updateMany(
      { _id: { $in: subscribers } },
      {
        $pull: { subscribedChannels: userIdToDelete }, // Remove the user ID from subscribedChannels
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

    console.log(req.user);

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

    // Check if the user is already subscribed
    const channel = await User.findById(channelId);

    if (channel.subscribersList.includes(userId)) {
      return res.status(400).json("You are already subscribed to this user");
    }

    await User.findByIdAndUpdate(userId, {
      $push: { subscribedChannels: channelId },
    });

    // If the user is not already subscribed, update the channel
    await User.findByIdAndUpdate(channelId, {
      $push: { subscribersList: userId }, // Add subscriber's ID to the list
      $inc: { subscribers: 1 }, // Increment the subscribers count
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

    // Check if the user is already subscribed
    const channel = await User.findById(channelId);

    if (!channel.subscribersList.includes(userId)) {
      return res.status(400).json("You are not subscribed to this user");
    }

    // If the user is subscribed, update the subscriptions
    await User.findByIdAndUpdate(userId, {
      $pull: { subscribedChannels: channelId },
    });

    // Update the channel's subscribersList and decrement the subscribers count
    await User.findByIdAndUpdate(channelId, {
      $pull: { subscribersList: userId }, // Remove subscriber's ID from the list
      $inc: { subscribers: -1 }, // Decrement the subscribers count
    });

    res.status(200).json("You have unsubscribed from the user");
  } catch (err) {
    next(err);
  }
};

export const getLikedVideos = async (req, res, next) => {
  try {
    const userId = req.user.id;


    // Find all liked video interactions by the user
    const likedVideoInteractions = await LikedVideo.find({
      user: userId
    });

    // Extract the video IDs from the liked interactions
    const likedVideoIds = likedVideoInteractions.map(
      (interaction) => interaction.video
    );

    // Fetch video details for the liked video IDs
    const likedVideoDetails = await Video.find({
      _id: { $in: likedVideoIds },
    });

    res.status(200).json(likedVideoDetails);
  } catch (err) {
    next(err);
  }
};



