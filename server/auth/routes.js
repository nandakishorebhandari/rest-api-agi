const router = require('express').Router();
const { verifyUser, } = require('./auth');
const controller = require('./controller');

router.post('/signin', verifyUser(), controller.signIn);

module.exports = router;
