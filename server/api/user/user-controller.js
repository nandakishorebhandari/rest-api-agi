const User = require('./user-model');
const _ = require('lodash');
const signToken = require('../../auth/auth').signToken;

const params = (req, res, next, id) => {
  User.findById(id)
    .then(user => {
      if (!user) {
        next(new Error('No user with that id'));
      } else {
        req.user = user;
        next();
      }
    }, err => {
      next(err);
    });
};

const get = (req, res, next) => {
  User.find({})
    .then(users => {
      res.json(users);
    }, err => {
      next(err);
    });
};

const getOne = (req, res) => {
  const user = req.user;
  res.json(user);
};

const post = (req, res, next) => {
  const newUser = new User(req.body);

  newUser.save()
    .then(user => {
      const token = signToken(user._id);
      res.json({ token, });
    }, err => {
      next(err);
    });
};

const put = (req, res, next) => {
  const user = req.user;
  const update = req.body;

  _.merge(user, update);

  user.save()
    .then(saved => {
      res.json(saved);
    }, err => {
      next(err);
    });
};

const deleteOne = (req, res, next) => {
  req.user.remove()
    .then(removed => {
      res.json(removed);
    }, err => {
      next(err);
    });
};

module.exports = {
  params: params,
  get: get,
  getOne: getOne,
  post: post,
  put: put,
  delete: deleteOne,
};