const router = require('express').Router();
const todoRouter = require('./todo/todo-router');
const userRouter = require('./user/user-router');

router.use('/users', userRouter);
router.use('/todos', todoRouter);

module.exports = router;