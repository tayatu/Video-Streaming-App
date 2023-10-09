import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({name, email, password: hash });

    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (err) {
    next(err);
  }
};

// user is signin by name not email
export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });

    if (!user) return next(createError(404, "Invalid Username"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Invalid Password"));

    const token = jwt.sign({ id: user._id }, process.env.JWT);

    delete user._doc.password;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(user);
  } catch (err) {
    next(err);
  }
};