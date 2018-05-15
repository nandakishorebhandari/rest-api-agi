const User = require('./user-model');
const _ = require('lodash');

const params = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      next(new Error('No user with that id'));
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getOne = (req, res) => {
  const user = req.user;
  res.json(user);
};

const post = async (req, res, next) => {
  const newUser = req.body;

  try {
    const created = await User.create(newUser);
    res.json(created);
  } catch (error) {
    next(error);
  }
};

const put = async (req, res, next) => {
  const user = req.user;
  const update = req.body;

  _.merge(user, update);

  try {
    const saved = await user.save();
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const removed = await req.user.remove();
    res.json(removed);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  params: params,
  get: get,
  getOne: getOne,
  post: post,
  put: put,
  delete: deleteOne,
};