const router = require('express').Router();
const todoController = require('./todo-controller');

router.param('id', todoController.params);

router.route('/')
  .get(todoController.get)
  .post(todoController.post);

router.route('/:id')
  .get(todoController.getOne)
  .put(todoController.put)
  .delete(todoController.delete);

module.exports = router;