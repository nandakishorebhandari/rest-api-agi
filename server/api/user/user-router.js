const router = require('express').Router();
const userController = require('./user-controller');

router.param('id', userController.params);

router.route('/')
  .get(userController.get)
  .post(userController.post);

router.route('/:id')
  .get(userController.getOne)
  .put(userController.put)
  .delete(userController.delete);

module.exports = router;