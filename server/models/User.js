import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    img: {
      type: String,
      default: 'https://img.icons8.com/ios-glyphs/30/person-male.png'
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribersList: {
      type: [String],
    },
    subscribedChannels: {
      type: [String],
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
