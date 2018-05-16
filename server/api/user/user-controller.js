const User = require('./user-model');
const _ = require('lodash');
const signToken = require('../../auth/auth').signToken;

const params = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).select('-password').exec();
    if (!user) {
      next(new Error('No user with that id'));
    } else {
      req.paramUser = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').exec();
    res.json(users.map(user => user.toJson()));
  } catch (error) {
    next(error);
  }
};

const getOne = (req, res) => {
  const user = req.paramUser;
  res.json(user.toJson());
};

const post = async (req, res, next) => {
  const newUser = new User(req.body);
  try {
    const saved = await newUser.save();
    const token = await signToken(saved._id);
    res.json({ token, });
  } catch (error) {
    next(error);
  }
};

const put = async (req, res, next) => {
  const user = req.paramUser;
  const update = req.body;

  _.merge(user, update);

  try {
    const saved = await user.save();
    res.json(saved.toJson());
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const removed = await req.paramUser.remove();
    res.json(removed.toJson());
  } catch (error) {
    next(error);
  }
};

const me = (req, res) => {
  res.json(req.paramUser.toJson());
};

const checkUser = (req, res, next) => {
  if(req.paramUser._id.toString() !== req.user._id.toString()) {
    return next(new Error('UnAUTHORized entry'));
  }
  return next();
};

module.exports = {
  params: params,
  get: get,
  getOne: getOne,
  post: post,
  put: put,
  delete: deleteOne,
  me: me,
  checkUser,
};
