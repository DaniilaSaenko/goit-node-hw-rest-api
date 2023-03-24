const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { httpError } = require("../helpers");

const dotenv = require("dotenv");
dotenv.config();

const { KEY_SECRET } = process.env;

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    next(httpError(401));
  }
  try {
    const { id } = jwt.verify(token, KEY_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(httpError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    next(httpError(401, error.message));
  }
};

module.exports = {
  auth,
};
