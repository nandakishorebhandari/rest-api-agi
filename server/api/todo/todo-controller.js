const Todo = require('./todo-model');
const _ = require('lodash');

const params = async (req, res, next, id) => {
  try {
    const todo = await Todo.findById(id).populate('author', 'username').exec();
    if (!todo) {
      next(new Error('No todo with that id'));
    } else {
      req.todo = todo;
      next();
    }
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const todos = await Todo.find({}).populate('author', 'username').exec();
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

const getOne = (req, res) => {
  const todo = req.todo;
  res.json(todo);
};

const post = async (req, res, next) => {
  const newTodo = req.body;
  try {
    const todo = await Todo.create(newTodo);
    res.json(todo);
  }
  catch (error) {
    next(error);
  }
};

const put = async (req, res, next) => {
  const todo = req.todo;
  const update = req.body;

  _.merge(todo, update);

  try {
    const saved = await todo.save();
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const removed = await req.todo.remove();
    res.json(removed);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  params: params,
  get: get,
  getOne: getOne,
  post: post,
  put: put,
  delete: deleteOne,
};
