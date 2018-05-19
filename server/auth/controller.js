const { signToken, } = require('./auth');

const signIn = (req, res) => {
  const token = signToken(req.user._id);
  res.status(200).json({ token, });
};

module.exports = {
  signIn,
};
