import { useState } from 'react';

export const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build a Todo App' },
    { id: 3, text: 'Master JavaScript' },
    { id: 4, text: 'Learn React' },
    { id: 5, text: 'Build a Todo App' },
    { id: 6, text: 'Master JavaScript' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos((currentTodos) => [
        ...currentTodos,
        { id: Date.now(), text: inputValue.trim() }
      ]);
      setInputValue('');
    }
  };

  const deleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id, newText) => {
    setTodos((currentTodos) => currentTodos.map((todo) => (
      todo.id === id ? { ...todo, text: newText } : todo
    )));
  };

  return (
    <div>
      <h2>Todo List</h2>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a new todo..."
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => updateTodo(todo.id, `Updated: ${todo.text}`)}>
              Update
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
