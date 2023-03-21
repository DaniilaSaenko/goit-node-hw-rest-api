const { User } = require("../models/user");

const { httpError } = require("../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const dotenv = require("dotenv");
dotenv.config();

const { KEY_SECRET } = process.env;

const userSignup = async (req, res, next) => {
  const { email, password } = req.body;
  const avatarURL = gravatar.url(email);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, avatarURL });

  try {
    await user.save();
  } catch (error) {
    if (error.message.includes("duplicate key error collection")) {
      return res.status(409).json({ message: "Email in use" });
    }
    next(error);
  }
  return res.status(201).json({
    user: {
      _id: user._id,
    },
  });
};

const getAllUsers = async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    message: users,
  });
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, KEY_SECRET, { expiresIn: "23h" });
  user.token = token;
  await User.findByIdAndUpdate(user._id, user);
  return res.status(200).json({
    token: user.token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const userLogout = async (req, res, next) => {
  const { user } = req;
  user.token = null;
  await User.findByIdAndUpdate(user._id, user);

  return res.status(204).json({});
};

const userCurrent = async (req, res, next) => {
  const { user } = req;
  if (user) {
    await User.findOne(user._id);

    return res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  }
  return res.status(401).json({ message: "Not authorized" });
};

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const userChangeAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  try {
    const avatarImg = await jimp.read(tempUpload);
    avatarImg.resize(250, 250).writeAsync(tempUpload);
  } catch (err) {
    throw httpError(500);
  }

  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, fileName);
  const avatarURL = path.join("avatars", fileName);
  await fs.rename(tempUpload, resultUpload);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
};


module.exports = {
  userSignup,
  getAllUsers,
  userLogin,
  userLogout,
  userCurrent,
  userChangeAvatar,
};
