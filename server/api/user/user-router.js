const router = require('express').Router();
const userController = require('./user-controller');
const { decodeToken, getFreshUser, } = require('../../auth/auth');

router.param('id', userController.params);
router.get('/me', decodeToken(), getFreshUser(), userController.me);

router.route('/')
  .post(userController.post);

router.route('/:id')
  .get(decodeToken(), getFreshUser(), userController.checkUser, userController.getOne)
  .put(decodeToken(), getFreshUser(), userController.checkUser, userController.put)
  .delete(decodeToken(), getFreshUser(), userController.checkUser, userController.deleteOne);

module.exports = router;
