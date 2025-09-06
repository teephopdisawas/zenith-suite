import React, { useState } from 'react';
import { Todo } from '../types';
import { TrashIcon } from './icons';

const initialTodos: Todo[] = [
  { id: '1', text: 'Finish project proposal', completed: false },
  { id: '2', text: 'Go grocery shopping', completed: true },
  { id: '3', text: 'Call the bank', completed: false },
];

const TodoItem: React.FC<{
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}> = ({ todo, onToggle, onDelete }) => {
    return (
        <li className="flex items-center justify-between bg-secondary p-4 rounded-lg group">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    className="h-5 w-5 rounded border-border-color text-accent focus:ring-accent cursor-pointer"
                />
                <span className={`ml-4 text-text-primary ${todo.completed ? 'line-through text-text-secondary' : ''}`}>
                    {todo.text}
                </span>
            </div>
            <button
                onClick={() => onDelete(todo.id)}
                className="text-text-secondary hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </li>
    );
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    };
    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">To-Do List</h2>
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow bg-secondary text-text-primary p-3 rounded-lg border border-border-color focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className="bg-accent hover:bg-accent-hover text-accent-text font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Add
        </button>
      </form>
      <ul className="space-y-3">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
