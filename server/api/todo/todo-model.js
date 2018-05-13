const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('todo', TodoSchema);