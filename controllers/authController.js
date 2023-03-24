const { User } = require("../models/user");
const path = require("path");
const jimp = require("jimp");
const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");

const { httpError, tryCatchWrapper, sendEmail } = require("../helpers");

// const { nanoid } = require("nanoid");

const dotenv = require("dotenv");
dotenv.config();

const { KEY_SECRET, BASE_URL } = process.env;

const userSignup = async (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = Date.now().toString();
  const avatarURL = gravatar.url(email);
  const user = await User.create({
    email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Email verification",
    html: `<p>Please, confirm your email <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify your email</a></p>`,
  };

  await sendEmail(verifyEmail);

  try {
    await user.save();
  } catch (error) {
    if (error.message.includes("duplicate key error collection")) {
      return res.status(409).json({ message: "Email in use" });
    }
    next(error);
  }
  res.json({
    user: {
      email: user.email,
      subscription: "starter",
    },
  });
};

const verifyEmail = async (req, res) => {
  console.log("1")
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  
  if (!user) {
    throw httpError(404, "Email not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Verification is successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(404, "Email not found");
  }
  if (user.verify) {
    throw httpError(400, "Verification has already been passed");
  }
  await User.findOneAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  const verifyEmail = {
    to: email,
    subject: "Email verification",
    html: `<p>Please, confirm your email <a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify your email</a><p>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(500, "Email or password is wrong");
  }

  if (!user.verify) {
    throw httpError(401, "Email is not verified");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw httpError(500, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, KEY_SECRET, { expiresIn: "23h" });
  user.token = token;
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const userCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};
const userLogout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: null });
  res.status(204).json({});
};

const setSubscription = async (req, res) => {
  const { subscription } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { subscription },
    { new: true }
  );
  res.json({
    user: {
      name: user.name,
      email: user.email,
      subscription: user.subscription,
    },
  });
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
  userSignup: tryCatchWrapper(userSignup),
  verifyEmail: tryCatchWrapper(verifyEmail),
  resendVerifyEmail: tryCatchWrapper(resendVerifyEmail),
  userLogin: tryCatchWrapper(userLogin),
  userCurrent: tryCatchWrapper(userCurrent),  
  userLogout: tryCatchWrapper(userLogout),
  setSubscription: tryCatchWrapper(setSubscription),
  userChangeAvatar: tryCatchWrapper(userChangeAvatar),
};
