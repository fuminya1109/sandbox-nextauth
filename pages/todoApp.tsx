import axios from 'axios';
import { useState, useEffect } from 'react';
import type { Todos } from '@prisma/client';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todos[]>([]);
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const res = await axios.get('api/todos');
        if (res.data) {
          setTodos(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadTodos();
  }, []);
  return (
    <div>
      <ul>
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <input type="checkbox" checked={todo.completed}></input>
              <label>{todo.text}</label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
