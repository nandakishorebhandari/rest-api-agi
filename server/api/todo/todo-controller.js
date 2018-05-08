const Todo = require('./todo-model');
const _ = require('lodash');

const params = (req, res, next, id) => {
  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        next(new Error('No todo with that id'));
      } else {
        req.todo = todo;
        next();
      }
    }, err => {
      next(err);
    });
};

const get = (req, res, next) => {
  Todo.find({})
    .then(todos => {
      res.json(todos);
    }, err => {
      next(err);
    });
};

const getOne = (req, res, next) => {
  const todo = req.todo;
  res.json(todo);
};

const post = (req, res, next) => {
  const newTodo = req.body;

  Todo.create(newTodo)
    .then(todo => {
      res.json(todo);
    }, err => {
      next(err);
    });
};

const put = (req, res, next) => {
  const todo = req.todo;
  const update = req.body;

  _.merge(todo, update);

  todo.save()
    .then(saved => {
      res.json(saved);
    }, err => {
      next(err);
    });
};

const deleteOne = (req, res, next) => {
  req.todo.remove()
    .then(removed => {
      res.json(removed);
    }, err => {
      next(err);
    });
};

module.exports = {
  params: params,
  get: get,
  getOne: getOne,
  post: post,
  put: put,
  delete: deleteOne,
};