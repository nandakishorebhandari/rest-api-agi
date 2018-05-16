const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../config');
const checkToken = expressJwt({ secret: config.secret, });
const User = require('../api/user/user-model');

exports.decodeToken = () => (req, res, next) => {
  if (req.query && req.query.hasOwnProperty('access_token')) {
    req.headers.authorization = 'Bearer ' + req.query.access_token;
  }
  checkToken(req, res, next); //It will attached the decoded token to req.user
};

exports.getFreshUser = () => async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(401).send('Unauthorized');
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    return next(error);
  }
};

exports.verifyUser = () => async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username, });
    if (!user) {
      res.status(401).send('No user with the given username');
    } else {
      if (!user.authenticate(req.body.password)) {
        res.status(401).send('Wrong password');
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.signToken = id => jwt.sign(
  { _id: id, },
  config.secret,
  { expiresIn: config.expireTime, }
);
