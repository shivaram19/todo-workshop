import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TodoItem from './TodoItem';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/todos', {
        withCredentials: true
      });
      setTodos(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch todos');
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/todos',
        { content: newTodo },
        { withCredentials: true }
      );
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const handleUpdate = async (id, content) => {
    try {
      await axios.put(`http://localhost:3000/api/todos/${id}`,
        { content },
        { withCredentials: true }
      );
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`, {
        withCredentials: true
      });
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, {
        withCredentials: true
      });
      navigate('/login');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      {error && <p>{error}</p>}
      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
          required
        />
        <button type="submit">Add Todo</button>
      </form>

      <div>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default TodoList;