import React from 'react';
import { Link } from 'react-router-dom';

function statusLabel(status) {
  const labels = {
    new: 'Нова',
    in_progress: 'В роботі',
    done: 'Виконано'
  };

  return labels[status] || status;
}

function TaskCard({ task, onDelete }) {
  return (
    <article className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`badge ${task.status}`}>{statusLabel(task.status)}</span>
      </div>

      <p>{task.description}</p>
      <div className="task-meta">
        <span>Пріоритет: {task.priority}</span>
        <span>Дедлайн: {task.deadline}</span>
        <span>Виконавець: {task.userName}</span>
      </div>

      <div className="actions">
        <Link to={`/tasks/${task.id}`}>Деталі</Link>
        <Link to={`/edit/${task.id}`}>Редагувати</Link>
        <button onClick={() => onDelete(task.id)}>Видалити</button>
      </div>
    </article>
  );
}

export default TaskCard;
