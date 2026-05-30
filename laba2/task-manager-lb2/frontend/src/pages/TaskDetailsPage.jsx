import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';

function TaskDetailsPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await api.getTask(id);
        setTask(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadTask();
  }, [id]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!task) {
    return <div className="empty">Завантаження...</div>;
  }

  return (
    <section className="panel">
      <h2>{task.title}</h2>
      <p>{task.description}</p>

      <div className="details-grid">
        <div><strong>Статус:</strong> {task.status}</div>
        <div><strong>Пріоритет:</strong> {task.priority}</div>
        <div><strong>Дедлайн:</strong> {task.deadline}</div>
        <div><strong>Виконавець:</strong> {task.userName}</div>
        <div><strong>Email користувача:</strong> {task.userEmail}</div>
        <div><strong>Дата створення:</strong> {new Date(task.createdAt).toLocaleString('uk-UA')}</div>
      </div>

      <div className="actions">
        <Link to={`/edit/${task.id}`}>Редагувати</Link>
        <Link to="/">Назад до списку</Link>
      </div>
    </section>
  );
}

export default TaskDetailsPage;
