const Todo = require('./todo-model');
const _ = require('lodash');

const params = async (req, res, next, id) => {
  try {
    const todo = await Todo.findById(id).populate('author', 'username').exec();
    if (!todo) {
      return next(new Error('No todo with that id'));
    }
    req.paramTodo = todo;
    return next();
  } catch (error) {
    return next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const todos = await Todo.find({ author: { _id:  req.user._id, }, }).populate('author', 'username').exec();
    res.json(todos);
  } catch (error) {
    return next(error);
  }
};

const getOne = (req, res) => {
  const todo = req.paramTodo;
  res.json(todo);
};

const post = async (req, res, next) => {
  const newTodo = req.body;
  newTodo.author = req.user._id;
  try {
    const todo = await Todo.create(newTodo);
    res.json(todo);
  }
  catch (error) {
    return next(error);
  }
};

const put = async (req, res, next) => {
  const todo = req.paramTodo;
  const update = req.body;

  _.merge(todo, update);

  try {
    const saved = await todo.save();
    res.json(saved);
  } catch (error) {
    return next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const removed = await req.paramTodo.remove();
    res.json(removed);
  } catch (error) {
    return next(error);
  }
};

const checkAuthor = (req, res, next) => {
  if(req.paramTodo.author._id.toString() !== req.user._id.toString()) {
    return next(new Error('UnAUTHORized entry'));
  }
  return next();
};

module.exports = {
  params,
  get,
  getOne,
  post,
  put,
  deleteOne,
  checkAuthor,
};
