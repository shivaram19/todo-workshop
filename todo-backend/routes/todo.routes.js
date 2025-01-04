const express = require('express');
const authenticateUser = require('../middleware/auth.middleware');
const { 
  getTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo 
} = require('../controllers/todo.controller');

const router = express.Router();

router.use(authenticateUser);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;