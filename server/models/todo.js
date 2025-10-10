const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  username: {        
    type: String,
    required: true,
  },
  done: {
    type: String,
    required: true,
    default: "0"
  },
});

module.exports = mongoose.model('Todo', TodoSchema);
