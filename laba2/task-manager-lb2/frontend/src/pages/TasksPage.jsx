import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard.jsx';
import { api } from '../services/api.js';

function TasksPage({ user }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  async function loadTasks() {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function deleteTask(id) {
    const confirmed = window.confirm('Видалити задачу?');
    if (!confirmed) return;

    try {
      await api.deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <div className="page-title">
        <h2>Список задач</h2>
        <p>{user.role === 'admin' ? 'Адміністратор бачить усі задачі.' : 'Користувач бачить тільки власні задачі.'}</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={deleteTask} />
        ))}
      </div>

      {!tasks.length && <div className="empty">Задач поки немає.</div>}
    </section>
  );
}

export default TasksPage;
