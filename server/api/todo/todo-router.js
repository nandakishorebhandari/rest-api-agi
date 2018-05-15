const router = require('express').Router();
const todoController = require('./todo-controller');
const { decodeToken, getFreshUser, } = require('../../auth/auth');

router.param('id', todoController.params);

router.route('/')
  .get(todoController.get)
  .post(decodeToken(), getFreshUser(), todoController.post);

router.route('/:id')
  .get(decodeToken(), getFreshUser(), todoController.getOne)
  .put(decodeToken(), getFreshUser(), todoController.put)
  .delete(decodeToken(), getFreshUser(), todoController.delete);

module.exports = router;
