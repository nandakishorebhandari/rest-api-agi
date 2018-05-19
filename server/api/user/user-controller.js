const User = require('./user-model');
const _ = require('lodash');
const signToken = require('../../auth/auth').signToken;

const params = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).select('-password').exec();
    if (!user) {
      return next(new Error('Unauthorized'));
    }
    req.paramUser = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

const getOne = (req, res) => {
  const user = req.paramUser;
  res.status(200).json(user.toJson());
};

const post = async (req, res, next) => {
  const newUser = new User(req.body);
  try {
    const saved = await newUser.save();
    const token = await signToken(saved._id);
    res.status(200).json({ token, });
  } catch (error) {
    return next(error);
  }
};

const put = async (req, res, next) => {
  const user = req.paramUser;
  const update = req.body;

  _.merge(user, update);

  try {
    const saved = await user.save();
    res.status(200).json(saved.toJson());
  } catch (error) {
    return next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const removed = await req.paramUser.remove();
    res.status(200).json(removed.toJson());
  } catch (error) {
    return next(error);
  }
};

const me = (req, res) => {
  res.status(200).json(req.user.toJson());
};

const checkUser = (req, res, next) => {
  if (req.paramUser._id.toString() !== req.user._id.toString()) {
    return next(new Error('Unauthorized'));
  }
  return next();
};

module.exports = {
  params,
  getOne,
  post,
  put,
  deleteOne,
  me,
  checkUser,
};
