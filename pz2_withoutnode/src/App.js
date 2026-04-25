import React, { useState } from 'react';

function App() {
  const [filter, setFilter] = useState('all');

  const tasks = [
    { id: 1, title: 'Зробити ЛБ1 Django', completed: true },
    { id: 2, title: 'Зробити ПЗ2 JSON/fetch', completed: false },
    { id: 3, title: 'Повторити React', completed: false },
    { id: 4, title: 'Підготувати звіт', completed: true }
  ];

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true; // all
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Список завдань</h1>

      <label>
        Фільтр:
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ marginLeft: '8px' }}
        >
          <option value="all">Усі</option>
          <option value="completed">Завершені</option>
          <option value="incomplete">Незавершені</option>
        </select>
      </label>

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id}>
            {task.title} — {task.completed ? 'Завершено' : 'Не завершено'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;