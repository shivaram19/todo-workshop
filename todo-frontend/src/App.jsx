import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TodoList from './components/TodoList';
import Signup from './components/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<>..you have to come to route that doesn't exist </>} />
      </Routes>
    </Router>
  );
}

export default App;