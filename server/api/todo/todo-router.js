const router = require('express').Router();
const todoController = require('./todo-controller');
const { decodeToken, getFreshUser, } = require('../../auth/auth');

router.param('id', todoController.params);

router.route('/')
  .get(decodeToken(), getFreshUser(), todoController.get)
  .post(decodeToken(), getFreshUser(), todoController.post);

router.route('/:id')
  .get(decodeToken(), getFreshUser(), todoController.checkAuthor, todoController.getOne)
  .put(decodeToken(), getFreshUser(), todoController.checkAuthor, todoController.put)
  .delete(decodeToken(), getFreshUser(), todoController.checkAuthor, todoController.delete);

module.exports = router;
