const prisma = require('../config/db.config');

const getTodos = async (req, res) => {
  console.log('\n📋 Fetching Todos:');
  
  try {
    console.log('  🔍 Finding todos for user:', req.userId);
    const todos = await prisma.todo.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`  ✅ Found ${todos.length} todos`);
    res.json(todos);
  } catch (error) {
    console.log('  ❌ Error fetching todos:', error.message);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

const createTodo = async (req, res) => {
  console.log('\n➕ Creating Todo:');
  
  try {
    const { content } = req.body;

    if (!content) {
      console.log('  ❌ No content provided');
      return res.status(400).json({ error: 'Content is required' });
    }

    console.log('  💾 Saving todo...');
    const todo = await prisma.todo.create({
      data: {
        content,
        userId: req.userId
      }
    });

    console.log('  ✅ Todo created:', todo.id);
    res.status(201).json(todo);
  } catch (error) {
    console.log('  ❌ Error creating todo:', error.message);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

const updateTodo = async (req, res) => {
  console.log('\n✏️ Updating Todo:');
  
  try {
    const { id } = req.params;
    const { content, completed } = req.body;

    console.log('  🔍 Checking todo ownership...');
    const todo = await prisma.todo.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId
      }
    });

    if (!todo) {
      console.log('  ❌ Todo not found or unauthorized');
      return res.status(404).json({ error: 'Todo not found' });
    }

    console.log('  💾 Updating todo...');
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { 
        ...(content !== undefined && { content }),
        ...(completed !== undefined && { completed })
      }
    });

    console.log('  ✅ Todo updated:', id);
    res.json(updatedTodo);
  } catch (error) {
    console.log('  ❌ Error updating todo:', error.message);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

const deleteTodo = async (req, res) => {
  console.log('\n🗑️ Deleting Todo:');
  
  try {
    const { id } = req.params;

    console.log('  🔍 Checking todo ownership...');
    const todo = await prisma.todo.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId
      }
    });

    if (!todo) {
      console.log('  ❌ Todo not found or unauthorized');
      return res.status(404).json({ error: 'Todo not found' });
    }

    console.log('  🗑️ Deleting todo...');
    await prisma.todo.delete({
      where: { id: parseInt(id) }
    });

    console.log('  ✅ Todo deleted:', id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.log('  ❌ Error deleting todo:', error.message);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};