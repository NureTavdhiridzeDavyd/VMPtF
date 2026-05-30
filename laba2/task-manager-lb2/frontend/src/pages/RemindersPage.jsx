import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';

function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReminders() {
      try {
        const data = await api.getReminders();
        setReminders(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadReminders();
  }, []);

  return (
    <section className="panel">
      <h2>Планування та нагадування</h2>
      <p>Система показує задачі, дедлайн яких уже прострочений або настане протягом 3 днів.</p>

      {error && <div className="error">{error}</div>}

      <div className="reminder-list">
        {reminders.map((task) => (
          <div className="reminder-card" key={task.id}>
            <strong>{task.title}</strong>
            <span>{task.reminderType === 'overdue' ? 'Прострочено' : 'Дедлайн близько'}</span>
            <p>Дедлайн: {task.deadline}</p>
            <p>Виконавець: {task.userName}</p>
          </div>
        ))}
      </div>

      {!reminders.length && <div className="empty">Нагадувань немає.</div>}
    </section>
  );
}

export default RemindersPage;
