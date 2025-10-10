const router = require('express').Router();
const Todo_model = require('../models/todo');

router.get('/', async (req, res) => {
  try {
    const todos = await Todo_model.find();
    res.render('index', { todos });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching todos');
  }
});


router.post('/add/todo', (req, res) => {
  const { todo, username} = req.body;
  const newTodo = new Todo_model({
    todo,
    username,
    done: '0',
  });

  newTodo
    .save()
    .then(() => {
      console.log('Todo Added');
      res.redirect('/');
    })
    .catch((err) => console.log(err));
});

router.get('/delete/todo/:_id', (req, res) => {
  const { _id } = req.params;
  Todo_model.deleteOne({ _id })
    .then(() => {
      console.log('deleted');
      res.redirect('/');
    })
    .catch((err) => console.log(err));
});

router.get('/update/todo/:_id', (req, res) => {
  const { _id } = req.params;
  const info = Todo_model.find();
  console.log(info);
  Todo_model.updateOne({ _id }, { done: '1' })
    .then(() => {
      console.log('updated');
      res.redirect('/');
    })
    .catch((err) => console.log(err));
});

module.exports = router;
